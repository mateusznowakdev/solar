from datetime import timedelta

from django.db import connection

from solar.core.models import State, StateT1, StateT2, StateT3, StateT4

# date_bin rounds DOWN, so there is no need for any extra date subtracting

COUNT_TO_INSERT_QUERY = """
    select count(*)
    from {}
    where "timestamp" >= coalesce(
        (select max(date_bin(%s, "timestamp", timestamp '1900-01-01 00:00:00')) from {}),
        '1900-01-01 00:00:00'
    );
"""


def get_count_to_insert():
    with connection.cursor() as cursor:
        for model, offset in (
            (StateT1, timedelta(seconds=5)),
            (StateT2, timedelta(seconds=15)),
            (StateT3, timedelta(seconds=60)),
            (StateT4, timedelta(seconds=180)),
        ):
            query = COUNT_TO_INSERT_QUERY.format(
                State._meta.db_table, model._meta.db_table
            )

            cursor.execute(query, [offset])
            count, *_ = cursor.fetchone()

            print(f"{model._meta.db_table} has {count} missing entries")

        for q in connection.queries:
            print(q)
