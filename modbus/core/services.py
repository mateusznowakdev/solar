from datetime import datetime, timedelta
from typing import Any

from django.core.exceptions import FieldError
from django.db.models import Avg
from django.db.models.expressions import RawSQL
from django.utils import timezone

from modbus.core.models import State

DATE_BIN = "DATE_BIN(%s, \"timestamp\", TIMESTAMP '2001-01-01 00:00:00')"
DAYS_LIMIT = 7


def get_meta() -> dict:
    return {
        "ambient_temperature": {
            "description": "Temperatura otoczenia",
            "unit": "°C",
        },
        "battery_current": {
            "description": "Prąd baterii",
            "unit": "A",
        },
        "battery_level_soc": {
            "description": "Poziom naładowania baterii",
            "unit": "%",
        },
        "battery_voltage": {
            "description": "Napięcie baterii",
            "unit": "V",
        },
        "bus_voltage": {
            "description": "Napięcie magistrali",
            "unit": "V",
        },
        "charge_power": {
            "description": "Moc ładowania",
            "unit": "W",
        },
        "charge_priority": {
            "description": "Priorytet ładowania",
            "choices": {
                "0": "Preferuj PV",
                "1": "Preferuj sieć",
                "2": "Tryb mieszany",
                "3": "Tylko PV",
            },
        },
        "charge_status": {
            "description": "Tryb ładowania",
            "choices": {
                "0": "Wyłączone",
                "1": "Włączone",
                "2": "MPPT",
                "3": "Wyrównujące",
                "4": "Przyspieszone",
                "5": "Pływające",
                "6": "Ograniczone",
            },
        },
        "controller_faults": {
            "description": "Kody błędów sterownika",
        },
        "current_state": {
            "description": "Tryb inwertera",
            "choices": {
                "0": "Opóźnienie po uruchomieniu",
                "1": "Oczekiwanie",
                "2": "Uruchamianie",
                "3": "Miękki start",
                "4": "Sieć",
                "5": "Inwerter",
                "6": "Inwerter do sieci",
                "7": "Sieć do inwertera",
                "10": "Wyłączone",
                "11": "Awaria",
            },
        },
        "current_time": {
            "description": "Czas inwertera",
        },
        "dc_current": {
            "description": "Prąd DC",
            "unit": "A",
        },
        "dc_power": {
            "description": "Moc DC",
            "unit": "W",
        },
        "dc_voltage": {
            "description": "Napięcie DC",
            "unit": "V",
        },
        "grid_current": {
            "description": "Prąd sieci",
            "unit": "A",
        },
        "grid_frequency": {
            "description": "Częstotliwość sieci",
            "unit": "Hz",
        },
        "grid_voltage": {
            "description": "Napięcie sieci",
            "unit": "V",
        },
        "heatsink_a_temperature": {
            "description": "Temperatura radiatora A",
            "unit": "°C",
        },
        "heatsink_b_temperature": {
            "description": "Temperatura radiatora B",
            "unit": "°C",
        },
        "heatsink_c_temperature": {
            "description": "Temperatura radiatora C",
            "unit": "°C",
        },
        "inverter_current": {
            "description": "Prąd inwertera",
            "unit": "A",
        },
        "inverter_dc_component": {
            "description": "Składowa DC inwertera",
            "unit": "mV",
        },
        "inverter_faults": {
            "description": "Kody błędów inwertera",
        },
        "inverter_frequency": {
            "description": "Częstotliwość inwertera",
            "unit": "Hz",
        },
        "inverter_voltage": {
            "description": "Napięcie inwertera",
            "unit": "V",
        },
        "load_active_power": {
            "description": "Czynna moc obciążenia",
            "unit": "W",
        },
        "load_apparent_power": {
            "description": "Pozorna moc obciążenia",
            "unit": "VA",
        },
        "load_current": {
            "description": "Prąd obciążenia",
            "unit": "W",
        },
        "load_on": {
            "description": "Obciążenie",
            "choices": {
                "false": "Nie",
                "true": "Tak",
            },
        },
        "load_pf": {
            "description": "Współczynnik mocy obciążenia",
        },
        "load_ratio": {
            "description": "Poziom obciążenia",
            "unit": "%",
        },
        "mains_charge_current": {
            "description": "Prąd ładowania z sieci",
            "unit": "A",
        },
        "output_priority": {
            "description": "Priorytet wyjścia",
            "choices": {
                "0": "Panel",
                "1": "Sieć",
                "2": "Inwerter",
            },
        },
        "pv_buck_current_1": {
            "description": "Zbiorczy prąd PV 1",
            "unit": "A",
        },
        "pv_buck_current_2": {
            "description": "Zbiorczy prąd PV 2",
            "unit": "A",
        },
        "pv_current": {
            "description": "Prąd paneli",
            "unit": "A",
        },
        "pv_power": {
            "description": "Moc paneli",
            "unit": "W",
        },
        "pv_voltage": {
            "description": "Napięcie paneli",
            "unit": "V",
        },
        "timestamp": {
            "description": "Czas pomiaru",
        },
    }


def get_state() -> State:
    return State.objects.last()


def patch_state(*, data: dict) -> None:
    output_priority = data.get("output_priority")
    if output_priority is not None:
        print(f"Changing output priority to {output_priority}")

    charge_priority = data.get("charge_priority")
    if charge_priority is not None:
        print(f"Changing charge priority to {charge_priority}")


def get_series(
    *, source: str, date_from: str | None, date_to: str | None
) -> list[list[Any]]:
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
        return (
            State.objects.filter(timestamp__gte=date_from, timestamp__lte=date_to)
            .annotate(avg_timestamp=RawSQL(DATE_BIN, (f"'{stride} seconds'",)))
            .order_by("avg_timestamp")
            .values_list("avg_timestamp")
            .annotate(avg_value=Avg(source))
        )
    except FieldError:
        return []
