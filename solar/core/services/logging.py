from datetime import datetime
from typing import Any

from solar.core.models import LogEntry


class LoggingService:
    AUTOMATION_CHARGE_PRIORITY = "charge_priority"
    AUTOMATION_OUTPUT_PRIORITY = "output_priority"
    ERRORS_CONTROLLER_FAULTS = "controller_faults"
    ERRORS_INVERTER_FAULTS = "inverter_faults"
    SYSTEM_CONNECTING = "system_connecting"
    SYSTEM_CONNECTED = "system_connected"
    SYSTEM_CHARGE_PRIORITY = "system_charge_priority"
    SYSTEM_OUTPUT_PRIORITY = "system_output_priority"

    CATEGORIES = ("automation", "errors", "system")
    NAME_CATEGORIES = {
        AUTOMATION_CHARGE_PRIORITY: "automation",
        AUTOMATION_OUTPUT_PRIORITY: "automation",
        ERRORS_CONTROLLER_FAULTS: "errors",
        ERRORS_INVERTER_FAULTS: "errors",
        SYSTEM_CONNECTING: "system",
        SYSTEM_CONNECTED: "system",
        SYSTEM_CHARGE_PRIORITY: "system",
        SYSTEM_OUTPUT_PRIORITY: "system",
    }

    @staticmethod
    def log(*, timestamp: datetime, name: str, value: Any = None) -> None:
        LogEntry.objects.create(
            timestamp=timestamp,
            name=name,
            category=LoggingService.NAME_CATEGORIES.get(name, "other"),
            value=value,
        )
