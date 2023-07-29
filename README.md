# Deploying

- Set up OS on ARM64 Raspberry Pi
- Install Docker, Compose V2 should be installed by default
- Clone this repository
- Create new file `.env` in project directory, add `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD` environment variables
- Create new directory /var/lib/modbus/postgresql/data
- Run `docker compose up -d --build --force-recreate`
- Run `docker exec -it modbus-web-1 python /app/manage.py migrate`
- Run `docker exec -it modbus-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data

# Updating

- Update the repository
- Run `docker compose up -d --build --force-recreate`
- Run `docker exec -it modbus-web-1 python /app/manage.py migrate`
- Run `docker exec -it modbus-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data
