FROM node:20-alpine AS intermediate
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY solar-ui solar-ui
COPY vite.config.mjs .

RUN npm run build

# ---

FROM nginx:1-alpine AS target
WORKDIR /app

COPY config/frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=intermediate /app/solar-ui/dist .
