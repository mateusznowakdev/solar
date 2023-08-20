### Deployment

- Set up OS on ARM64 Raspberry Pi
  - Make sure there is at least 1GB of RAM and swap combined, otherwise you may
    run out of memory during kernel updates
- Install SSH server, disable password auth, add SSH key and change other
  options
- Install `avahi-daemon` for mDNS support
- Install Docker, add user to `docker` group, make sure `docker-compose-plugin`
  is installed
- Clone this repository
- Create new file `.env` in project directory, add these environment variables:
  - `DJANGO_ALLOWED_HOSTS` (example value: `localhost,solar.local`)
  - `DJANGO_SECRET_KEY`
  - `POSTGRES_PASSWORD`
- Run the `./update.sh` script

### Updates

- Make sure .env file has all the required variables
- Run the `./update.sh` script
