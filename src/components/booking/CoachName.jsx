import React, { useState } from 'react';
import { coachPortrait } from './coach-portraits';

export default function CoachName({ coach, slug }) {
  const portrait = coachPortrait(slug), [failedSource, setFailedSource] = useState(null);
  const initials = coach.display_name.split(' ').filter(Boolean).map(name => name[0]).slice(0, 2).join('');
  return <div className="booking-coach-title">
    <span className="booking-avatar" aria-hidden="true">
      {portrait && failedSource !== portrait.src
        ? <img src={portrait.src} alt="" width="44" height="44" loading="lazy" style={{ objectPosition: portrait.position }} onError={() => setFailedSource(portrait.src)} />
        : initials}
    </span>
    <strong>{coach.display_name}</strong>
  </div>;
}
