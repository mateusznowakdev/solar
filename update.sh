#!/usr/bin/env bash

set -e

git pull

docker compose up -d --build --force-recreate
sleep 5
docker exec -it solar-web-1 python /app/manage.py migrate