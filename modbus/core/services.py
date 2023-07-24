from modbus.core.models import State


def get_meta() -> dict:
    return {
        "ambient_temperature": {
            "description": "Temperatura otoczenia",
            "unit": "°C",
        }
    }


def get_state() -> State:
    return State.objects.last()


def patch_state(data: dict) -> None:
    output_priority = data.get("output_priority")
    if output_priority is not None:
        print(f"Changing output priority to {output_priority}")

    charge_priority = data.get("charge_priority")
    if charge_priority is not None:
        print(f"Changing charge priority to {charge_priority}")
