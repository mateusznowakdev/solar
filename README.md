# Deploying

- Set up OS on ARM64 Raspberry Pi
- Install Docker, Compose V2 should be installed by default
- Clone this repository
- Create new file `.env` in project directory, add `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD` environment variables
- Create new directory /var/lib/solar/postgresql/data
- Run `./update.sh` script to get new changes and rebuild images
- Run `docker exec -it solar-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data

# Updating

- Update the repository
- Run `./update.sh` script to get new changes and rebuild images
- Run `docker exec -it solar-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data
