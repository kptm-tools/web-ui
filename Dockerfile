# Use the official Node.js image with the specified Node version
FROM node:20.16-slim AS base

# Set the working directory inside the container
WORKDIR /app

# Set Yarn version
RUN yarn set version 1.22.22

# Copy only the necessary files for installing dependencies
COPY package.json yarn.lock ./

# Copy the rest of the application code
COPY . .

# Verify files are present
RUN ls -la /app

# Install dependencies
RUN yarn install

# Build the Quasar project
RUN yarn build

FROM base AS dev
# Command to run the Quasar app in development mode
CMD ["yarn", "dev"]

FROM nginx:stable-alpine AS prod


COPY --from=base /app/dist/spa /usr/share/nginx/html

# Copy the nginx config file

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Start nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
