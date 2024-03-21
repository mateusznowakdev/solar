import collections
from datetime import datetime, timedelta, time

from django.utils import timezone

from solar.core.models import StateRaw
from solar.core.services.control.base import BaseControlService, send_data
from solar.core.services.logging import LoggingService
from solar.core.services.settings import SettingsService

CHARGE_PREFER_PV = 0
CHARGE_ONLY_PV = 3

OUTPUT_PRIORITY_PV = 0
OUTPUT_PRIORITY_GRID = 1
OUTPUT_PRIORITY_INVERTER = 2


class ControlService(BaseControlService):
    def __init__(self, *, device: str) -> None:
        super().__init__(device=device)

        self.auto_charge = SettingsService.get_setting(name="auto_charge_priority")
        self.auto_output = SettingsService.get_setting(name="auto_output_priority")

        self.past_pv_voltages = collections.deque(maxlen=60)

        self.next_settings_refresh_time = datetime.now() + timedelta(seconds=10)
        self.next_charge_change_time = datetime.now()
        self.next_output_change_time = datetime.now()

    def postprocess_state(self, *, state: StateRaw) -> None:
        super().postprocess_state(state=state)

        self._refresh_settings()
        self._change_priority(state=state)

    def _refresh_settings(self) -> None:
        # Skip refreshing during cooldown period

        current_time = datetime.now()
        if current_time < self.next_settings_refresh_time:
            return

        # Get settings and compare

        auto_charge = SettingsService.get_setting(name="auto_charge_priority")
        auto_output = SettingsService.get_setting(name="auto_output_priority")

        if auto_charge != self.auto_charge:
            LoggingService.log(
                timestamp=timezone.now(), name=LoggingService.SYSTEM_CHARGE_PRIORITY
            )
        if auto_output != self.auto_output:
            LoggingService.log(
                timestamp=timezone.now(), name=LoggingService.SYSTEM_OUTPUT_PRIORITY
            )

        # Store settings for later

        self.auto_charge = auto_charge
        self.auto_output = auto_output

        self.next_settings_refresh_time = current_time + timedelta(seconds=10)

    def _change_priority(self, *, state: StateRaw) -> None:
        current_time = datetime.now()

        self.past_pv_voltages.append(state.pv_voltage)
        avg_pv_voltage = sum(self.past_pv_voltages) / len(self.past_pv_voltages)

        charging_time = not time(0, 30) <= current_time.time() < time(22, 30)
        grid_time = not time(6, 0) <= current_time.time() < time(22, 30)
        is_high_voltage = avg_pv_voltage >= 230
        is_low_voltage = avg_pv_voltage <= 190

        new_charge_priority = None
        new_output_priority = None

        if self.auto_charge and current_time > self.next_charge_change_time:
            self.next_charge_change_time = current_time + timedelta(seconds=10)

            if charging_time:
                if state.charge_priority != CHARGE_PREFER_PV:
                    new_charge_priority = CHARGE_PREFER_PV
                    self.next_charge_change_time = current_time + timedelta(minutes=1)
            else:
                if state.charge_priority != CHARGE_ONLY_PV:
                    new_charge_priority = CHARGE_ONLY_PV
                    self.next_charge_change_time = current_time + timedelta(minutes=1)

        if self.auto_output and current_time > self.next_output_change_time:
            self.next_output_change_time = current_time + timedelta(seconds=10)

            if grid_time:
                if state.output_priority != OUTPUT_PRIORITY_GRID:
                    new_output_priority = OUTPUT_PRIORITY_GRID
            elif is_low_voltage:
                if state.output_priority != OUTPUT_PRIORITY_INVERTER:
                    new_output_priority = OUTPUT_PRIORITY_INVERTER
            elif is_high_voltage:
                if state.output_priority != OUTPUT_PRIORITY_PV:
                    new_output_priority = OUTPUT_PRIORITY_PV

        if new_charge_priority is not None:
            send_data(self.client, 0xE20F, new_charge_priority)
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.AUTOMATION_CHARGE_PRIORITY,
                value=new_charge_priority,
            )

        if new_output_priority is not None:
            send_data(self.client, 0xE204, new_output_priority)
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.AUTOMATION_OUTPUT_PRIORITY,
                value=new_output_priority,
            )
