/* TickSignal backend config — Supabase (free tier).
   -----------------------------------------------------------------
   The parent agent fills in the real values after the Supabase
   project is created via the browser (see ../backend/BROWSER-NEEDED.md,
   Step 5). Until then, the placeholders below keep the site working in
   DEGRADED mode: the intake pipeline shows "paused", and no upload
   is attempted.

   The anon public key is PUBLIC BY DESIGN (Supabase docs): row-level
   security on the `sightings` table and the `sighting-photos` storage
   bucket is what protects the data — anonymous users can only insert
   new sightings as status='pending' and read approved rows. The
   `service_role` key must NEVER be put in this file or any client code. */
window.TICKSIGNAL_CONFIG = {
  supabaseUrl: "https://dxkdpysvpicfjpawtyoo.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4a2RweXN2cGljZmpwYXd0eW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4ODYxMTksImV4cCI6MjEwNjQ2MjExOX0.KkqZvZMU3pSX21MwPjEfQQ6CKtzwS37ZfBJbTC2qOY4"
};
