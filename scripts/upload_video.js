import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Manually parse .env file
const envPath = path.resolve('.env');
let env = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadVideo() {
    const filePath = path.resolve('Media/Landing Page Full Edit v1.mov');
    const fileName = 'landing-page-full-edit-v1.mov';
    const bucketName = 'videos';

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);

    console.log(`Uploading ${fileName} to ${bucketName}...`);

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'video/quicktime'
        });

    if (error) {
        console.error('Error uploading file:', error);
    } else {
        console.log('File uploaded successfully:', data);
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
        console.log('Public URL:', publicUrl);
    }
}

uploadVideo();
