#!/bin/sh

rm /mosquitto/config/mosquitto.passwd
mosquitto_passwd -b -c /mosquitto/config/mosquitto.passwd django "$MQTT_PASSWORD"
chown -R mosquitto:mosquitto /mosquitto/config
chmod -R 0700 /mosquitto/config

exec mosquitto -c /mosquitto/config/mosquitto.conf
