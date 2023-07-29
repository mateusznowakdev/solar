import time
import traceback

from django.core.management import BaseCommand

from modbus.core.services.capture import capture_data

DEVICE_LIST = ("/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3")


class Command(BaseCommand):
    def handle(self, *args, **options):
        for device in DEVICE_LIST:
            try:
                capture_data(device)
            except Exception as e:
                traceback.print_exception(e)
                time.sleep(1.5)
