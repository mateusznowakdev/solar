import sys
import time
import traceback

from django.core.management import BaseCommand

from solar.core.services import ControlService

DEVICE_LIST = ("/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3")


class Command(BaseCommand):
    def handle(self, *args, **options):
        for device in DEVICE_LIST:
            try:
                ControlService(device=device).control()
            except Exception as e:
                traceback.print_exception(e)
                time.sleep(2.5)

        sys.exit(1)
