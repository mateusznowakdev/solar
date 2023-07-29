import time
import traceback

from django.core.management import BaseCommand

from modbus.core.services import CaptureService

DEVICE_LIST = ("/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3")


class Command(BaseCommand):
    def handle(self, *args, **options):
        for device in DEVICE_LIST:
            try:
                CaptureService.capture_data(device=device)
            except Exception as e:
                traceback.print_exception(e)
                time.sleep(1.5)
