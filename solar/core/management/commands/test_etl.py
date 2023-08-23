from datetime import timedelta

from django.core.management import BaseCommand
from django.db import connection

from solar.core import etl
from solar.core.models import StateT1, StateT2, StateT3, StateT4


class Command(BaseCommand):
    def handle(self, *args, **options):
        etl.process_data(to=StateT1, stride=timedelta(seconds=5))
        etl.process_data(to=StateT2, stride=timedelta(seconds=15))
        etl.process_data(to=StateT3, stride=timedelta(seconds=60))
        etl.process_data(to=StateT4, stride=timedelta(seconds=180))

        etl.delete_data_staging(not_before=timedelta(days=14))

        for q in connection.queries:
            print(q)
