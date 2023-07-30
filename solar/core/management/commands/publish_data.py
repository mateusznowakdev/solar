import sys
import traceback

from django.core.management import BaseCommand

from solar.core.services import PublishService

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPICS = ["pv_power", "pv_voltage"]


class Command(BaseCommand):
    def handle(self, *args, **options):
        try:
            PublishService.publish_data(broker=MQTT_BROKER, port=MQTT_PORT, topics=MQTT_TOPICS)
        except Exception as e:
            traceback.print_exception(e)

        sys.exit(1)
