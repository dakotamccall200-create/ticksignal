/* TickSignal Supabase client — singleton wrapper.
   Load order on each page that uses it:
     assets/data.js -> assets/config.js ->
     https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 ->
     assets/supabase-client.js -> inline script
   Never throws when the backend is unconfigured or the CDN is offline;
   TS.configured() is false and TS.client() returns null in that case. */
(function () {
  function cfg() { return window.TICKSIGNAL_CONFIG || {}; }

  function hasPlaceholder(v) {
    return !v || typeof v !== 'string' || v.indexOf('PASTE') !== -1;
  }

  function configured() {
    var c = cfg();
    if (hasPlaceholder(c.supabaseUrl) || hasPlaceholder(c.supabaseAnonKey)) return false;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return false;
    return true;
  }

  var _client = null;
  function client() {
    if (!configured()) return null;
    if (!_client) {
      var c = cfg();
      _client = window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey);
    }
    return _client;
  }

  window.TS = { configured: configured, client: client };
})();
