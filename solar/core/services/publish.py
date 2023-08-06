import random
import time
from typing import NoReturn

from paho.mqtt.client import Client

from solar.core.models import State

MQTT_TOPIC_PREFIX = "solar/"


class PublishService:
    def __init__(self, *, broker: str, port: int, topics: list[str]) -> None:
        self.broker = broker
        self.port = port
        self.topics = topics

    def publish(self) -> NoReturn:
        if len(self.topics) == 0:
            print("MQTT_TOPICS environment variable not set, no data will be sent")
            while True:
                # while True: pass would result in 100% CPU usage
                time.sleep(100.0)

        client = Client(f"publisher-{random.randint(0, 9999):04d}")
        client.connect(self.broker, self.port)
        client.loop_start()

        while True:
            data = State.objects.values(*self.topics).last()

            for topic, message in data.items():
                print(f"sending {topic} {message}")
                client.publish(MQTT_TOPIC_PREFIX + topic, str(message))

            time.sleep(1.0)
