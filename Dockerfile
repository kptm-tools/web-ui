# Use the official Node.js image with the specified Node version
FROM node:20.16-slim AS base

WORKDIR /app

# Set Yarn version
RUN yarn set version 4.9.1

# Yarn to use node_modules instead of PnP
RUN yarn config set nodeLinker node-modules

#  Disable build/postinstall scripts for now
RUN yarn config set enableScripts false

# Copy full source for next stages
COPY . .


RUN yarn install

FROM base AS test

RUN yarn test:unit:ci

FROM base AS dev
CMD ["yarn", "dev"]

FROM base AS build
RUN yarn build

FROM nginx:stable-alpine AS prod

COPY --from=build /app/dist/spa /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Start nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
