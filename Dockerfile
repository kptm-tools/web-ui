# Use the official Node.js image with the specified Node version
FROM node:20.16-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files for installing dependencies
COPY package.json package-lock.json ./

# Copy the rest of the application code
COPY . .

# Install Quasar CLI if needed for development commands
RUN npm install -g @quasar/cli

# Install project dependencies
RUN npm install

# Verify files are present
RUN ls -la /app

FROM base AS dev

EXPOSE 8080

CMD ["npm","run", "dev"]

FROM base AS build

# Install the Quasar CLI globally in the build stage
RUN npm install -g @quasar/cli

RUN npm run build

FROM nginx:stable-alpine AS prod

# Install envsubst for runtime variable substitution
RUN apk add --no-cache gettext

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy the built SPA from the 'build' stage
COPY --from=build /app/dist/spa /usr/share/nginx/html

# Copy config template
COPY --from=build /app/public/config.js.template /usr/share/nginx/html/config.js.template

# Copy nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Create entrypoint script for runtime configuration
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
  echo 'set -e' >> /docker-entrypoint.sh && \
  echo '' >> /docker-entrypoint.sh && \
  echo '# Set default values if not provided' >> /docker-entrypoint.sh && \
  echo ': ${API_BASE_URL:="http://localhost:8000"}' >> /docker-entrypoint.sh && \
  echo ': ${WS_BASE_URL:="ws://localhost:8000/api/core"}' >> /docker-entrypoint.sh && \
  echo ': ${FEATURE_COMPLIANCE_FRAMEWORK_ENABLED:="true"}' >> /docker-entrypoint.sh && \
  echo '' >> /docker-entrypoint.sh && \
  echo '# Generate runtime config from template' >> /docker-entrypoint.sh && \
  echo 'envsubst < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js' >> /docker-entrypoint.sh && \
  echo '' >> /docker-entrypoint.sh && \
  echo '# Start nginx' >> /docker-entrypoint.sh && \
  echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
  chmod +x /docker-entrypoint.sh

EXPOSE 80

# Use the entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
