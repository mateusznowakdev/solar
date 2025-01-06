import collections
import functools
from datetime import date as date_
from datetime import datetime, time, timedelta
from datetime import timezone as timezone_

from astral import LocationInfo
from astral.sun import sun
from django.conf import settings
from django.utils import timezone

from solar.core.models import StateRaw
from solar.core.services.control import const
from solar.core.services.control.base import (
    BaseControlService,
    send_charge_priority,
    send_output_priority,
)
from solar.core.services.logging import LoggingService


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
                if state.charge_priority != const.CHARGE_PREFER_PV:
                    new_charge_priority = const.CHARGE_PREFER_PV
                    self.next_charge_change_time = now + timedelta(minutes=1)
            else:
                if state.charge_priority != const.CHARGE_ONLY_PV:
                    new_charge_priority = const.CHARGE_ONLY_PV
                    self.next_charge_change_time = now + timedelta(minutes=1)

        if self.auto_output_priority and now > self.next_output_change_time:
            self.next_output_change_time = now + timedelta(seconds=10)

            if grid_time:
                if state.output_priority != const.OUTPUT_PRIORITY_GRID:
                    new_output_priority = const.OUTPUT_PRIORITY_GRID
            elif is_low_voltage:
                if state.output_priority != const.OUTPUT_PRIORITY_INVERTER:
                    new_output_priority = const.OUTPUT_PRIORITY_INVERTER
            elif is_high_voltage:
                if state.output_priority != const.OUTPUT_PRIORITY_PV:
                    new_output_priority = const.OUTPUT_PRIORITY_PV

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
