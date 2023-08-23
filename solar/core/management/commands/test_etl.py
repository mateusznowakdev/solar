from django.core.management import BaseCommand
from django.db import connection

from solar.core import etl
from solar.core.models import StateT1, StateT2, StateT3, StateT4


class Command(BaseCommand):
    def handle(self, *args, **options):
        etl.process_data(StateT1)
        etl.process_data(StateT2)
        etl.process_data(StateT3)
        etl.process_data(StateT4)

        etl.delete_data(StateT1)
        etl.delete_data(StateT2)
        etl.delete_data(StateT3)
        etl.delete_data(StateT4)
        etl.delete_data_staging()

        for q in connection.queries:
            print(q)
