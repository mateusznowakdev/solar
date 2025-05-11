#!/usr/bin/env bash

set -e

while true
do
  docker compose ps --format '{{ .Service }} {{ .Status }}' | grep -i unhealthy | cut -d " " -f 1 | xargs -r docker compose restart
  sleep 2
done
