import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

// Variables the browser bundle cannot run without. .env is no longer committed, so on
// Vercel these must be set under Project -> Settings -> Environment Variables.
// src/lib/supabase.js calls createClient() at import time, so a missing value takes
// down every page. Failing the build instead keeps the last good deploy live.
const REQUIRED_BUILD_ENV = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const missing = REQUIRED_BUILD_ENV.filter((name) => !env[name])
    if (missing.length) {
      throw new Error(
        `Build stopped: missing ${missing.join(', ')}. ` +
        'Set them in Vercel (Production and Preview) or in a local .env — see .env.example.'
      )
    }
    if (!env.VITE_PUBLIC_POSTHOG_KEY) {
      console.warn('[build] VITE_PUBLIC_POSTHOG_KEY is not set — PostHog analytics will be off in this build.')
    }
  }

  return {
    plugins: [react()],
    server: {
      watch: {
        ignored: ['**/Media/**', '**/Master Landing Page/Media/**', '**/*.mp4', '**/*.zip', '**/*.mov']
      }
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer(),
        ],
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  }
})
