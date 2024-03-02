import collections
from datetime import datetime, time, timedelta

from django.utils import timezone
from pymodbus.client import ModbusSerialClient

from solar.core.models import StateRaw
from solar.core.services.logging import LoggingService
from solar.core.services.settings import SettingsService

CHUNK_SIZE = 32

CHARGE_PREFER_PV = 0
CHARGE_ONLY_PV = 3

OUTPUT_PRIORITY_PV = 0
OUTPUT_PRIORITY_GRID = 1


def convert_to_signed(value: int) -> int:
    if value & 0x8000:
        return value - 0x10000

    return value


def split_high_low(value: int) -> tuple[int, int]:
    return (value & 0xFF00) >> 8, (value & 0x00FF)


def parse_int(source: list[int], offset: int) -> int:
    return source[offset]


def parse_signed_int(source: list[int], offset: int) -> int:
    return convert_to_signed(source[offset])


def parse_float(source: list[int], offset: int) -> float:
    return source[offset] / 10.0


def parse_signed_float(source: list[int], offset: int) -> float:
    return convert_to_signed(source[offset]) / 10.0


def parse_float2(source: list[int], offset: int) -> float:
    return source[offset] / 100.0


def parse_signed_float2(source: list[int], offset: int) -> float:
    return convert_to_signed(source[offset]) / 100.0


def parse_charge_status(source: list[int], offset: int) -> int:
    return source[offset] & 0x00FF


def parse_load_on(source: list[int], offset: int) -> bool:
    return bool(source[offset] & 0x8000)


def parse_controller_faults(source: list[int], offset: int) -> list[int]:
    codes = []

    for word in (source[offset], source[offset + 1]):
        for byte_no in range(16):
            if bool(word & (1 << byte_no)):
                codes.append(byte_no)

    return codes


def parse_inverter_faults(source: list[int], offset: int) -> list[int]:
    return [code for code in source[offset : offset + 4] if code]


def recv_data(client: ModbusSerialClient, first_reg: int, last_reg: int) -> list:
    count = last_reg - first_reg + 1
    data = []

    for offset in range(0, count, CHUNK_SIZE):
        chunk_first_reg = first_reg + offset
        chunk_count = min(offset + CHUNK_SIZE, count) - offset

        chunk_data = client.read_holding_registers(chunk_first_reg, chunk_count, 1)

        data.extend(chunk_data.registers[:chunk_count])

    return data


def send_data(client: ModbusSerialClient, reg: int, value: int) -> None:
    client.write_register(reg, value, 1)


class ControlService:
    def __init__(self, *, device: str) -> None:
        self.client = ModbusSerialClient(
            port=device, baudrate=9600, bytesize=8, method="rtu", stopbits=1, parity="N"
        )
        self.client._recv_interval = self.client._t0 * 24
        self.client.connect()
        self.connected = False  # based on first successful transmission

        LoggingService.log(
            timestamp=timezone.now(), name=LoggingService.SYSTEM_CONNECTING
        )

        self.auto_charge_priority = SettingsService.get_setting(
            name="auto_charge_priority"
        )
        self.auto_output_priority = SettingsService.get_setting(
            name="auto_output_priority"
        )

        self.past_pv_voltages = collections.deque(maxlen=60)
        self.past_controller_faults = []
        self.past_inverter_faults = []

        self.next_settings_refresh_time = datetime.now() + timedelta(seconds=10)
        self.next_charge_priority_change_time = datetime.now()
        self.next_output_priority_change_time = datetime.now()

    def get_state(self) -> StateRaw:
        # These variables are not implemented because I can't test them
        #
        # - controller temperature (0x103)
        # - battery temperature (0x103)
        # - brightness (0x10B)
        # - fault bits (0x200)
        # - current time (0x20C)
        # - password protection (0x211)

        con = recv_data(self.client, 0x100, 0x10E)
        inv = recv_data(self.client, 0x200, 0x225)
        par = recv_data(self.client, 0xE200, 0xE20F)

        if not self.connected:
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.SYSTEM_CONNECTED,
                value=self.client.comm_params.host,
            )
            self.connected = True

        state = StateRaw(
            timestamp=timezone.now(),
            battery_level_soc=parse_int(con, 0x00),
            battery_voltage=parse_float(con, 0x01),
            battery_current=parse_signed_float(con, 0x02),
            dc_voltage=parse_float(con, 0x04),
            dc_current=parse_float2(con, 0x05),
            dc_power=parse_int(con, 0x06),
            pv_voltage=parse_float(con, 0x07),
            pv_current=parse_float(con, 0x08),
            pv_power=parse_int(con, 0x09),
            charge_status=parse_charge_status(con, 0x0B),
            load_on=parse_load_on(con, 0x0B),
            controller_faults=parse_controller_faults(con, 0x0C),
            inverter_faults=parse_inverter_faults(inv, 0x04),
            current_state=parse_int(inv, 0x10),
            bus_voltage=parse_float(inv, 0x12),
            grid_voltage=parse_float(inv, 0x13),
            grid_current=parse_float(inv, 0x14),
            grid_frequency=parse_float2(inv, 0x15),
            inverter_voltage=parse_float(inv, 0x16),
            inverter_current=parse_float(inv, 0x17),
            inverter_frequency=parse_float2(inv, 0x18),
            load_current=parse_float(inv, 0x19),
            load_pf=parse_float2(inv, 0x1A),
            load_active_power=parse_int(inv, 0x1B),
            load_apparent_power=parse_int(inv, 0x1C),
            inverter_dc_component=parse_int(inv, 0x1D),
            mains_charge_current=parse_float(inv, 0x1E),
            load_ratio=parse_int(inv, 0x1F),
            heatsink_a_temperature=parse_float(inv, 0x20),
            heatsink_b_temperature=parse_float(inv, 0x21),
            heatsink_c_temperature=parse_float(inv, 0x22),
            ambient_temperature=parse_float(inv, 0x23),
            pv_buck_current_1=parse_float(inv, 0x24),
            pv_buck_current_2=parse_float(inv, 0x25),
            output_priority=parse_int(par, 0x04),
            charge_priority=parse_int(par, 0x0F),
        )

        state.battery_current = -state.battery_current
        state.battery_apparent_power = int(
            state.battery_current * state.battery_voltage
        )

        return state

    def save_state(self, *, state: StateRaw) -> None:
        state.save()

    def postprocess_state(self, *, state: StateRaw) -> None:
        self._refresh_settings()
        self._process_controller_faults(state=state)
        self._process_inverter_faults(state=state)
        self._change_charge_priority(state=state)
        self._change_output_priority(state=state)

    def _refresh_settings(self) -> None:
        # Skip refreshing during cooldown period

        current_time = datetime.now()
        if current_time < self.next_settings_refresh_time:
            return

        # Get settings and compare

        auto_charge_priority = SettingsService.get_setting(name="auto_charge_priority")
        auto_output_priority = SettingsService.get_setting(name="auto_output_priority")

        if auto_charge_priority != self.auto_charge_priority:
            LoggingService.log(
                timestamp=timezone.now(), name=LoggingService.SYSTEM_CHARGE_PRIORITY
            )
        if auto_output_priority != self.auto_output_priority:
            LoggingService.log(
                timestamp=timezone.now(), name=LoggingService.SYSTEM_OUTPUT_PRIORITY
            )

        # Store settings for later

        self.auto_charge_priority = auto_charge_priority
        self.auto_output_priority = auto_output_priority

        self.next_settings_refresh_time = current_time + timedelta(seconds=10)

    def _process_controller_faults(self, *, state: StateRaw) -> None:
        if state.controller_faults:
            if set(state.controller_faults) != set(self.past_controller_faults):
                LoggingService.log(
                    timestamp=state.timestamp,
                    name=LoggingService.ERRORS_CONTROLLER_FAULTS,
                    value=state.controller_faults,
                )

        self.past_controller_faults = state.controller_faults

    def _process_inverter_faults(self, *, state: StateRaw) -> None:
        if state.inverter_faults:
            if set(state.inverter_faults) != set(self.past_inverter_faults):
                LoggingService.log(
                    timestamp=state.timestamp,
                    name=LoggingService.ERRORS_INVERTER_FAULTS,
                    value=state.inverter_faults,
                )

        self.past_inverter_faults = state.inverter_faults

    def _change_charge_priority(self, *, state: StateRaw) -> None:
        if not self.auto_charge_priority:
            return

        # Skip processing during cooldown period

        current_time = datetime.now()
        if current_time < self.next_charge_priority_change_time:
            return

        # Change state if necessary
        # System (naive) time is used

        is_safe_hour = (
            current_time.isoweekday() in (6, 7)
            or current_time.time() < time(hour=5, minute=30)
            or current_time.time() >= time(hour=22, minute=30)
        )

        if is_safe_hour and state.charge_priority != CHARGE_PREFER_PV:
            # prefer PV
            new_charge_priority = CHARGE_PREFER_PV
            send_data(self.client, 0xE20F, new_charge_priority)
            self.next_charge_priority_change_time = current_time + timedelta(minutes=1)

        elif not is_safe_hour and state.charge_priority != CHARGE_ONLY_PV:
            # enforce PV
            new_charge_priority = CHARGE_ONLY_PV
            send_data(self.client, 0xE20F, new_charge_priority)
            self.next_charge_priority_change_time = current_time + timedelta(minutes=1)

        else:
            # do nothing
            new_charge_priority = None
            self.next_charge_priority_change_time = current_time + timedelta(seconds=10)

        # Add log entry if state has changed

        if new_charge_priority is not None:
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.AUTOMATION_CHARGE_PRIORITY,
                value=new_charge_priority,
            )

    def _change_output_priority(self, *, state: StateRaw) -> None:
        if not self.auto_output_priority:
            return

        # Store latest PV voltage value

        self.past_pv_voltages.append(state.pv_voltage)

        # Skip processing during cooldown period

        current_time = datetime.now()
        if current_time < self.next_output_priority_change_time:
            return

        # Change state if necessary

        avg_pv_voltage = sum(self.past_pv_voltages) / len(self.past_pv_voltages)

        if avg_pv_voltage < 200 and state.output_priority != OUTPUT_PRIORITY_GRID:
            # switch to grid
            new_output_priority = OUTPUT_PRIORITY_GRID
            send_data(self.client, 0xE204, new_output_priority)
            self.next_output_priority_change_time = current_time + timedelta(minutes=5)

        elif avg_pv_voltage > 220 and state.output_priority != OUTPUT_PRIORITY_PV:
            # switch to PV
            new_output_priority = OUTPUT_PRIORITY_PV
            send_data(self.client, 0xE204, new_output_priority)
            self.next_output_priority_change_time = current_time + timedelta(seconds=10)

        else:
            # do nothing
            new_output_priority = None
            self.next_output_priority_change_time = current_time + timedelta(seconds=10)

        # Add log entry if state has changed

        if new_output_priority is not None:
            LoggingService.log(
                timestamp=timezone.now(),
                name=LoggingService.AUTOMATION_OUTPUT_PRIORITY,
                value=new_output_priority,
            )
