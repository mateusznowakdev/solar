import random

from django.conf import settings
from django.forms import model_to_dict
from paho.mqtt.client import Client

from solar.core.models import State

MQTT_TOPIC_PREFIX = "solar/"


class PublishService:
    def __init__(self) -> None:
        self.client = Client(f"publisher-{random.randint(0, 9999):04d}")
        self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT)
        self.client.loop_start()

    def publish(self, *, state: State) -> None:
        for topic, message in model_to_dict(state).items():
            self.client.publish(MQTT_TOPIC_PREFIX + topic, str(message))
