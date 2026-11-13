import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Meta Pixel for in-app moves. The snippet in index.html loads the Pixel only on
 * allowed pages and turns off Meta's own history tracking, so this sends PageView
 * when the visitor moves to another allowed page.
 *
 * Moving into a page for under-13s (window.rraPixelBlocked, the list in
 * index.html) reloads that page once: the fresh load never loads Meta's script, so
 * nothing on it can reach Meta. Events are switched off first so nothing goes out
 * in the moment before the reload.
 */
export default function PixelRouteGuard({ reload = () => window.location.reload() }) {
  const { pathname } = useLocation()
  const last = useRef(pathname)

  useLayoutEffect(() => {
    if (last.current === pathname) return // first render: index.html already sent PageView
    last.current = pathname
    if (!window.rraPixelOn || typeof window.fbq !== 'function') return // Pixel not loaded in this page
    if (typeof window.rraPixelBlocked === 'function' && window.rraPixelBlocked(pathname)) {
      try { window.fbq('consent', 'revoke') } catch { /* reload below still clears it */ }
      reload()
      return
    }
    window.fbq('track', 'PageView')
  }, [pathname, reload])

  return null
}
