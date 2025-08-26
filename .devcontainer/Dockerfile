# Use the official Node.js 20 image.
# See https://mcr.microsoft.com/en-us/product/devcontainers/javascript-node/about
FROM mcr.microsoft.com/devcontainers/javascript-node:0-20

# Install Playwright dependencies
# Running as root to install system-level packages
USER root
RUN apt-get update && \
    npx playwright install-deps && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install gitleaks for secret scanning
ARG GITLEAKS_VERSION="v8.28.0"
RUN wget "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -O gitleaks.tar.gz && \
    tar -xzf gitleaks.tar.gz && \
    mv gitleaks /usr/local/bin/gitleaks && \
    rm gitleaks.tar.gz

# Switch back to the non-root user
USER node
