import React from 'react';
import { Navigate } from 'react-router-dom';
import { COACH_PAGES_ENABLED } from './coachPagesConfig';

const CoachProfilePage = React.lazy(() => import('./CoachProfilePage'));

export default function CoachProfileRoute({ enabled = COACH_PAGES_ENABLED }) {
    return enabled ? <React.Suspense fallback={<p role="status" className="min-h-screen p-8">Loading coach…</p>}><CoachProfilePage /></React.Suspense> : <Navigate to="/coaches" replace />;
}
