# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package descriptors for dependency installation
COPY package.json package-lock.json ./
RUN npm ci

# Copy project files
COPY . .

# Generate Prisma Client (so that types are generated and prisma query engine is compiled)
RUN npx prisma generate

# Build the standalone bundle
RUN npm run build

# Stage 2: Execution runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root system user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone server modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
