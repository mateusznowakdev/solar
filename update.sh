#!/usr/bin/env bash

set -e

git pull

docker compose --parallel 1 up -d --pull always --build
sleep 5
docker exec -it solar-backend-1 python /app/manage.py migrate

echo -e "\e[42mApplication has been updated successfully\e[0m"
