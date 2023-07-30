# Datalogger for solar inverter

| ![](assets/scr1.png) | ![](assets/scr2.png) |
| :------------------: | :------------------: |
|    Parameter list    |   Parameter charts   |

## Features

- Read inverter parameters using Modbus serial protocol
- Save current inverter state to the database
- Send current inverter state to built-in MQTT broker
- Display current inverter state, pin parameters to the top
- Display charts for each inverter parameter

Static files (JS libraries and Bootstrap) are loaded from CDN for best performance.

This software is tested with Raspberry Pi 3A and Debian 12 in UEFI mode:

<details>
<summary>Details</summary>

```
$ hostnamectl
 Static hostname: solar
       Icon name: computer-embedded
         Chassis: embedded
      Machine ID: (redacted)
         Boot ID: (redacted)
Operating System: Debian GNU/Linux 12 (bookworm)
          Kernel: Linux 6.1.0-10-arm64
    Architecture: arm64
 Hardware Vendor: Raspberry Pi Foundation
  Hardware Model: Raspberry Pi 3 Model A+
Firmware Version: UEFI Firmware v1.39

$ free
               total        used        free      shared  buff/cache   available
Mem:          412376      237984       12776       15372      186792      174392
Swap:        1048572       38912     1009660
```

</details>

> **WARNING**: This is EXPERIMENTAL SOFTWARE that is, and will be, optimized for one hardware configuration, and uses
> Polish language for user interface. DO NOT ASK FOR ANY KIND OF HELP even if you believe you have the same inverter
> model.

## Used technologies

- Python, Django + REST framework
- JavaScript, React, Bootstrap, Chart.js, Day.js
- PostgreSQL
- Mosquitto MQTT broker
- Docker, Compose

## Configuration

### Deployment

- Set up OS on ARM64 Raspberry Pi
- Install SSH server, disable password auth, add SSH key and change other options
- Install `avahi-daemon` for mDNS support
- Install Docker, add user to `docker` group, make sure `docker-compose-plugin` is installed
- Clone this repository
- Create new file `.env` in project directory, add these environment variables:
  - `DJANGO_ALLOWED_HOSTS` (example value: `localhost,solar.local`)
  - `DJANGO_SECRET_KEY`
  - `MQTT_TOPICS` (optional, example value: `battery_voltage,grid_frequency,pv_power`)
  - `POSTGRES_PASSWORD`
- Create new directory `/var/lib/solar/postgresql/data`
- Run `./update.sh` script to get new changes, rebuild images and apply migrations
- Run `docker exec -it solar-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data

### Updates

- Make sure .env file has all the required variables
- Update the repository
- Run `./update.sh` script to get new changes, rebuild images and apply migrations
- Run `docker exec -it solar-web-1 curl http://localhost:8000/api/state/`, should return valid JSON data
