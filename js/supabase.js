// Supabase client configuration for the VIP BD frontend.
// This uses the public publishable key only. Never expose a service_role/secret key here.
const SUPABASE_URL = 'https://ihxwkebgjvtndynhosbk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wcazcpFqsX1TDEeVROpoDQ_rDGXDBDR';

let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
