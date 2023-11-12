from datetime import datetime
from typing import Any

from solar.core.models import LogEntry


class LoggingService:
    @staticmethod
    def log(
        *, timestamp: datetime, event: str, value: Any = None, automated: bool = False
    ) -> None:
        LogEntry.objects.create(
            timestamp=timestamp,
            data={"event": event, "value": value, "automated": automated},
        )
