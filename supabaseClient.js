// ============================================================
// supabaseClient.js — NexaInfluence Auth Helper
// ============================================================

const SUPABASE_URL  = 'https://bgykdjqzgiybfcbvjeps.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneWtkanF6Z2l5YmZjYnZqZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjE0MDAsImV4cCI6MjA5MTEzNzQwMH0.IATiAiXCa460jRluFVYYKOGsIAvV3L_7_TwsWw6NHOA';

// Wait for Supabase CDN to load before creating client
window.addEventListener('load', () => {
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded');
    return;
  }

  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  // Make helper functions globally available
  window.sendMagicLink = async (email) => {
    const { error } = await _supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/nexainfluence-dashboard.html' }
    });
    return error;
  };

  window.getSession = async () => {
    const { data } = await _supabase.auth.getSession();
    return data.session;
  };

  window.getCurrentUser = async () => {
    const { data } = await _supabase.auth.getUser();
    return data.user ?? null;
  };

  window.signOut = async () => {
    await _supabase.auth.signOut();
  };

  window.onAuthStateChange = (callback) => {
    return _supabase.auth.onAuthStateChange((_event, session) => callback(session));
  };

  window.adminCreateAuthUser = async (email) => {
    const { error } = await _supabase.auth.signInWithOtp({ email });
    return error;
  };
});
