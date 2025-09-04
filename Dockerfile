# --- Stage 1: Dependency Installation ---
# This stage is dedicated to installing all npm dependencies.
# It's separated to take advantage of Docker's layer caching.
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm ci

# --- Stage 2: Application Builder ---
# This stage builds the Next.js application. It copies the dependencies
# from the 'deps' stage and the source code, then runs the build.
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the source code
COPY . .

# Set the NEXT_TELEMETRY_DISABLED environment variable to 1 to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# Run the Next.js build command.
# This will generate the production-ready application, including the standalone server.
RUN npm run build:next

# --- Stage 3: Production Runner ---
# This is the final stage that creates the lean production image.
# It uses a minimal Node.js image and copies only the necessary artifacts
# from the 'builder' stage.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Create a non-root user for security purposes
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the user to the non-root user
USER nextjs

# The Next.js server runs on port 3000 by default.
EXPOSE 3000

# The command to start the production Next.js server.
CMD ["node", "server.js"]
