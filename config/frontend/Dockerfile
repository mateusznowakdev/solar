FROM node:22.0.0-alpine3.19 AS intermediate
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --loglevel info --maxsockets 1

COPY solar-ui solar-ui
COPY vite.config.mjs .

RUN npm run build

# ---

FROM python:3.12.3-alpine3.19 AS target
WORKDIR /app

COPY --from=intermediate /app/solar-ui/dist .

ENTRYPOINT ["python", "-m", "http.server", "80"]
