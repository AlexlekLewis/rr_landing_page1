// Academy Shop pickup locations, server side (Stripe checkout label + order email).
// Same list as src/components/academy-shop/pickupVenues.js — change both together.
// The two centres (Alex, 5 Oct 2026); bundoora/hallam kept only so orders placed
// before the change still get the right address.
const VENUES = {
  'mickleham': { name: 'Mickleham Indoor Sports Centre', address: '3 Eclipse Drive, Mickleham VIC 3064' },
  'cranbourne-north': { name: 'Elite Cricket Centre — Cranbourne North', address: '30 Medley Drive, Cranbourne North VIC 3977' },
  'bundoora': { name: 'Cutting Edge Cricket — Bundoora', address: 'Unit 7, Factory 19, Enterprise Drive, Bundoora VIC 3083' },
  'hallam': { name: 'Cricket Connect — Hallam', address: '22 Technology CCT, Hallam VIC 3803' },
};

export const pickupVenue = (id) => VENUES[id] || null;
export const pickupLabel = (id) => {
  const v = VENUES[id];
  return v ? `Pickup — ${v.name}, ${v.address}` : 'Academy Pickup';
};
