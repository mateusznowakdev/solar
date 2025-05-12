import json
import random

from django.conf import settings
from django.forms import model_to_dict
from paho.mqtt.client import Client
from paho.mqtt.enums import CallbackAPIVersion

from solar.models import StateRaw
from solar.serializers import StateSerializer

MQTT_TOPIC_PREFIX = "solar/"


class PublishService:
    def __init__(self) -> None:
        client_id = f"pub{random.randint(0, 999999):06d}"

        self.client = Client(CallbackAPIVersion.VERSION2, client_id)
        self.client.username_pw_set(settings.MQTT_USER, settings.MQTT_PASSWORD)
        self.client.connect(settings.MQTT_BROKER, settings.MQTT_PORT)
        self.client.loop_start()

    def publish(self, *, state: StateRaw) -> None:
        for topic, message in model_to_dict(state).items():
            self.client.publish(MQTT_TOPIC_PREFIX + topic, str(message))

        serializer = StateSerializer(instance=state)
        self.client.publish(MQTT_TOPIC_PREFIX + "json", json.dumps(serializer.data))
