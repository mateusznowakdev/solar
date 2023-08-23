from datetime import timedelta

from django.db import connection, transaction

from solar.core.models import State, StateCache, StateT1, StateT2, StateT3, StateT4

# date_bin rounds DOWN, so there is no need for any extra date subtracting

INSERT_MISSING = """
    insert into {target} (
        "timestamp",
        --
        ambient_temperature,
        battery_apparent_power,
        battery_current,
        battery_level_soc,
        battery_voltage,
        bus_voltage,
        dc_current,
        dc_power,
        dc_voltage,
        grid_current,
        grid_frequency,
        grid_voltage,
        heatsink_a_temperature,
        heatsink_b_temperature,
        heatsink_c_temperature,
        inverter_current,
        inverter_dc_component,
        inverter_frequency,
        inverter_voltage,
        load_active_power,
        load_apparent_power,
        load_current,
        load_pf,
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
        load_on,
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
        avg(dc_current),
        avg(dc_power),
        avg(dc_voltage),
        avg(grid_current),
        avg(grid_frequency),
        avg(grid_voltage),
        avg(heatsink_a_temperature),
        avg(heatsink_b_temperature),
        avg(heatsink_c_temperature),
        avg(inverter_current),
        avg(inverter_dc_component),
        avg(inverter_frequency),
        avg(inverter_voltage),
        avg(load_active_power),
        avg(load_apparent_power),
        avg(load_current),
        avg(load_pf),
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
        mode() within group (order by load_on),
        mode() within group (order by output_priority)
    from {source}
    where "timestamp" >= coalesce(
        (select max(date_bin(%(stride)s, "timestamp", '1900-01-01 00:00:00')) from {target}),
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
        dc_current = excluded.dc_current,
        dc_power = excluded.dc_power,
        dc_voltage = excluded.dc_voltage,
        grid_current = excluded.grid_current,
        grid_frequency = excluded.grid_frequency,
        grid_voltage = excluded.grid_voltage,
        heatsink_a_temperature = excluded.heatsink_a_temperature,
        heatsink_b_temperature = excluded.heatsink_b_temperature,
        heatsink_c_temperature = excluded.heatsink_c_temperature,
        inverter_current = excluded.inverter_current,
        inverter_dc_component = excluded.inverter_dc_component,
        inverter_frequency = excluded.inverter_frequency,
        inverter_voltage = excluded.inverter_voltage,
        load_active_power = excluded.load_active_power,
        load_apparent_power = excluded.load_apparent_power,
        load_current = excluded.load_current,
        load_pf = excluded.load_pf,
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
        load_on = excluded.load_on,
        output_priority = excluded.output_priority;
"""

CACHE_LATEST = """
    insert into {cache} ("table", timestamp_max)
    select '{target}', max("timestamp") from {target}
    on conflict ("table") do update
    set timestamp_max = excluded.timestamp_max;
"""


def process_data(*, target, stride):
    source_name = State._meta.db_table
    cache_name = StateCache._meta.db_table

    target_name = target._meta.db_table

    with transaction.atomic():
        with connection.cursor() as cursor:
            query = INSERT_MISSING.format(source=source_name, target=target_name)
            cursor.execute(query, {"stride": stride})

            query = CACHE_LATEST.format(target=target_name, cache=cache_name)
            cursor.execute(query)


def process_data_t1():
    process_data(target=StateT1, stride=timedelta(seconds=5))


def process_data_t2():
    process_data(target=StateT2, stride=timedelta(seconds=15))


def process_data_t3():
    process_data(target=StateT3, stride=timedelta(seconds=60))


def process_data_t4():
    process_data(target=StateT4, stride=timedelta(seconds=180))
