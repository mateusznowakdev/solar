from django.core.management import BaseCommand
from django.db import connection

from solar.core import etl
from solar.core.models import StateArchive, StateT1, StateT2, StateT3, StateT4


class Command(BaseCommand):
    def handle(self, *args, **options):
        # TODO: process StateT1 every ...
        # TODO: process StateT2,3,4 every ...
        # TODO: process StateArchive every ...
        # TODO: process StateRaw every ...

        etl.process_data(StateT1)
        etl.process_data(StateT2)
        etl.process_data(StateT3)
        etl.process_data(StateT4)
        etl.process_data(StateArchive)

        etl.delete_data(StateT1)
        etl.delete_data(StateT2)
        etl.delete_data(StateT3)
        etl.delete_data(StateT4)
        etl.delete_data_staging()

        for q in connection.queries:
            print(q["sql"])
