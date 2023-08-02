from datetime import datetime, timedelta

from django.core.exceptions import FieldError
from django.db.models import Avg
from django.db.models.expressions import RawSQL
from django.http import Http404
from django.utils import timezone

from solar.core.models import State

DATE_BIN = "DATE_BIN(%s, \"timestamp\", TIMESTAMP '2001-01-01 00:00:00')"
DAYS_LIMIT = 7


class WebSeriesService:
    @staticmethod
    def get_series(*, source: str, date_from: str | None, date_to: str | None) -> dict:
        try:
            date_from = datetime.fromisoformat(date_from)
        except TypeError:
            date_from = None

        try:
            date_to = datetime.fromisoformat(date_to)
        except TypeError:
            date_to = None

        if date_from and date_to:
            date_limit = date_from + timedelta(days=DAYS_LIMIT)
            date_to = min(date_to, date_limit)

        elif date_from and not date_to:
            date_to = timezone.now()
            date_limit = date_from + timedelta(days=DAYS_LIMIT)

            if date_to < date_limit:
                # user cannot enter second and microsecond, therefore it needs to be aligned here
                date_from = date_from.replace(
                    second=date_to.second, microsecond=date_to.microsecond
                )
            else:
                date_to = date_limit

        elif not date_from and date_to:
            date_from = date_to - timedelta(days=DAYS_LIMIT)

        else:
            date_to = timezone.now()
            date_from = date_to - timedelta(days=DAYS_LIMIT)

        delta = date_to - date_from
        stride = delta.total_seconds() // 1000
        stride = max(1, int(stride))

        try:
            data = (
                State.objects.filter(timestamp__gte=date_from, timestamp__lte=date_to)
                .annotate(avg_timestamp=RawSQL(DATE_BIN, (f"'{stride} seconds'",)))
                .order_by("avg_timestamp")
                .values_list("avg_timestamp")
                .annotate(avg_value=Avg(source))
            )
        except FieldError:
            data = []

        return {"date_from": date_from, "date_to": date_to, "values": data}


class WebStateService:
    @staticmethod
    def get_state() -> State:
        state = State.objects.last()

        if not state:
            raise Http404()

        return state

    @staticmethod
    def patch_state(*, data: dict) -> None:
        output_priority = data.get("output_priority")
        if output_priority is not None:
            print(f"Changing output priority to {output_priority}")

        charge_priority = data.get("charge_priority")
        if charge_priority is not None:
            print(f"Changing charge priority to {charge_priority}")
