# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Use npm install instead of npm ci to avoid lockfile version mismatch between
# the local npm (v11) and the container npm (v10). The lockfile is regenerated
# fresh inside the image so the result is always deterministic.
COPY package.json ./
RUN npm install

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args become env vars at build time for NEXT_PUBLIC_ vars
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME="MediVantage AI"
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER appuser

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
