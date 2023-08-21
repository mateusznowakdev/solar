from django.core.management import BaseCommand

from solar.core.etl import process_data


class Command(BaseCommand):
    def handle(self, *args, **options):
        process_data()
