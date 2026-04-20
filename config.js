// Infamous AI v2.0 — Frontend config
// These keys are PUBLIC (anon key is meant for browsers). All security is enforced by RLS + the edge function.
window.INFAMOUS_CONFIG = {
  SUPABASE_URL: "https://itvfcbmteedjrcvlqcib.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dmZjYm10ZWVkanJjdmxxY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2NzA3NzYsImV4cCI6MjA5MjI0Njc3Nn0.6dnZ--8C5czGxLt2QdNmW3tLpfvEPwVCvtqcQPgAb-c",
  CHAT_FN_URL: "https://itvfcbmteedjrcvlqcib.supabase.co/functions/v1/infamous-chat",
  // Where to redirect after login/signup
  AFTER_AUTH: "chat.html",
  // Where /admin lives
  ADMIN_PATH: "admin.html",
  // Brand
  BRAND_NAME: "Infamous AI",
  BRAND_VERSION: "v2.0",
  TAGLINE: "Made by Mikey – for developers, by developers.",
};
