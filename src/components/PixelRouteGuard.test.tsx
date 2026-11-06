// @vitest-environment jsdom
// In-app moves: PageView on allowed pages; a move into a page for under-13s
// switches events off and reloads, so the fresh load never loads Meta's script.
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act, cleanup } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import PixelRouteGuard from './PixelRouteGuard'
import { loadPage } from './pixelSnippet.testkit'

const realBlocked = loadPage('/rramadmin_26').window.rraPixelBlocked
let go: (path: string) => void

function Navigator() {
    go = useNavigate()
    return null
}

function start(path: string, pixelOn: boolean) {
    const reload = vi.fn()
    const fbq = vi.fn()
    Object.assign(window, { rraPixelOn: pixelOn || undefined, fbq, rraPixelBlocked: realBlocked })
    render(
        <MemoryRouter initialEntries={[path]}>
            <Navigator />
            <PixelRouteGuard reload={reload} />
        </MemoryRouter>,
    )
    return { reload, fbq }
}

const move = (path: string) => act(() => go(path))

beforeEach(() => cleanup())

describe('PixelRouteGuard', () => {
    it('sends nothing on the first page (index.html already sent PageView)', () => {
        const { reload, fbq } = start('/', true)
        expect(fbq).not.toHaveBeenCalled()
        expect(reload).not.toHaveBeenCalled()
    })

    it('sends one PageView per move between allowed pages', () => {
        const { reload, fbq } = start('/', true)
        move('/power-league')
        move('/spin-club')
        move('/spin-club?tab=2')
        expect(fbq.mock.calls).toEqual([['track', 'PageView'], ['track', 'PageView']])
        expect(reload).not.toHaveBeenCalled()
    })

    it.each(['/junior-royals', '/sid-juniors', '/carnival', '/lower-plenty-junior-royals-day', '/junior-royals-holiday'])(
        'switches events off and reloads on a move into %s',
        (child) => {
            const { reload, fbq } = start('/', true)
            move(child)
            expect(fbq.mock.calls).toEqual([['consent', 'revoke']])
            expect(reload).toHaveBeenCalledTimes(1)
        },
    )

    it('does nothing in a page where the Pixel never loaded (landed on a child page)', () => {
        const { reload, fbq } = start('/junior-royals', false)
        move('/')
        move('/power-league')
        move('/sid-juniors')
        expect(fbq).not.toHaveBeenCalled()
        expect(reload).not.toHaveBeenCalled()
    })
})
