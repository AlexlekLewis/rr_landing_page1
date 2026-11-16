import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { track } from '../lib/metaPixel'
import { captureAttribution } from '../lib/attribution'

// Last route a PageView was counted for. Module-level, so StrictMode's double
// effect run can't count a route twice.
let lastRoute = null

/**
 * Meta Pixel PageView for SPA route changes. index.html fires the PageView for
 * the first document load, so the first route seen here is skipped.
 * Also stores any utm_* / fbclid an in-site link carries.
 */
export default function MetaPixelPageviewTracker() {
  const location = useLocation()

  useEffect(() => {
    const route = location.pathname + location.search
    if (lastRoute === null) { lastRoute = route; return }
    if (route === lastRoute) return
    lastRoute = route
    captureAttribution()
    track('PageView')
  }, [location.pathname, location.search])

  return null
}
