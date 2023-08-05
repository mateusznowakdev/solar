#!/usr/bin/env bash

set -xe

git pull

docker compose --parallel 1 up -d --build --remove-orphans
sleep 5
docker exec -it solar-backend-1 python /app/manage.py migrate
