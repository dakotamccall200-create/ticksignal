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
  supabaseUrl: "https://PASTE-PROJECT-URL.supabase.co",
  supabaseAnonKey: "PASTE-ANON-KEY"
};
