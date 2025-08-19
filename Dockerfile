# Stage 1: Builder
# This stage installs all dependencies (including dev) and builds the TypeScript server.
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all source code required for the build
# This includes server, client, shared code, and config files
COPY . .

# Run the server build command specifically
RUN npm run build:server

# Stage 2: Production
# This stage creates the final, lean image with only production dependencies and the built code.
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the built server code from the builder stage
COPY --from=builder /app/dist/server ./dist/server

# Expose the port the server will run on
EXPOSE 8080

# Command to start the server
# This should match the "start" script in package.json
CMD ["node", "dist/server/node-build.mjs"]
