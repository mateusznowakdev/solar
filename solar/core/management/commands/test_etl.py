from django.core.management import BaseCommand
from django.db import connection

from solar.core import etl


class Command(BaseCommand):
    def handle(self, *args, **options):
        etl.process_data_t1()
        etl.process_data_t2()
        etl.process_data_t3()
        etl.process_data_t4()

        for q in connection.queries:
            print(q)
