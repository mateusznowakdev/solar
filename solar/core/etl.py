from django.db import connection

from solar.core.models import State, StateT1, StateT2, StateT3, StateT4

COUNT_TO_INSERT_QUERY = """
    select count(*)
    from {}
    where "timestamp" > coalesce((select max("timestamp") from {}), '1900-01-01 00:00:00');
"""


def get_count_to_insert():
    with connection.cursor() as cursor:
        for model in (StateT1, StateT2, StateT3, StateT4):
            cursor.execute(COUNT_TO_INSERT_QUERY.format(State._meta.db_table, model._meta.db_table))
            count, *_ = cursor.fetchone()
            print(f"{model._meta.db_table} has {count} missing entries")
