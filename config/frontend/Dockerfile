FROM node:lts-alpine AS intermediate
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY solar-ui solar-ui
COPY vite.config.js .

RUN npm run build

# ---

FROM nginx:stable-alpine AS target
WORKDIR /app

COPY --from=intermediate /app/solar-ui/dist /usr/share/nginx/html
