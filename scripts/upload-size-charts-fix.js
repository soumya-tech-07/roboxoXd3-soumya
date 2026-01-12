/**
 * Upload Size Chart Images to Supabase Storage
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Run: node scripts/upload-size-charts-fix.js
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
        const trimmed = line.trim();
        if (trimmed.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
          return trimmed.split('=')[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch (e) {
    // Ignore
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
  console.error('   4. Then run this script again: node scripts/upload-size-charts-fix.js\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const images = [
  {
    file: 'public/images/Leather jacket and varsity jacket.jpg',
    path: 'leather-jacket-and-varsity-jacket.jpg',
    category: 'JACKETS'
  },
  {
    file: 'public/images/Shirts.jpg',
    path: 'shirts.jpg',
    category: 'SHIRTS'
  },
  {
    file: 'public/images/Pants.jpg',
    path: 'pants.jpg',
    category: 'PANTS'
  },
  {
    file: 'public/images/Off shoulder and white tank top.jpg',
    path: 'off-shoulder-and-white-tank-top.jpg',
    category: 'TOPS'
  }
];

async function uploadImages() {
  console.log('🚀 Starting image uploads...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const image of images) {
    try {
      const filePath = path.join(process.cwd(), image.file);
      
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        failCount++;
        continue;
      }

      const fileStats = fs.statSync(filePath);
      console.log(`📤 Uploading ${image.file} (${(fileStats.size / 1024).toFixed(2)} KB)...`);
      
      const fileBuffer = fs.readFileSync(filePath);
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('size-chart-images')
        .upload(image.path, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error(`❌ Upload failed: ${uploadError.message}`);
        failCount++;
        continue;
      }

      console.log(`✅ Uploaded: ${image.path}`);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('size-chart-images')
        .getPublicUrl(image.path);
      
      const publicUrl = urlData.publicUrl;
      console.log(`🔗 URL: ${publicUrl}`);
      
      // Update database
      const { error: updateError } = await supabase
        .from('size_charts')
        .update({ image_url: publicUrl })
        .eq('category', image.category);

      if (updateError) {
        console.error(`❌ Database update failed: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`✅ Updated ${image.category} in database\n`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error: ${err.message}\n`);
      failCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${successCount}/${images.length}`);
  console.log(`   ❌ Failed: ${failCount}/${images.length}`);
  
  if (successCount === images.length) {
    console.log('\n🎉 All images uploaded successfully!');
  }
}

uploadImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  });

