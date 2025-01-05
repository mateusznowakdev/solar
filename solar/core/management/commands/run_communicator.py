import sys
import time
import traceback
from http.server import BaseHTTPRequestHandler, HTTPServer

from django.core.management import BaseCommand

from solar.core.services.control import ControlService
from solar.core.services.publish import PublishService

DEVICE_LIST = ("/dev/ttyUSB0", "/dev/ttyUSB1", "/dev/ttyUSB2", "/dev/ttyUSB3")


class HTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()


class Command(BaseCommand):
    def handle(self, *args, **options):
        publish_service = PublishService()
        http_server = HTTPServer(("0.0.0.0", 8000), HTTPRequestHandler)
        http_server.timeout = 0.5

        for device in DEVICE_LIST:
            try:
                control_service = ControlService(device=device)
                run_communicator(control_service, publish_service, http_server)
            except Exception as e:  # pylint:disable=broad-exception-caught
                traceback.print_exception(e)
                time.sleep(2.5)

        sys.exit(1)


def run_communicator(control_service, publish_service, http_server):
    while True:
        http_server.handle_request()

        state = control_service.get_state()

        control_service.save_state(state=state)
        control_service.postprocess_state(state=state)
        publish_service.publish(state=state)

        time.sleep(0.5)
