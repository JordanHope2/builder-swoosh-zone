# --- Stage 1: Build ---
# In this stage, we install all dependencies (including devDependencies)
# and run the full build process for all parts of the application.
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the entire source code
COPY . .

# Run the unified build script from package.json.
# This command builds both the original Vite SPA (`build:client`)
# and the Express server (`build:server`). The Next.js app (`build:next`)
# is not included in this Docker image as it's intended for a separate deployment
# or to be integrated later.
RUN npm run build


# --- Stage 2: Production ---
# This stage creates the final, lean production image. It copies only the
# necessary production dependencies and the built artifacts from the 'builder' stage.
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the built application artifacts from the builder stage.
# This includes the server entrypoint (`dist/server`) and the client assets (`dist/spa`).
COPY --from=builder /app/dist ./dist

# The server is configured to run on port 8080.
EXPOSE 8080

# The command to start the production server.
# This Node.js server will serve both the API and the static client assets.
CMD ["node", "dist/server/node-build.mjs"]
