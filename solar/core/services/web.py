from datetime import datetime, timedelta

from django.db.models import QuerySet
from django.utils import timezone

from solar.core.models import LogEntry, StateRaw, StateT1, StateT2, StateT3, StateT4

CHART_DATA_MODELS = (
    (StateRaw, timedelta(hours=1)),
    (StateT1, timedelta(hours=4)),
    (StateT2, timedelta(hours=12)),
    (StateT3, timedelta(days=2)),
    (StateT4, timedelta(days=7)),
)

MAX_DATA_POINTS = 750


class LogService:
    @staticmethod
    def get_logs() -> QuerySet[LogEntry]:
        return LogEntry.objects.all()[:100]


class ProductionService:
    @staticmethod
    def get_production(*, timestamps: list[datetime]) -> list:
        return [t.timestamp() for t in timestamps]


class SeriesService:
    @staticmethod
    def get_series(
        *, fields: list[str], date_from: datetime, date_to: datetime
    ) -> dict:
        if date_from > date_to:
            date_from, date_to = date_to, date_from

        date_to = min(date_to, date_from + CHART_DATA_MODELS[-1][1])

        requested_range = date_to - date_from
        now = timezone.now()

        chosen_model = CHART_DATA_MODELS[-1][0]  # the worst precision

        for model, max_allowed_range in CHART_DATA_MODELS:
            range_matched = requested_range <= max_allowed_range
            age_matched = date_from >= now - model.RETENTION_PERIOD

            if range_matched and age_matched:
                chosen_model = model
                break

        data = chosen_model.objects.filter(
            timestamp__gte=date_from, timestamp__lte=date_to
        ).values_list("timestamp", *fields)

        data = list(data)
        if len(data) > MAX_DATA_POINTS:
            data = data[:: len(data) // MAX_DATA_POINTS + 1]

        return {
            "date_from": date_from,
            "date_to": date_to,
            "values": [
                {"field": f, "x": [d[0] for d in data], "y": [d[idx + 1] for d in data]}
                for idx, f in enumerate(fields)
            ],
        }
