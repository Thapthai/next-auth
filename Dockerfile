# Use Node.js 18 as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Remove node_modules and package-lock.json
RUN rm -rf node_modules package-lock.json

# Copy only package.json (เพราะไม่มี package-lock.json)
COPY package.json ./

# Use npm install instead of npm ci
RUN npm install

COPY package.json package-lock.json* ./
# Install all dependencies (including devDependencies) for build
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application (disable typecheck/lint)
ENV NEXT_DISABLE_ESLINT=true
ENV NEXT_DISABLE_TYPECHECK=true
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005
ENV HOSTNAME=0.0.0.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy standalone app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure correct ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3005

# Start the app (server.js = auto-generated)
CMD ["node", "server.js"] 