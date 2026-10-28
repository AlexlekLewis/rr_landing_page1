# Rajasthan Royals Academy – Landing Pages

React 19 + Vite + Tailwind site, with serverless functions in `api/`, hosted on **Vercel**.
See `context.md` for what the site is and how it is organised.

## How a change gets to the live site

```
edit on a branch  →  commit + push  →  open a pull request  →  Vercel posts a preview URL
                                                             →  CI checks the build
merge the PR into main  →  Vercel deploys to production automatically
```

You never deploy by hand. Pushing to a branch gives you a preview; merging to `main` goes live.

## Pick a way to edit

### Option A: GitHub Codespaces (nothing to install, recommended)

VS Code running in your browser, with everything already set up.

1. On the repo page on GitHub, click **Code → Codespaces → Create codespace on main**.
2. Wait for the setup to finish (first time takes a few minutes; it runs `npm ci` for you).
3. In the terminal at the bottom, run `npm run dev`. The site opens in a preview tab (port 5173)
   and reloads as you save files.
4. Make a branch, edit, commit and push from the **Source Control** panel on the left
   (or see the git commands below), then open a pull request.

Stop the codespace when you're done (**Codespaces** menu, bottom-left) so it doesn't use up your free hours.

### Option B: VS Code on your own computer, with Docker

Install once:

- [VS Code](https://code.visualstudio.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (keep it running)
- [Git](https://git-scm.com/downloads)
- The VS Code **Dev Containers** extension (VS Code will suggest it when you open the repo)

Then:

1. Clone the repo: `git clone https://github.com/AlexlekLewis/rr_landing_page1.git`
2. Open the folder in VS Code and click **Reopen in Container** when prompted
   (or press `F1` → *Dev Containers: Reopen in Container*).
3. Run `npm run dev` in the VS Code terminal and open http://localhost:5173.

This gives you the same environment as Codespaces: Node 22, the project's dependencies,
GitHub CLI, Vercel CLI and the recommended extensions.

### Option C: Docker only (no VS Code container)

```bash
docker compose up
```

Site on http://localhost:5173 with live reload. To check the production build instead:

```bash
docker compose --profile preview up preview
```

Site on http://localhost:4173.

### Option D: Plain Node

Install Node 22 (`nvm use` reads `.nvmrc`), then `npm ci` and `npm run dev`.

## Everyday git commands

```bash
git checkout main && git pull                  # start from the latest live version
git checkout -b fix/short-description          # new branch for your change
# ...edit files...
git add -A && git commit -m "Describe the change"
git push -u origin fix/short-description       # then open the PR link git prints
```

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 5173 with live reload (front end only) |
| `npm run build` | Production build into `dist/` (what Vercel runs) |
| `npm run preview` | Serve the production build on port 4173 |
| `npm test` | Unit tests |
| `npm run test:api` | Tests for the `api/` functions |
| `npm run lint` | ESLint |
| `vercel dev` | Site **and** `api/` functions together on port 3000 (needs `vercel login` and `vercel link` once, plus access to the Vercel project) |

## Environment variables

- Front-end values (`VITE_*`) live in `.env` and are public by design: they ship in the browser bundle.
- Server secrets used by `api/` (Stripe, Supabase service role, Google service account, etc.)
  are set in the Vercel project settings, never in the repo. Run `vercel env pull` to get them
  locally if you need to run the API functions with `vercel dev`.

## CI

`.github/workflows/ci.yml` runs on every pull request: the production build and the API tests
must pass. Unit tests and lint run too, but only report for now, because both already have
failures on `main` that need fixing separately.
