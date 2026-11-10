import { hostedBookingRuntime } from '../components/booking/private-runtime';

import { createClient } from '@supabase/supabase-js';

// Refuse a mixed TEST/private and general-forms backend before creating the SDK client.
hostedBookingRuntime(import.meta.env);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
