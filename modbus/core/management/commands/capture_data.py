import datetime
import time
import traceback

from django.core.management import BaseCommand
from django.utils import timezone
from pymodbus.client import ModbusSerialClient

from modbus.core.models import State

CHUNK_SIZE = 32


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


def parse_datetime(source: list[int], offset: int) -> datetime.datetime:
    year, month = split_high_low(source[offset])
    day, hour = split_high_low(source[offset + 1])
    minute, second = split_high_low(source[offset + 2])

    return datetime.datetime(
        2000 + year, month, day, hour, minute, second, tzinfo=datetime.timezone.utc
    )


def recv_data(client: ModbusSerialClient, first_reg: int, last_reg: int) -> list:
    count = last_reg - first_reg + 1
    data = []

    for offset in range(0, count, CHUNK_SIZE):
        chunk_first_reg = first_reg + offset
        chunk_count = min(offset + CHUNK_SIZE, count) - offset

        chunk_data = client.read_holding_registers(chunk_first_reg, chunk_count, 1)

        data.extend(chunk_data.registers[:chunk_count])

    return data


def capture(device):
    client = ModbusSerialClient(
        port=device, baudrate=9600, bytesize=8, method="rtu", stopbits=1, parity="N"
    )
    client.connect()

    while True:
        con = recv_data(client, 0x100, 0x10E)
        inv = recv_data(client, 0x200, 0x225)
        par = recv_data(client, 0xE200, 0xE20F)

        State.objects.create(
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
            charge_power=parse_signed_int(con, 0x0E),
            inverter_faults=parse_inverter_faults(inv, 0x04),
            current_time=parse_datetime(inv, 0x0C),
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

        time.sleep(1.0)


class Command(BaseCommand):
    def handle(self, *args, **options):
        for device in ("/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3"):
            try:
                capture(device)
            except Exception as e:
                traceback.print_exception(e)
                time.sleep(2.0)
