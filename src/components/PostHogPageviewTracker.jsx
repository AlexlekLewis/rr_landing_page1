import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePostHog } from 'posthog-js/react'

/**
 * Tracks SPA route changes in PostHog.
 * Since React Router doesn't trigger full page reloads,
 * we manually capture $pageview events on each route change.
 */
export default function PostHogPageviewTracker() {
  const location = useLocation()
  const posthog = usePostHog()

  useEffect(() => {
    if (posthog) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      })
    }
  }, [location.pathname, location.search, posthog])

  return null
}
