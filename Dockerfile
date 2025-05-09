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

FROM base AS dev

EXPOSE 8080

CMD ["yarn", "dev"]

FROM base AS build

RUN yarn build

FROM nginx:stable-alpine AS prod

RUN rm /etc/nginx/conf.d/default.conf

# Copy the built SPA from the 'build' stage
COPY --from=build /app/dist/spa /usr/share/nginx/html

# Copy your custom Nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
