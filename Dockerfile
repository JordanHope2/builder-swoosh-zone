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

# Run the full build command for both client and server
RUN npm run build

# Stage 2: Production
# This stage creates the final, lean image with only production dependencies and the built code.
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the entire built application (client and server) from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the server will run on
EXPOSE 8080

# Command to start the server
# This should match the "start" script in package.json
CMD ["node", "dist/server/node-build.mjs"]
