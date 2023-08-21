from datetime import timedelta

from django.db import connection

from solar.core.models import State, StateT1, StateT2, StateT3, StateT4

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
    order by timestamp_bin;
"""


def process_data():
    with connection.cursor() as cursor:
        for model, stride in (
            (StateT1, timedelta(seconds=5)),
            (StateT2, timedelta(seconds=15)),
            (StateT3, timedelta(seconds=60)),
            (StateT4, timedelta(seconds=180)),
        ):
            source = State._meta.db_table
            target = model._meta.db_table

            query = INSERT_MISSING.format(source=source, target=target)
            cursor.execute(query, {"stride": stride})

        for q in connection.queries:
            print(q)
