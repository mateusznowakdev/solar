Project description can be found
[on my website](https://mateusznowak.dev/projects/solar-inverter-datalogger/).

**Changelog**

v1.5

- Improve loading and error messages
- Filter logs by category
- Display headers on each screen
- Add password protection to the MQTT broker
- Change data structure for log entries
- Upgrade Python, packages and system images

v1.4.1

- Fix issue where `TZ` environment variable is not used correctly

v1.4

- Group log entries by date
- Show controller errors, inverter errors, and communication status in the log
- Change charging priority based on current date and time
- Add settings screen

v1.3

- Add production summary screen

v1.2

- Show loading and error messages

v1.1

- Use native date pickers
- Optimize database performance using ETL processes
- Preserve container logs between restarts

v1.0

- Initial version
