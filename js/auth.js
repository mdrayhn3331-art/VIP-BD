function showMsg(x){const el=document.querySelector('#msg');if(el)el.textContent=x}
function togglePassword(id,btn){const el=document.getElementById(id);if(!el)return;el.type=el.type==='password'?'text':'password';if(btn)btn.textContent=el.type==='password'?'👁️':'🙈'}
function normalizePhone(v){return (v||'').replace(/\s+/g,'').trim()}
async function registerUser(){
 const full_name=document.getElementById('fullName')?.value.trim();
 const phone=normalizePhone(document.getElementById('phone')?.value);
 const email=document.getElementById('email')?.value.trim().toLowerCase();
 const password=document.getElementById('regPassword')?.value;
 const confirm=document.getElementById('confirmPassword')?.value;
 const referral_code=document.getElementById('referralCode')?.value.trim()||null;
 if(password!==confirm)return showMsg('পাসওয়ার্ড মিলছে না।');
 if(!supabaseClient)return showMsg('Supabase সংযোগ পাওয়া যায়নি।');
 const {data,error}=await supabaseClient.auth.signUp({email,password,options:{data:{full_name,phone,referral_code},emailRedirectTo:location.origin+'/home.html'}});
 if(error)return showMsg(error.message);
 if(data.session){showMsg('রেজিস্ট্রেশন সফল! আপনাকে Home-এ নেওয়া হচ্ছে...');setTimeout(()=>location.href='home.html',700);}
 else showMsg('রেজিস্ট্রেশন সফল! আপনার ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে। ইমেইলটি verify করে তারপর Login করুন।');
}
async function login(){const identifier=document.getElementById('identifier')?.value.trim();const password=document.getElementById('password')?.value;if(!supabaseClient)return showMsg('Supabase সংযোগ পাওয়া যায়নি।');let email=identifier;if(!identifier.includes('@')){const {data,error}=await supabaseClient.from('profiles').select('email').eq('phone',normalizePhone(identifier)).maybeSingle();if(error||!data?.email)return showMsg('এই মোবাইল নম্বরের অ্যাকাউন্ট পাওয়া যায়নি।');email=data.email}const {error}=await supabaseClient.auth.signInWithPassword({email,password});if(error)return showMsg(error.message);location.href='home.html'}
async function forgotPassword(){const identifier=document.getElementById('identifier')?.value.trim();if(!identifier||!identifier.includes('@'))return showMsg('পাসওয়ার্ড রিসেটের জন্য ইমেইল দিন।');const {error}=await supabaseClient.auth.resetPasswordForEmail(identifier,{redirectTo:location.origin+'/index.html'});showMsg(error?'রিসেট করা যায়নি: '+error.message:'পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে।')}
async function logout(){if(supabaseClient)await supabaseClient.auth.signOut();location.href='index.html'}
document.getElementById('loginForm')?.addEventListener('submit',e=>{e.preventDefault();login()});document.getElementById('registerForm')?.addEventListener('submit',e=>{e.preventDefault();registerUser()});