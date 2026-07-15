# syntax=docker/dockerfile:1

# --- Build stage: compile the Vite SPA to static assets ---
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies against the lockfile first for better layer caching.
COPY package.json package-lock.json ./
RUN npm ci

# VITE_GATEWAY_URL is baked into the bundle at build time (Vite env vars are
# compile-time). Defaults to the locally published YARP gateway; override with
# --build-arg VITE_GATEWAY_URL=... for other environments.
ARG VITE_GATEWAY_URL=http://localhost:6004
ENV VITE_GATEWAY_URL=$VITE_GATEWAY_URL

COPY . .
RUN npm run build

# --- Serve stage: static files behind nginx ---
FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
