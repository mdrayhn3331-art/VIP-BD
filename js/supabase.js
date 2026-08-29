// VIP BD — Supabase client
const SUPABASE_URL = 'https://fvuiisuzwezruxmlljty.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_NC5zaQusqVNFdoi3d8s9Ow_5wbtQF1a';
let supabaseClient = null;
function initSupabase(){
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return true;
  }
  console.error('Supabase JS library failed to load.');
  return false;
}
initSupabase();
