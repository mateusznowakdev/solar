# npm is downgraded due to critical network bugs
# node 20.6.1 is the latest version with npm 9
# https://github.com/npm/cli/issues/7024
# https://github.com/npm/cli/issues/7072
FROM node:20.6.1-alpine3.18 AS intermediate
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --loglevel info --maxsockets 1

COPY solar-ui solar-ui
COPY vite.config.mjs .

RUN npm run build

# ---

FROM python:3.12.2-alpine3.19 AS target
WORKDIR /app

COPY --from=intermediate /app/solar-ui/dist .

ENTRYPOINT ["python", "-m", "http.server", "80"]
