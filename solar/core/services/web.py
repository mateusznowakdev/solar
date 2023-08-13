from datetime import datetime, timedelta

from django.db.models import Avg, QuerySet
from django.db.models.expressions import RawSQL

from solar.core.models import LogEntry, State

DATE_BIN = "DATE_BIN(%s, \"timestamp\", TIMESTAMP '2001-01-01 00:00:00')"
DAYS_LIMIT = 7


class LogService:
    @staticmethod
    def get_logs() -> QuerySet[LogEntry]:
        return LogEntry.objects.all()[:100]


class SeriesService:
    @staticmethod
    def get_series(
        *, fields: list[str], date_from: datetime, date_to: datetime
    ) -> dict:
        if date_from > date_to:
            date_from, date_to = date_to, date_from

        date_to = min(date_to, date_from + timedelta(days=3))

        delta = date_to - date_from
        stride = delta.total_seconds() // 1000

        if delta > timedelta(hours=3):
            # round to 5 seconds
            stride = stride // 5 * 5
        else:
            # too few data, use calculated stride value
            stride = max(1, int(stride))

        data = (
            State.objects.filter(timestamp__gte=date_from, timestamp__lte=date_to)
            .annotate(avg_timestamp=RawSQL(DATE_BIN, (f"'{stride} seconds'",)))
            .order_by("avg_timestamp")
            .values_list("avg_timestamp")
            .annotate(avg1=Avg(fields[0]))
        )

        try:
            data = data.annotate(avg2=Avg(fields[1]))
        except IndexError:
            pass

        data = list(data)

        return {
            "date_from": date_from,
            "date_to": date_to,
            "values": [
                {"field": f, "x": [d[0] for d in data], "y": [d[idx + 1] for d in data]}
                for idx, f in enumerate(fields)
            ],
        }
