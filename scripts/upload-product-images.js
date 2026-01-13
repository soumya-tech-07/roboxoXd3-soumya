/**
 * Upload Product Images to Supabase Storage
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Run: node scripts/upload-product-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bjsnoccotxcviuahthmz.supabase.co';

// Read service role key
function getServiceKey() {
  // Try environment variable first
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  
  // Try .env.local
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        // Handle optional spaces around '=' and strip quotes
        const match = line.match(/^\\s*SUPABASE_SERVICE_ROLE_KEY\\s*=\\s*(.+)\\s*$/);
        if (match && match[1]) {
          const key = match[1].trim().replace(/^["']|["']$/g, '');
          if (key) {
            console.log('🔐 Loaded service key from .env.local');
            return key;
          }
        }
      }
    }
  } catch (e) {
    console.warn('⚠️ Unable to read .env.local:', e.message);
  }
  
  return null;
}

const serviceKey = getServiceKey();

if (!serviceKey) {
  console.error('\n❌ SUPABASE_SERVICE_ROLE_KEY is required!\n');
  console.error('📝 To fix this:');
  console.error('   1. Go to: https://supabase.com/dashboard/project/bjsnoccotxcviuahthmz/settings/api');
  console.error('   2. Copy the "service_role" key (⚠️  Keep it secret!)');
  console.error('   3. Add this line to your .env.local file:');
  console.error('      SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n');
  console.error('   4. Then run this script again: node scripts/upload-product-images.js\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to get MIME type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.heic': 'image/heic',
    '.JPG': 'image/jpeg',
    '.JPEG': 'image/jpeg',
    '.PNG': 'image/png',
    '.HEIC': 'image/heic'
  };
  return mimeTypes[ext] || 'image/jpeg';
}

// Helper function to create a safe filename for storage
function createStoragePath(localPath) {
  // Remove leading /images/ and convert to safe path
  let storagePath = localPath.replace(/^\/images\//, '');
  // Replace spaces and special chars with hyphens
  storagePath = storagePath.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_/]/g, '-');
  // Ensure lowercase
  storagePath = storagePath.toLowerCase();
  return storagePath;
}

// Check if file exists and is not HEIC (browser unsupported)
function isValidImageFile(filePath) {
  if (!filePath || filePath.startsWith('http')) {
    return false; // Skip URLs and placeholder images
  }
  
  const fullPath = path.join(process.cwd(), 'public', filePath);
  if (!fs.existsSync(fullPath)) {
    return false;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  // Skip HEIC files as they're not well supported in browsers
  if (ext === '.heic' || ext === '.HEIC') {
    return false;
  }
  
  return true;
}

async function uploadProductImages() {
  console.log('🚀 Starting product image uploads...\n');
  
  // Get all products from database
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, slug, name, image_url, hover_image_url, gallery');
  
  if (productsError) {
    console.error('❌ Error fetching products:', productsError);
    process.exit(1);
  }
  
  console.log(`📦 Found ${products.length} products\n`);
  
  // Collect all unique image paths
  const imageMap = new Map(); // Maps local path -> Supabase URL
  
  for (const product of products) {
    const images = [
      product.image_url,
      product.hover_image_url,
      ...(product.gallery || [])
    ].filter(Boolean);
    
    for (const imgPath of images) {
      if (isValidImageFile(imgPath) && !imageMap.has(imgPath)) {
        imageMap.set(imgPath, null); // Will be filled after upload
      }
    }
  }
  
  console.log(`📸 Found ${imageMap.size} unique images to upload\n`);
  
  // Upload all images
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  for (const [localPath, _] of imageMap.entries()) {
    try {
      const fullPath = path.join(process.cwd(), 'public', localPath);
      
      if (!fs.existsSync(fullPath)) {
        console.log(`⏭️  Skipping (not found): ${localPath}`);
        skippedCount++;
        continue;
      }
      
      const fileStats = fs.statSync(fullPath);
      const fileSizeKB = (fileStats.size / 1024).toFixed(2);
      
      // Check file size (5MB limit)
      if (fileStats.size > 5 * 1024 * 1024) {
        console.error(`❌ File too large (${fileSizeKB} KB): ${localPath}`);
        failCount++;
        continue;
      }
      
      console.log(`📤 Uploading ${localPath} (${fileSizeKB} KB)...`);
      
      const fileBuffer = fs.readFileSync(fullPath);
      const storagePath = createStoragePath(localPath);
      const contentType = getContentType(localPath);
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, fileBuffer, {
          contentType: contentType,
          upsert: true,
          cacheControl: '3600'
        });
      
      if (uploadError) {
        console.error(`❌ Upload failed: ${uploadError.message}`);
        failCount++;
        continue;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(storagePath);
      
      const publicUrl = urlData.publicUrl;
      imageMap.set(localPath, publicUrl);
      
      console.log(`✅ Uploaded: ${storagePath}`);
      console.log(`🔗 URL: ${publicUrl}\n`);
      successCount++;
      
    } catch (err) {
      console.error(`❌ Error uploading ${localPath}: ${err.message}\n`);
      failCount++;
    }
  }
  
  console.log('\n📊 Upload Summary:');
  console.log(`   ✅ Success: ${successCount}/${imageMap.size}`);
  console.log(`   ❌ Failed: ${failCount}/${imageMap.size}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}/${imageMap.size}\n`);
  
  // Update database with new URLs
  console.log('🔄 Updating database with new image URLs...\n');
  
  let updateSuccess = 0;
  let updateFail = 0;
  
  for (const product of products) {
    try {
      const updates = {};
      
      // Update main image
      if (product.image_url && imageMap.has(product.image_url)) {
        const newUrl = imageMap.get(product.image_url);
        if (newUrl) {
          updates.image_url = newUrl;
        }
      }
      
      // Update hover image
      if (product.hover_image_url && imageMap.has(product.hover_image_url)) {
        const newUrl = imageMap.get(product.hover_image_url);
        if (newUrl) {
          updates.hover_image_url = newUrl;
        }
      }
      
      // Update gallery
      if (product.gallery && Array.isArray(product.gallery)) {
        const newGallery = product.gallery.map(imgPath => {
          if (imageMap.has(imgPath)) {
            return imageMap.get(imgPath) || imgPath;
          }
          return imgPath; // Keep original if not uploaded (e.g., placeholder URLs)
        });
        updates.gallery = newGallery;
      }
      
      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`❌ Failed to update product ${product.id} (${product.slug}): ${updateError.message}`);
          updateFail++;
        } else {
          console.log(`✅ Updated product: ${product.name} (ID: ${product.id})`);
          updateSuccess++;
        }
      } else {
        console.log(`⏭️  No updates needed for: ${product.name} (ID: ${product.id})`);
      }
      
    } catch (err) {
      console.error(`❌ Error updating product ${product.id}: ${err.message}`);
      updateFail++;
    }
  }
  
  console.log('\n📊 Database Update Summary:');
  console.log(`   ✅ Success: ${updateSuccess}/${products.length}`);
  console.log(`   ❌ Failed: ${updateFail}/${products.length}`);
  
  if (successCount > 0 && updateSuccess > 0) {
    console.log('\n🎉 Product images uploaded and database updated successfully!');
  }
}

uploadProductImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });

