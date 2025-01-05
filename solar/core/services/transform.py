from django.db import connection, transaction

from solar.core.models import StateCache, StateRaw

INSERT_NEW_DATA = """
    insert into {target} (
        "timestamp",
        --
        ambient_temperature,
        battery_apparent_power,
        battery_current,
        battery_level_soc,
        battery_voltage,
        bus_voltage,
        grid_current,
        grid_frequency,
        grid_voltage,
        heatsink_a_temperature,
        heatsink_b_temperature,
        heatsink_c_temperature,
        inverter_current,
        inverter_frequency,
        inverter_voltage,
        load_active_power,
        load_apparent_power,
        load_current,
        load_ratio,
        mains_charge_current,
        pv_buck_current_1,
        pv_buck_current_2,
        pv_current,
        pv_power,
        pv_voltage,
        --
        charge_priority,
        charge_status,
        controller_faults,
        current_state,
        inverter_faults,
        output_priority
    )
    select
        date_bin(%(stride)s, "timestamp", '1900-01-01 00:00:00') as timestamp_bin,
        --
        avg(ambient_temperature),
        avg(battery_apparent_power),
        avg(battery_current),
        avg(battery_level_soc),
        avg(battery_voltage),
        avg(bus_voltage),
        avg(grid_current),
        avg(grid_frequency),
        avg(grid_voltage),
        avg(heatsink_a_temperature),
        avg(heatsink_b_temperature),
        avg(heatsink_c_temperature),
        avg(inverter_current),
        avg(inverter_frequency),
        avg(inverter_voltage),
        avg(load_active_power),
        avg(load_apparent_power),
        avg(load_current),
        avg(load_ratio),
        avg(mains_charge_current),
        avg(pv_buck_current_1),
        avg(pv_buck_current_2),
        avg(pv_current),
        avg(pv_power),
        avg(pv_voltage),
        --
        mode() within group (order by charge_priority),
        mode() within group (order by charge_status),
        mode() within group (order by controller_faults),
        mode() within group (order by current_state),
        mode() within group (order by inverter_faults),
        mode() within group (order by output_priority)
    from {source}
    where "timestamp" >= coalesce(
        (select timestamp_max from {cache} where "table" = '{target}'),
        '1900-01-01 00:00:00'
    )
    group by timestamp_bin
    order by timestamp_bin
    on conflict ("timestamp") do update set
        ambient_temperature = excluded.ambient_temperature,
        battery_apparent_power = excluded.battery_apparent_power,
        battery_current = excluded.battery_current,
        battery_level_soc = excluded.battery_level_soc,
        battery_voltage = excluded.battery_voltage,
        bus_voltage = excluded.bus_voltage,
        grid_current = excluded.grid_current,
        grid_frequency = excluded.grid_frequency,
        grid_voltage = excluded.grid_voltage,
        heatsink_a_temperature = excluded.heatsink_a_temperature,
        heatsink_b_temperature = excluded.heatsink_b_temperature,
        heatsink_c_temperature = excluded.heatsink_c_temperature,
        inverter_current = excluded.inverter_current,
        inverter_frequency = excluded.inverter_frequency,
        inverter_voltage = excluded.inverter_voltage,
        load_active_power = excluded.load_active_power,
        load_apparent_power = excluded.load_apparent_power,
        load_current = excluded.load_current,
        load_ratio = excluded.load_ratio,
        mains_charge_current = excluded.mains_charge_current,
        pv_buck_current_1 = excluded.pv_buck_current_1,
        pv_buck_current_2 = excluded.pv_buck_current_2,
        pv_current = excluded.pv_current,
        pv_power = excluded.pv_power,
        pv_voltage = excluded.pv_voltage,
        --
        charge_priority = excluded.charge_priority,
        charge_status = excluded.charge_status,
        controller_faults = excluded.controller_faults,
        current_state = excluded.current_state,
        inverter_faults = excluded.inverter_faults,
        output_priority = excluded.output_priority;
"""

CACHE_LAST_TIMESTAMP = """
    insert into {cache} ("table", timestamp_max)
    select '{target}', max("timestamp") from {target}
    on conflict ("table") do update
    set timestamp_max = excluded.timestamp_max;
"""

DELETE_AGGREGATED_DATA = """
    delete from {source}
    where "timestamp" < now() - %(not_before)s
"""

DELETE_STAGING_DATA = """
    delete from {source}
    where "timestamp" < least(
        now() - %(not_before)s,
        (select min(timestamp_max) from {cache})
    );
"""


class TransformService:
    @staticmethod
    def process_data(model):
        source = StateRaw._meta.db_table
        cache = StateCache._meta.db_table

        target = model._meta.db_table

        with transaction.atomic():
            with connection.cursor() as cursor:
                query = INSERT_NEW_DATA.format(source=source, target=target, cache=cache)
                cursor.execute(query, {"stride": model.PRECISION})

                query = CACHE_LAST_TIMESTAMP.format(target=target, cache=cache)
                cursor.execute(query)

    @staticmethod
    def delete_data_staging():
        source = StateRaw._meta.db_table
        cache = StateCache._meta.db_table

        with connection.cursor() as cursor:
            query = DELETE_STAGING_DATA.format(source=source, cache=cache)
            cursor.execute(query, {"not_before": StateRaw.RETENTION_PERIOD})

    @staticmethod
    def delete_data(model):
        source = model._meta.db_table

        with connection.cursor() as cursor:
            query = DELETE_AGGREGATED_DATA.format(source=source)
            cursor.execute(query, {"not_before": model.RETENTION_PERIOD})
