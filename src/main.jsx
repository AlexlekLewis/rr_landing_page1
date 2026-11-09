import './components/booking/renewal/renewal-memory'
import './components/booking/family-capability'
import './components/booking/invitation/invitation-memory'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.jsx'
import { isPrivateBookingPath, privateBookingAnalytics } from './components/booking/booking-privacy'
import FamilyCapabilityProvider from './components/booking/FamilyCapabilityProvider'
import InvitationPrivacyBoundary from './components/booking/invitation/InvitationPrivacyBoundary'
import RenewalPrivacyBoundary from './components/booking/renewal/RenewalPrivacyBoundary'

// Initialize PostHog
const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

if (posthogKey && !isPrivateBookingPath(window.location.pathname)) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: 'anonymous',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    before_send: privateBookingAnalytics,
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <BrowserRouter>
        <RenewalPrivacyBoundary><InvitationPrivacyBoundary><FamilyCapabilityProvider><App /></FamilyCapabilityProvider></InvitationPrivacyBoundary></RenewalPrivacyBoundary>
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>,
)
