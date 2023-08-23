from django.core.management import BaseCommand
from django.db import connection

from solar.core.models import StateArchive, StateT1, StateT2, StateT3, StateT4
from solar.core.services import TransformService


class Command(BaseCommand):
    def handle(self, *args, **options):
        # TODO: process StateT1 every ...
        # TODO: process StateT2,3,4 every ...
        # TODO: process StateArchive every ...
        # TODO: process StateRaw every ...

        TransformService.process_data(StateT1)
        TransformService.process_data(StateT2)
        TransformService.process_data(StateT3)
        TransformService.process_data(StateT4)
        TransformService.process_data(StateArchive)

        TransformService.delete_data(StateT1)
        TransformService.delete_data(StateT2)
        TransformService.delete_data(StateT3)
        TransformService.delete_data(StateT4)
        TransformService.delete_data_staging()

        for q in connection.queries:
            print(q["sql"])
