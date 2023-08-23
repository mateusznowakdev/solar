from django.db import models
from django.db.models import FloatField, IntegerField


class StateBase(models.Model):
    class Meta:
        abstract = True
        ordering = ("timestamp",)

    timestamp = models.DateTimeField(primary_key=True)

    battery_level_soc = models.IntegerField()
    battery_voltage = models.FloatField()
    battery_current = models.FloatField()
    battery_apparent_power = models.IntegerField()
    dc_voltage = models.FloatField()
    dc_current = models.FloatField()
    dc_power = models.IntegerField()
    pv_voltage = models.FloatField()
    pv_current = models.FloatField()
    pv_power = models.IntegerField()
    charge_status = models.IntegerField()
    load_on = models.BooleanField()

    current_state = models.IntegerField()
    bus_voltage = models.FloatField()
    grid_voltage = models.FloatField()
    grid_current = models.FloatField()
    grid_frequency = models.FloatField()
    inverter_voltage = models.FloatField()
    inverter_current = models.FloatField()
    inverter_frequency = models.FloatField()
    load_current = models.FloatField()
    load_pf = models.FloatField()
    load_active_power = models.IntegerField()
    load_apparent_power = models.IntegerField()
    inverter_dc_component = models.IntegerField()
    mains_charge_current = models.FloatField()
    load_ratio = models.IntegerField()
    heatsink_a_temperature = models.FloatField()
    heatsink_b_temperature = models.FloatField()
    heatsink_c_temperature = models.FloatField()
    ambient_temperature = models.FloatField()
    pv_buck_current_1 = models.FloatField()
    pv_buck_current_2 = models.FloatField()

    controller_faults = models.JSONField()
    inverter_faults = models.JSONField()

    output_priority = models.IntegerField()
    charge_priority = models.IntegerField()


class State(StateBase):
    # staging
    pass


class StateT1(StateBase):
    # every 5s
    pass


class StateT2(StateBase):
    # every 15s
    pass


class StateT3(StateBase):
    # every 1min
    pass


class StateT4(StateBase):
    # every 3min
    pass


class StateCache(models.Model):
    table = models.CharField(max_length=20, unique=True)
    timestamp_max = models.DateTimeField()


class LogEntry(models.Model):
    class Meta:
        ordering = ("-timestamp",)

    timestamp = models.DateTimeField(primary_key=True)

    field_name = models.CharField(max_length=50)
    old_value = models.FloatField()
    new_value = models.FloatField()


def get_numeric_field_names() -> list[str]:
    return [
        f.name
        for f in StateBase._meta.concrete_fields
        if type(f) in (FloatField, IntegerField)
    ]
