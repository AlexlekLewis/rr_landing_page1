import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import process from 'node:process';

// Run with: node --env-file=.env test-token.js   (see .env.example)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function addToken() {
    const token = crypto.randomUUID();
    console.log("Creating token:", token);
    const { data, error } = await supabase.from('offer_tokens').insert([{
        token: token,
        applicant_name: 'Test Applicant',
        applicant_email: 'test@example.com',
        status: 'pending',
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
    }]).select();

    if (error) {
        console.error("Error creating token:", error);
    } else {
        console.log("Token created successfully:", data);
    }
}
addToken();
