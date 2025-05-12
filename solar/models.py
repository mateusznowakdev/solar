from datetime import timedelta

from django.db import models


class StateBase(models.Model):
    class Meta:
        abstract = True
        ordering = ("timestamp",)

    timestamp = models.DateTimeField(primary_key=True)

    battery_level_soc = models.IntegerField()
    battery_voltage = models.FloatField()
    battery_current = models.FloatField()
    battery_apparent_power = models.IntegerField()
    pv_voltage = models.FloatField()
    pv_current = models.FloatField()
    pv_power = models.IntegerField()
    charge_status = models.IntegerField()

    current_state = models.IntegerField()
    bus_voltage = models.FloatField()
    grid_voltage = models.FloatField()
    grid_current = models.FloatField()
    grid_frequency = models.FloatField()
    inverter_voltage = models.FloatField()
    inverter_current = models.FloatField()
    inverter_frequency = models.FloatField()
    load_current = models.FloatField()
    load_active_power = models.IntegerField()
    load_apparent_power = models.IntegerField()
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


class StateRaw(StateBase):
    PRECISION = None
    RETENTION_PERIOD = timedelta(days=1)


class StateT1(StateBase):
    PRECISION = timedelta(seconds=5)
    RETENTION_PERIOD = timedelta(days=3)


class StateT2(StateBase):
    PRECISION = timedelta(seconds=15)
    RETENTION_PERIOD = timedelta(days=10)


class StateT3(StateBase):
    PRECISION = timedelta(minutes=1)
    RETENTION_PERIOD = timedelta(days=30)


class StateT4(StateBase):
    PRECISION = timedelta(minutes=5)
    RETENTION_PERIOD = timedelta(days=90)


class StateArchive(StateBase):
    PRECISION = timedelta(hours=1)
    RETENTION_PERIOD = None


class StateCache(models.Model):
    table = models.CharField(max_length=20, unique=True)
    timestamp_max = models.DateTimeField()


class LogEntry(models.Model):
    RETENTION_PERIOD = timedelta(days=60)

    class Meta:
        ordering = ("-timestamp",)

    timestamp = models.DateTimeField()
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    value = models.JSONField(null=True)


class SettingsEntry(models.Model):
    name = models.CharField(max_length=20, primary_key=True)
    checked = models.BooleanField()


def get_numeric_field_names() -> list[str]:
    return [
        f.name
        for f in StateBase._meta.concrete_fields
        if type(f) in (models.FloatField, models.IntegerField)
    ]
