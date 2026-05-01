// ============================================================
// Melbourne suburb → approximate lat/lng lookup.
// ============================================================
// Used by the analytics map widgets to plot inquiries / members
// geographically. Lat/lng are approximate centroids — accurate
// enough for cluster bubbles, not for navigation.
//
// Add new suburbs to the bottom of this list as they appear in
// the data. Keys must match the normalised suburb string from
// `normaliseSuburb()` (lowercased, trimmed).
// ============================================================

export const MELBOURNE_SUBURBS = {
  // North & North-East
  'bundoora':         { lat: -37.7000, lng: 145.0667 },
  'thomastown':       { lat: -37.6833, lng: 145.0167 },
  'wollert':          { lat: -37.6000, lng: 145.0333 },
  'doreen':           { lat: -37.6167, lng: 145.1500 },
  'mernda':           { lat: -37.6000, lng: 145.0833 },
  'south morang':     { lat: -37.6500, lng: 145.0833 },
  'epping':           { lat: -37.6500, lng: 145.0333 },
  'mill park':        { lat: -37.6667, lng: 145.0667 },
  'craigieburn':      { lat: -37.6000, lng: 144.9333 },
  'mickleham':        { lat: -37.5500, lng: 144.9000 },
  'donnybrook':       { lat: -37.5500, lng: 144.9667 },
  'kalkallo':         { lat: -37.5333, lng: 144.9500 },
  'wallan':           { lat: -37.4167, lng: 144.9833 },
  'preston':          { lat: -37.7500, lng: 145.0167 },
  'northcote':        { lat: -37.7667, lng: 145.0000 },
  'eltham':           { lat: -37.7167, lng: 145.1500 },
  'diamond creek':    { lat: -37.6667, lng: 145.1500 },
  'reservoir':        { lat: -37.7167, lng: 145.0167 },
  'brunswick':        { lat: -37.7667, lng: 144.9667 },
  'flemington':       { lat: -37.7833, lng: 144.9333 },
  'coburg':           { lat: -37.7500, lng: 144.9667 },

  // East & South-East
  'glen waverley':    { lat: -37.8833, lng: 145.1667 },
  'mount waverley':   { lat: -37.8833, lng: 145.1333 },
  'rowville':         { lat: -37.9333, lng: 145.2333 },
  'wantirna':         { lat: -37.8500, lng: 145.2333 },
  'wantirna south':   { lat: -37.8667, lng: 145.2333 },
  'mooroolbark':      { lat: -37.7833, lng: 145.3167 },
  'mitcham':          { lat: -37.8167, lng: 145.1833 },
  'nunawading':       { lat: -37.8167, lng: 145.1667 },
  'doncaster east':   { lat: -37.7833, lng: 145.1667 },
  'doncaster':        { lat: -37.7833, lng: 145.1333 },
  'templestowe':      { lat: -37.7500, lng: 145.1333 },
  'balwyn north':     { lat: -37.7833, lng: 145.0833 },
  'hawthorn':         { lat: -37.8167, lng: 145.0333 },
  'hawthorn east':    { lat: -37.8333, lng: 145.0500 },
  'chadstone':        { lat: -37.8833, lng: 145.0833 },
  'ashwood':          { lat: -37.8667, lng: 145.0833 },
  'oakleigh':         { lat: -37.9000, lng: 145.0833 },
  'clarinda':         { lat: -37.9333, lng: 145.0833 },

  // South-East growth
  'berwick':          { lat: -38.0333, lng: 145.3500 },
  'pakenham':         { lat: -38.0833, lng: 145.4833 },
  'officer':          { lat: -38.0667, lng: 145.4167 },
  'cranbourne':       { lat: -38.1000, lng: 145.2833 },
  'cranbourne east':  { lat: -38.1167, lng: 145.3000 },
  'cranbourne west':  { lat: -38.1000, lng: 145.2667 },
  'cranbourne north': { lat: -38.0833, lng: 145.2833 },
  'clyde':            { lat: -38.1500, lng: 145.3333 },
  'clyde north':      { lat: -38.1167, lng: 145.3500 },
  'lynbrook':         { lat: -38.0667, lng: 145.2667 },
  'lyndhurst':        { lat: -38.0500, lng: 145.2333 },
  'hampton park':     { lat: -38.0333, lng: 145.2667 },
  'narre warren':     { lat: -38.0333, lng: 145.3000 },
  'narre warren south': { lat: -38.0500, lng: 145.3000 },
  'hallam':           { lat: -38.0167, lng: 145.2667 },
  'dandenong':        { lat: -37.9833, lng: 145.2167 },
  'dandenong north':  { lat: -37.9667, lng: 145.2167 },
  'botanic ridge':    { lat: -38.1500, lng: 145.2667 },

  // West & South-West growth
  'truganina':        { lat: -37.8167, lng: 144.7500 },
  'tarneit':          { lat: -37.8333, lng: 144.6833 },
  'point cook':       { lat: -37.9167, lng: 144.7500 },
  'wyndham vale':     { lat: -37.8833, lng: 144.6333 },
  'williams landing': { lat: -37.8667, lng: 144.7500 },
  'aintree':          { lat: -37.7333, lng: 144.6833 },
  'fraser rise':      { lat: -37.7333, lng: 144.7333 },
  'rockbank':         { lat: -37.7333, lng: 144.6667 },
  'caroline springs': { lat: -37.7500, lng: 144.7333 },
  'sunshine':         { lat: -37.7833, lng: 144.8333 },
  'keilor east':      { lat: -37.7333, lng: 144.8667 },
  'st albans':        { lat: -37.7500, lng: 144.8000 },
  'diggers rest':     { lat: -37.7000, lng: 144.7500 },
  'taylors hill':     { lat: -37.7167, lng: 144.7667 },

  // South / Bayside
  'brighton':         { lat: -37.9167, lng: 144.9833 },
  'brighton east':    { lat: -37.9167, lng: 145.0167 },
  'bentleigh':        { lat: -37.9167, lng: 145.0333 },
  'bentleigh east':   { lat: -37.9167, lng: 145.0500 },
  'caulfield':        { lat: -37.8833, lng: 145.0167 },
  'st kilda':         { lat: -37.8667, lng: 144.9833 },
  'mentone':          { lat: -37.9833, lng: 145.0667 },

  // CBD & Inner
  'melbourne':        { lat: -37.8136, lng: 144.9631 },
  'docklands':        { lat: -37.8167, lng: 144.9333 },
  'south yarra':      { lat: -37.8333, lng: 144.9833 },
  'richmond':         { lat: -37.8167, lng: 145.0000 },
  'collingwood':      { lat: -37.8000, lng: 144.9833 },

  // Outer / regional commuters seen in the data
  'warragul':         { lat: -38.1500, lng: 145.9333 },
  'ballarat':         { lat: -37.5667, lng: 143.8500 },
  'geelong':          { lat: -38.1500, lng: 144.3500 },
};

// Lower-case + trim a raw suburb string before lookup.
export const normaliseSuburbForLookup = (raw) => {
  if (!raw) return null;
  return String(raw).toLowerCase().trim()
    // Strip postcodes
    .replace(/\b\d{4}\b/g, '')
    // Strip ", Victoria" / ", VIC" / ", Australia" suffixes
    .replace(/,?\s*(victoria|vic|australia)\b.*$/i, '')
    // Strip leading street numbers / addresses like "347a hull road mooroolbark"
    .replace(/^\d+\w*\s+\w+\s+(st|street|cres|crescent|way|rd|road|ave|avenue|dr|drive|hwy|highway|ct|court)\s+/i, '')
    .trim();
};

// Approximate centre of Melbourne (used as map default centre).
export const MELBOURNE_CENTRE = { lat: -37.85, lng: 145.05, zoom: 9 };
