# Local dev image for the landing page (Vite + React).
# Used by docker-compose.yml; see README "Option C: Docker".
FROM node:22-bookworm-slim

WORKDIR /app

# Install dependencies first so they cache between source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173 4173

# --host makes Vite reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
