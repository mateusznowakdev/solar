from datetime import datetime, timedelta

from django.db.models import Avg
from django.db.models.expressions import RawSQL
from django.http import Http404

from solar.core.models import State

DATE_BIN = "DATE_BIN(%s, \"timestamp\", TIMESTAMP '2001-01-01 00:00:00')"
DAYS_LIMIT = 7


class WebSeriesService:
    @staticmethod
    def get_series(
        *, fields: list[str], date_from: datetime, date_to: datetime
    ) -> dict:
        if date_from > date_to:
            date_from, date_to = date_to, date_from

        date_to = min(date_to, date_from + timedelta(days=3))

        delta = date_to - date_from
        stride = delta.total_seconds() // 1000
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

        return {
            "date_from": date_from,
            "date_to": date_to,
            "fields": fields,
            "values": data,
        }


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
