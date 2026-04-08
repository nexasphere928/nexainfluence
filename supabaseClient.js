// ============================================================
// supabaseClient.js — NexaInfluence Auth Helper
// Supabase is used ONLY for authentication (magic link login).
// All other data (applications, codes, payment info) lives in localStorage.
// ============================================================

// ⚠️  REPLACE these two values with your own Supabase project credentials.
// Find them in: Supabase Dashboard → Project Settings → API
const SUPABASE_URL  = 'https://bgykdjqzgiybfcbvjeps.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJneWtkanF6Z2l5YmZjYnZqZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjE0MDAsImV4cCI6MjA5MTEzNzQwMH0.IATiAiXCa460jRluFVYYKOGsIAvV3L_7_TwsWw6NHOA';

// Create the client
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,           // important
    autoRefreshToken: true,
    detectSessionInUrl: true        // helps after magic link redirect
  }
});

// Your existing functions (sendMagicLink, adminCreateAuthUser, etc.) stay the same
// Just make sure they are at the bottom

// ---------------------------------------------------------------
// Load the Supabase JS v2 client from CDN (included via <script>
// tag in each HTML file — do not import here again).
// This file just exports the single shared client instance.
// ---------------------------------------------------------------
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ---------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------

/** Send a magic-link login email to the given address. */
async function sendMagicLink(email) {
  const { error } = await _supabase.auth.signInWithOtp({
    email,
    options: {
      // After clicking the link the browser lands on the dashboard
      emailRedirectTo: window.location.origin + '/nexainfluence-dashboard.html',
    },
  });
  return error;
}

/**
 * Admin-only: create a Supabase Auth account for a newly approved influencer.
 * This is called from the admin panel after the admin clicks "Approve".
 * The influencer receives a magic link via signInWithOtp automatically
 * when they first try to log in — no separate invite step needed.
 */
async function adminCreateAuthUser(email) {
  // We use signInWithOtp on behalf of the user.
  // Supabase will create the account if it doesn't exist yet.
  const { error } = await _supabase.auth.signInWithOtp({ email });
  return error;
}

/** Get the currently logged-in Supabase session (or null). */
async function getSession() {
  const { data } = await _supabase.auth.getSession();
  return data.session;
}

/** Get the currently logged-in user object (or null). */
async function getCurrentUser() {
  const { data } = await _supabase.auth.getUser();
  return data.user ?? null;
}

/** Sign the current user out. */
async function signOut() {
  await _supabase.auth.signOut();
}

/** Listen for auth state changes (SIGNED_IN / SIGNED_OUT). */
function onAuthStateChange(callback) {
  return _supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
