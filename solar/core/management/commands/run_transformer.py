import time
import traceback
from datetime import datetime, timedelta

from django.core.management import BaseCommand

from solar.core.models import LogEntry, StateArchive, StateT1, StateT2, StateT3, StateT4
from solar.core.services.transform import TransformService


def catch_exception(fn):
    def inner():
        try:
            fn()
        except Exception as e:  # pylint:disable=broad-exception-caught
            traceback.print_exception(e)

    return inner


@catch_exception
def run_every_1min():
    TransformService.process_data(StateT1)
    TransformService.delete_data(StateT1)


@catch_exception
def run_every_5min():
    TransformService.process_data(StateT2)
    TransformService.delete_data(StateT2)


@catch_exception
def run_every_15min():
    TransformService.process_data(StateT3)
    TransformService.delete_data(StateT3)


@catch_exception
def run_every_30min():
    TransformService.process_data(StateT4)
    TransformService.delete_data(StateT4)

    TransformService.process_data(StateArchive)

    TransformService.delete_data(LogEntry)
    TransformService.delete_data_staging()


def run_transformer():
    time_1min = datetime.now()
    time_5min = datetime.now()
    time_15min = datetime.now()
    time_30min = datetime.now()

    while True:
        now = datetime.now()

        if now > time_1min:
            run_every_1min()
            time_1min = now + timedelta(minutes=1)
        if now > time_5min:
            run_every_5min()
            time_5min = now + timedelta(minutes=5)
        if now > time_15min:
            run_every_15min()
            time_15min = now + timedelta(minutes=15)
        if now > time_30min:
            run_every_30min()
            time_30min = now + timedelta(minutes=30)

        time.sleep(60)


class Command(BaseCommand):
    def handle(self, *args, **options):
        run_transformer()
