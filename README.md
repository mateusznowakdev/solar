# Deploying

- Set up OS on ARM64 Raspberry Pi
- Install SSH server, disable password auth, add SSH key and change other options
- Install `avahi-daemon` for mDNS support
- Install Docker, add user to `docker` group, make sure `docker-compose-plugin` is installed
- Clone this repository
- Create new file `.env` in project directory, add `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD` environment variables
- Create new directory `/var/lib/solar/postgresql/data`
- Run `./update.sh` script to get new changes and rebuild images
- Run `docker exec -it solar-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data

# Updating

- Update the repository
- Run `./update.sh` script to get new changes and rebuild images
- Run `docker exec -it solar-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data
