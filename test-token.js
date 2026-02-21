import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = 'https://pudldzgmluwoocwxtzhw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZGxkemdtbHV3b29jd3h0emh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTA0OTQsImV4cCI6MjA4NDk4NjQ5NH0.X-pDkxLGDGIpno_HVmPTURXf4IZ2jucZURXjj3si0gg';
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
