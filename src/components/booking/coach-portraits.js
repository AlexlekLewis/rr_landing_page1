// Website-owned portraits from the approved coach-profile page work (PR157,
// origin/feat/coach-profile-pages at 0896b0a4). This is presentation only:
// the live booking catalogue and slots decide who is available.
const portraits = Object.freeze({
  'ikroop-dhanoa': { src: '/assets/coaches/ikroop-dhanoa.jpg', position: '50% 22%' },
  'alex-thornhill': { src: '/assets/coaches/alex-thornhill.jpg', position: '50% 25%' },
  'ritin-raman': { src: '/assets/coaches/rittin-raman.jpg', position: '50% 22%' },
  'mihiraj-jayasekara': { src: '/assets/coaches/mihiraj-jayasekara.jpg', position: '50% 22%' },
});

export function coachPortrait(slug) {
  return typeof slug === 'string' && Object.hasOwn(portraits, slug) ? portraits[slug] : null;
}
