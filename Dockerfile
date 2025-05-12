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

RUN rm /etc/nginx/conf.d/default.conf

# Copy the built SPA from the 'build' stage
COPY --from=build /app/dist/spa /usr/share/nginx/html

# Copy your custom Nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]