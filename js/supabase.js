// VIP BD Supabase client
const SUPABASE_URL='https://ihxwkebgjvtndynhosbk.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_wcazcpFqsX1TDEeVROpoDQ_rDGXDBDR';
let supabaseClient=null;
function initSupabase(){
  if(window.supabase && typeof window.supabase.createClient==='function'){
    supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
    return true;
  }
  return false;
}
if(!initSupabase()) console.error('Supabase JS library failed to load.');
