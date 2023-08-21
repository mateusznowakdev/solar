from django.core.management import BaseCommand

from solar.core.etl import get_count_to_insert


class Command(BaseCommand):
    def handle(self, *args, **options):
        get_count_to_insert()
