// Test helper: runs the real Meta Pixel snippet from index.html at a given address with a
// stand-in window and document, and records whether Meta's script would be added.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'

export const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8') // vitest runs from the repo root
const match = html.match(/<!-- Meta Pixel Code[\s\S]*?<script>([\s\S]*?)<\/script>/)
if (!match) throw new Error('Meta Pixel snippet not found in index.html')
export const PIXEL_SNIPPET = match[1]

export function loadPage(pathname: string) {
    const inserted: { src?: string }[] = []
    const anchor = { parentNode: { insertBefore: (tag: { src?: string }) => inserted.push(tag) } }
    const document = { createElement: () => ({}), getElementsByTagName: () => [anchor] }
    const window: Record<string, any> = { location: { pathname }, document }
    runInNewContext(PIXEL_SNIPPET, { window, document })
    return { window, inserted }
}
