/* TickSignal county-center helpers.
   The mapCounties arrays in data.js carry lat/lng per county (coarse
   county centers — never precise locations). Both the submit-page GPS
   matcher and the map-page verified-reports layer reuse these helpers
   so there is exactly one definition of "county center".
   Usage: countyCenters(countiesArray) -> {CountyName:[lat,lng]}
          nearestCounty(countiesArray, lat, lng) -> county object */
(function () {
  function countyCenters(counties) {
    var out = {};
    (counties || []).forEach(function (c) {
      if (c && c.county && typeof c.lat === 'number' && typeof c.lng === 'number') {
        out[c.county] = [c.lat, c.lng];
      }
    });
    return out;
  }
  function nearestCounty(counties, lat, lng) {
    var best = null, bd = 1e9;
    (counties || []).forEach(function (c) {
      if (typeof c.lat !== 'number' || typeof c.lng !== 'number') return;
      var d = (c.lat - lat) * (c.lat - lat) + (c.lng - lng) * (c.lng - lng);
      if (d < bd) { bd = d; best = c; }
    });
    return best;
  }
  window.countyCenters = countyCenters;
  window.nearestCounty = nearestCounty;
})();
