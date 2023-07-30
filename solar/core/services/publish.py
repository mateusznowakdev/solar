import random
import time
from typing import NoReturn

from paho.mqtt.client import Client

from solar.core.models import State

MQTT_TOPIC_PREFIX = "solar/"


class PublishService:
    @staticmethod
    def publish_data(*, broker: str, port: int, topics: list[str]) -> NoReturn:
        if len(topics) == 0:
            print("MQTT_TOPICS environment variable not set, no data will be sent")
            while True:
                pass

        client = Client(f"publisher-{random.randint(0, 9999):04d}")
        client.connect(broker, port)
        client.loop_start()

        while True:
            data = State.objects.values(*topics).last()

            for topic, message in data.items():
                print(f"sending {topic} {message}")
                client.publish(MQTT_TOPIC_PREFIX + topic, str(message))

            time.sleep(1.0)
