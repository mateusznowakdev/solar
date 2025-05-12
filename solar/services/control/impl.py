import collections
import functools
from datetime import date as date_
from datetime import datetime, time, timedelta
from datetime import timezone as timezone_

from astral import LocationInfo
from astral.sun import sun
from django.conf import settings
from django.utils import timezone

from solar.models import StateRaw
from solar.services.control.base import (
    BaseControlService,
    send_charge_priority,
    send_output_priority,
)
from solar.services.logging import LoggingService

CHARGE_PRIORITY_ID_PREFER_PV = 0
CHARGE_PRIORITY_ID_PREFER_GRID = 1
CHARGE_PRIORITY_ID_HYBRID = 2
CHARGE_PRIORITY_ID_ONLY_PV = 3
CHARGE_PRIORITY_ALLOWED = (0, 1, 2, 3)

OUTPUT_PRIORITY_ID_PV = 0
OUTPUT_PRIORITY_ID_GRID = 1
OUTPUT_PRIORITY_ID_INVERTER = 2
OUTPUT_PRIORITY_ALLOWED = (0, 1, 2)


class ControlService(BaseControlService):
    def __init__(self, *, device: str) -> None:
        super().__init__(device=device)

        self.past_pv_voltages = collections.deque(maxlen=60)

        self.next_charge_change_time = timezone.now()
        self.next_output_change_time = timezone.now()

    def postprocess_state(self, *, state: StateRaw, extra: dict) -> None:
        super().postprocess_state(state=state, extra=extra)

        self._change_priority(state=state)

    @functools.lru_cache(maxsize=1)
    def _get_sunrise(self, *, date: date_, tzinfo: timezone_) -> datetime:
        city = LocationInfo(latitude=settings.LATITUDE, longitude=settings.LONGITUDE)
        sun_info = sun(city.observer, date, tzinfo=tzinfo)

        sunrise = sun_info.get("sunrise")
        sunrise = sunrise.replace(second=0, microsecond=0)

        return sunrise

    def _change_priority(self, *, state: StateRaw) -> None:
        # pylint:disable=too-many-branches
        now = timezone.now()
        local_now = now.astimezone(timezone.get_default_timezone())
        local_sunrise = self._get_sunrise(date=local_now.date(), tzinfo=local_now.tzinfo)

        self.past_pv_voltages.append(state.pv_voltage)
        avg_pv_voltage = sum(self.past_pv_voltages) / len(self.past_pv_voltages)

        charging_time = not time(0, 30) <= local_now.time() < time(23, 30)
        grid_time = not local_sunrise.time() <= local_now.time() < time(22, 30)
        is_high_voltage = avg_pv_voltage >= 230
        is_low_voltage = avg_pv_voltage <= 190

        new_charge_priority = None
        new_output_priority = None

        if self.auto_charge_priority and now > self.next_charge_change_time:
            self.next_charge_change_time = now + timedelta(seconds=10)

            if charging_time:
                if state.charge_priority != CHARGE_PRIORITY_ID_PREFER_PV:
                    new_charge_priority = CHARGE_PRIORITY_ID_PREFER_PV
                    self.next_charge_change_time = now + timedelta(minutes=1)
            else:
                if state.charge_priority != CHARGE_PRIORITY_ID_ONLY_PV:
                    new_charge_priority = CHARGE_PRIORITY_ID_ONLY_PV
                    self.next_charge_change_time = now + timedelta(minutes=1)

        if self.auto_output_priority and now > self.next_output_change_time:
            self.next_output_change_time = now + timedelta(seconds=10)

            if grid_time:
                if state.output_priority != OUTPUT_PRIORITY_ID_GRID:
                    new_output_priority = OUTPUT_PRIORITY_ID_GRID
            elif is_low_voltage:
                if state.output_priority != OUTPUT_PRIORITY_ID_INVERTER:
                    new_output_priority = OUTPUT_PRIORITY_ID_INVERTER
            elif is_high_voltage:
                if state.output_priority != OUTPUT_PRIORITY_ID_PV:
                    new_output_priority = OUTPUT_PRIORITY_ID_PV

        if new_charge_priority is not None:
            send_charge_priority(self.client, new_charge_priority)
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.AUTOMATION_CHARGE_PRIORITY,
                value=new_charge_priority,
            )

        if new_output_priority is not None:
            send_output_priority(self.client, new_output_priority)
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.AUTOMATION_OUTPUT_PRIORITY,
                value=new_output_priority,
            )
