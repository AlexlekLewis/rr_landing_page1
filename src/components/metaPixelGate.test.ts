// The Meta Pixel must never load on pages for programs aimed at children under 13
// (Meta's terms). This runs the real snippet from index.html at each address and
// checks whether Meta's script would be added to the page.
import { describe, it, expect } from 'vitest'
import { html, loadPage } from './pixelSnippet.testkit'

const CHILD_PAGES = [
    '/junior-royals', '/junior-royals/', '/JUNIOR-ROYALS/', '/junior-royals/success',
    '/junior-royals-term2', '/junior-royals-term2/success',
    '/junior-royals-holiday', '/junior-royals-holiday/success', '/holiday-programs', '/holiday-programs/anything',
    '/lower-plenty-junior-royals-day', '/lower-plenty-junior-royals-day/pay', '/lower-plenty-junior-royals-day/success', '/carnival',
    '/sid-juniors', '/sid-juniors/success',
    '/PGP2026/hallam/junior/success',
]
const STAFF_PAGES = ['/rramadmin_26', '/rramadmin_26/dashboard']
// Mixed-age pages keep the Pixel (Alex, 6 Nov 2026), as do the adult and general pages.
const ALLOWED_PAGES = [
    '/', '/power-league', '/spin-club', '/performance-squads', '/performance-squads/welcome', '/performance-squads-open-trial',
    '/PGP2026', '/PGP2026/apply', '/PGP2026/success', '/elite-royals', '/mickleham', '/coaches', '/academy-shop', '/tours',
    '/carnivals', '/holiday-programsx',
]

describe('Meta Pixel snippet in index.html', () => {
    it.each([...CHILD_PAGES, ...STAFF_PAGES])('does not load on %s', (path) => {
        const { window, inserted } = loadPage(path)
        expect(inserted).toHaveLength(0)
        expect(window.fbq).toBeUndefined()
        expect(window.rraPixelOn).toBeUndefined()
        expect(window.rraPixelBlocked(path)).toBe(true)
    })

    it.each(ALLOWED_PAGES)('loads once and sends PageView on %s', (path) => {
        const { window, inserted } = loadPage(path)
        expect(inserted).toHaveLength(1)
        expect(inserted[0].src).toBe('https://connect.facebook.net/en_US/fbevents.js')
        expect(window.fbq.queue.map((args: IArguments) => Array.from(args))).toEqual([
            ['init', '3125499870991789'],
            ['track', 'PageView'],
        ])
        expect(window.fbq.disablePushState).toBe(true)
        expect(window.rraPixelOn).toBe(true)
        expect(window.rraPixelBlocked(path)).toBe(false)
    })

    it('has no <noscript> pixel, which cannot be switched off per page', () => {
        expect(html).not.toMatch(/facebook\.com\/tr/)
    })
})
