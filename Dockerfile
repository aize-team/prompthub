# Stage 1: Base image
FROM node:20-alpine AS base

# Stage 2: Build the application
FROM base AS build
WORKDIR /app

# Install libc6-compat for native modules compatibility on Alpine
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN npm run build

# Stage 3: Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user and group for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the 'build' stage
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Optional: If your next.config.js has runtime dependencies, copy it
# COPY --from=build /app/next.config.js ./next.config.js

# Note on runtime cache:
# The .next/standalone output should ideally manage its own caching needs.
# If using ISR or other features requiring a writable /app/.next at runtime,
# ensure this directory is created and writable by the 'nextjs' user.
# e.g., RUN mkdir -p .next/cache && chown nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
