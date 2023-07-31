### Deployment

- Set up OS on ARM64 Raspberry Pi
- Install SSH server, disable password auth, add SSH key and change other
  options
- Install `avahi-daemon` for mDNS support
- Install Docker, add user to `docker` group, make sure `docker-compose-plugin`
  is installed
- Clone this repository
- Create new file `.env` in project directory, add these environment variables:
  - `DJANGO_ALLOWED_HOSTS` (example value: `localhost,solar.local`)
  - `DJANGO_SECRET_KEY`
  - `MQTT_TOPICS` (optional, example value:
    `battery_voltage,grid_frequency,pv_power`)
  - `POSTGRES_PASSWORD`
- Create new directory `/var/lib/solar/postgresql/data`
- Run `./update.sh` script to get new changes, rebuild images and apply
  migrations
- Run `docker exec -it solar-backend-1 curl http://localhost:8000/api/state/`,
  should return valid JSON data

### Updates

- Make sure .env file has all the required variables
- Update the repository
- Run `./update.sh` script to get new changes, rebuild images and apply
  migrations
- Run `docker exec -it solar-backend-1 curl http://localhost:8000/api/state/`,
  should return valid JSON data
