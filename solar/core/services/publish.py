import json
import random

from django.conf import settings
from django.forms import model_to_dict
from paho.mqtt.client import Client

from solar.core.models import StateRaw
from solar.core.serializers import StateSerializer

MQTT_TOPIC_PREFIX = "solar/"


class PublishService:
    def __init__(self) -> None:
        self.client = Client(f"pub{random.randint(0, 999999):06d}")
        self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT)
        self.client.loop_start()

    def publish(self, *, state: StateRaw) -> None:
        for topic, message in model_to_dict(state).items():
            self.client.publish(MQTT_TOPIC_PREFIX + topic, str(message))

        serializer = StateSerializer(instance=state)
        self.client.publish(MQTT_TOPIC_PREFIX + "json", json.dumps(serializer.data))
