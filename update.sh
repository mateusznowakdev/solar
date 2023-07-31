#!/usr/bin/env bash

set -xe

git pull

docker compose up -d --build --force-recreate
sleep 5
docker exec -it solar-backend-1 python /app/manage.py migrate
