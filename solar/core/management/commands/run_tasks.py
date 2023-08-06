import sys
import time
import traceback

from django.core.management import BaseCommand

from solar.core.services import ControlService, PublishService

DEVICE_LIST = ("/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3")


def run_tasks(control_service, publish_service):
    while True:
        state = control_service.get_state()
        control_service.change_state(state=state)

        publish_service.publish(state=state)

        time.sleep(0.5)


class Command(BaseCommand):
    def handle(self, *args, **options):
        publish_service = PublishService()

        for device in DEVICE_LIST:
            try:
                control_service = ControlService(device=device)
                run_tasks(control_service, publish_service)
            except Exception as e:
                traceback.print_exception(e)
                time.sleep(2.5)

        sys.exit(1)
