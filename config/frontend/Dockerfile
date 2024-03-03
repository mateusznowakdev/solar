# older version, due to critical network bug
# https://github.com/npm/cli/issues/7024
FROM node:20.9.0-alpine3.18 AS intermediate
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --maxsockets 1

COPY solar-ui solar-ui
COPY vite.config.mjs .

RUN npm run build

# ---

FROM nginx:1.25.4-alpine3.18 AS target
WORKDIR /app

COPY config/frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=intermediate /app/solar-ui/dist .
