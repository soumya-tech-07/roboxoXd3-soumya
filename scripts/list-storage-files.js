/**
 * List files in Supabase Storage to find green shirt images
 * 
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Run: node scripts/list-storage-files.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://bjsnoccotxcviuahthmz.supabase.co';

// Read service role key
function getServiceKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)\s*$/);
        if (match && match[1]) {
          const key = match[1].trim().replace(/^["']|["']$/g, '');
          if (key) {
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
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function listStorageFiles() {
  console.log('🔍 Searching for green shirt images in storage...\n');

  try {
    // List all files in the product-images bucket
    const { data: files, error } = await supabase.storage
      .from('product-images')
      .list('products', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      console.error('❌ Error listing files:', error);
      return;
    }

    console.log(`📁 Found ${files.length} folders in products/\n`);

    // Search for folders containing "green" or "pistachio"
    const greenFolders = files.filter(folder =>
      folder.name.toLowerCase().includes('green') ||
      folder.name.toLowerCase().includes('pistachio') ||
      folder.name.toLowerCase().includes('flag')
    );

    if (greenFolders.length === 0) {
      console.log('⚠️  No folders found with "green", "pistachio", or "flag" in the name.\n');
      console.log('📋 All product folders:');
      files.forEach(folder => {
        console.log(`   - ${folder.name}`);
      });
      return;
    }

    console.log('✅ Found folders matching green/pistachio:\n');

    for (const folder of greenFolders) {
      console.log(`📁 Folder: products/${folder.name}/`);

      // List files in this folder
      const { data: folderFiles, error: folderError } = await supabase.storage
        .from('product-images')
        .list(`products/${folder.name}`, {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (folderError) {
        console.error(`   ❌ Error listing files: ${folderError.message}\n`);
        continue;
      }

      if (folderFiles && folderFiles.length > 0) {
        console.log(`   📸 Files (${folderFiles.length}):`);
        folderFiles.forEach(file => {
          const publicUrl = `https://bjsnoccotxcviuahthmz.supabase.co/storage/v1/object/public/product-images/products/${folder.name}/${file.name}`;
          console.log(`      - ${file.name}`);
          console.log(`        🔗 ${publicUrl}`);
        });
      } else {
        console.log('   ⚠️  No files found in this folder');
      }
      console.log('');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

listStorageFiles();

// push to github
