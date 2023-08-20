### Deployment

- set up OS on ARM64 Raspberry Pi
  - make sure there is at least 1GB of RAM and swap combined, otherwise you may
    run out of memory during kernel updates
- install `network-manager`, set it up and disable Wi-Fi power management
- install `avahi-daemon` for mDNS support
- install SSH server, add SSH key and disable password auth
- install Docker, make sure `docker-compose-plugin` is installed, add user to
  the `docker` group
- clone the repository
- create new file `.env` in project directory, add these environment variables:
  - `DJANGO_ALLOWED_HOSTS` (example value: `localhost,solar.local`)
  - `DJANGO_SECRET_KEY`
  - `POSTGRES_PASSWORD`
- run the `./update.sh` script

### Updates

- make sure .env file has all the required variables
- run the `./update.sh` script
