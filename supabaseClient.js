// ============================================================
// supabaseClient.js — NexaInfluence Auth Helper
// ============================================================

const SUPABASE_URL  = 'https://bgykdjqzgiybfcbvjeps.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneWtkanF6Z2l5YmZjYnZqZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjE0MDAsImV4cCI6MjA5MTEzNzQwMH0.IATiAiXCa460jRluFVYYKOGsIAvV3L_7_TwsWw6NHOA';

// Create Supabase client (only once)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// ---------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------

async function sendMagicLink(email) {
  const { error } = await _supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + '/nexainfluence-dashboard.html',
    },
  });
  return error;
}

async function adminCreateAuthUser(email) {
  const { error } = await _supabase.auth.signInWithOtp({ email });
  return error;
}

async function getSession() {
  const { data } = await _supabase.auth.getSession();
  return data.session;
}

async function getCurrentUser() {
  const { data } = await _supabase.auth.getUser();
  return data.user ?? null;
}

async function signOut() {
  await _supabase.auth.signOut();
}

function onAuthStateChange(callback) {
  return _supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
