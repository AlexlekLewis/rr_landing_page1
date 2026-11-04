function decodedPath(path) {
  let decoded = path; try { decoded = decodeURIComponent(path); } catch { /* Invalid escapes never become a private route. */ }
  return decoded;
}
export const isBookingFlowPath = path => /^\/(?:book|booking|manage)(?:\/|$)/i.test(decodedPath(path));
export const isPrivateBookingPath = path => /^\/(?:book|booking|manage|mickleham|mickleham-launch|mickleham_launch|launch|private-coaching)(?:\/|$)/i.test(decodedPath(path));
export function privateBookingAnalytics(event, path = globalThis.location?.pathname || '') {
  if (isPrivateBookingPath(path)) return null;
  for (const key of ['$current_url', '$referrer']) {
    const value = event?.properties?.[key];
    if (typeof value === 'string') { try { if (isPrivateBookingPath(new URL(value).pathname)) return null; } catch { /* Other pages retain the existing analytics policy. */ } }
  }
  return event;
}
