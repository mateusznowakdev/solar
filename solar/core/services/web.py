from datetime import datetime, timedelta

from django.db.models import Case, QuerySet, Sum, When
from django.utils import timezone

from solar.core.models import (
    LogEntry,
    StateArchive,
    StateRaw,
    StateT1,
    StateT2,
    StateT3,
    StateT4,
)
from solar.core.services.settings import SettingsService

CHART_DATA_MODELS = (
    (StateRaw, timedelta(hours=1)),
    (StateT1, timedelta(hours=4)),
    (StateT2, timedelta(hours=12)),
    (StateT3, timedelta(days=2)),
    (StateT4, timedelta(days=7)),
)

MAX_DATA_POINTS = 750


class LogAPIService:
    @staticmethod
    def get_logs(*, categories: list[str]) -> QuerySet[LogEntry]:
        queryset = LogEntry.objects.all()

        if categories:
            queryset = queryset.filter(category__in=categories)

        return queryset[:100]


class ProductionAPIService:
    @staticmethod
    def get_production(*, timestamps: list[datetime]) -> list:
        timestamps = list(reversed(sorted(set(timestamps))))

        group_qs = Case(
            *(When(timestamp__gte=ts, then=idx) for idx, ts in enumerate(timestamps))
        )

        data = (
            StateArchive.objects.annotate(group=group_qs)
            .values("group")
            .annotate(
                pv_power=Sum("pv_power"), load_active_power=Sum("load_active_power")
            )
            .filter(timestamp__gte=min(timestamps))
            .order_by("group")
        )

        for entry in data:
            entry["timestamp"] = timestamps[entry.pop("group")]

        return data


class SeriesAPIService:
    @staticmethod
    def get_series(
        *, fields: list[str], date_from: datetime, date_to: datetime
    ) -> dict:
        if date_from > date_to:
            date_from, date_to = date_to, date_from

        date_to = min(date_to, date_from + CHART_DATA_MODELS[-1][1])
        fields = list(dict.fromkeys(fields))

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


class SettingsAPIService:
    @staticmethod
    def get_settings() -> dict:
        return {
            name: SettingsService.get_setting(name=name)
            for name in ("auto_charge_priority", "auto_output_priority")
        }

    @staticmethod
    def update_settings(*, settings: dict) -> dict:
        for name in ("auto_charge_priority", "auto_output_priority"):
            SettingsService.put_setting(name=name, checked=settings[name])

        return SettingsAPIService.get_settings()
