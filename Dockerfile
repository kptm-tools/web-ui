
# Verify files are present
RUN ls -la /app

# Install dependencies
RUN npm install

# Build the Quasar project
RUN npm run build

FROM base AS dev
# Command to run the Quasar app in development mode
CMD ["npm","run", "dev"]

FROM nginx:stable-alpine AS prod


COPY --from=base /app/dist/spa /usr/share/nginx/html

# Copy the nginx config file

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Start nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
