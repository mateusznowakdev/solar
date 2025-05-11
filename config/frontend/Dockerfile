FROM node:22.15.0-alpine3.21 AS intermediate
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY solar-ui solar-ui
COPY vite.config.mjs .

RUN npm run build

# ---

FROM python:3.13.3-alpine3.21 AS target
WORKDIR /app

RUN apk add curl

COPY --from=intermediate /app/solar-ui/dist .

CMD ["python", "-m", "http.server", "80"]
