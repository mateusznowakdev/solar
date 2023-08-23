from django.core.management import BaseCommand
from django.db import connection

from solar.core.models import StateArchive, StateT1, StateT2, StateT3, StateT4
from solar.core.services import transform


class Command(BaseCommand):
    def handle(self, *args, **options):
        # TODO: process StateT1 every ...
        # TODO: process StateT2,3,4 every ...
        # TODO: process StateArchive every ...
        # TODO: process StateRaw every ...

        transform.process_data(StateT1)
        transform.process_data(StateT2)
        transform.process_data(StateT3)
        transform.process_data(StateT4)
        transform.process_data(StateArchive)

        transform.delete_data(StateT1)
        transform.delete_data(StateT2)
        transform.delete_data(StateT3)
        transform.delete_data(StateT4)
        transform.delete_data_staging()

        for q in connection.queries:
            print(q["sql"])
