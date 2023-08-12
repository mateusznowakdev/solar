import { Client } from "paho-mqtt/paho-mqtt";
import { useEffect, useState } from "react";

import ParameterList from "../components/parameters/ParameterList";
import RefreshPrompt from "../components/parameters/RefreshPrompt";

const MQTT_JSON_TOPIC = "solar/json";

export default function Parameters() {
  const [data, setData] = useState({});
  const [pinned, setPinned] = useState([]);

  const [isLive, setLive] = useState(true);

  function getPinned() {
    const pinned = JSON.parse(
      localStorage.getItem("pinned") || '["timestamp"]',
    );
    setPinned(pinned);
  }

  function getMQTTClient() {
    const clientName = "sub" + Math.floor(Math.random() * 1000000);
    const client = new Client(window.location.hostname, 8883, "/", clientName);

    client.onMessageArrived = (message) => {
      setLive(true);
      setData(JSON.parse(message.payloadString));
    };
    client.onConnectionLost = () => {
      setLive(false);
    };

    client.connect({
      onSuccess: () => {
        client.subscribe(MQTT_JSON_TOPIC, {});
      },
    });

    return () => {
      if (client) {
        try {
          client.disconnect();
        } catch {
          /* "Invalid state not connecting or connected" */
        }
      }
    };
  }

  function togglePinned(key) {
    const pinnedCopy = [...pinned];

    const idx = pinnedCopy.indexOf(key);
    idx === -1 ? pinnedCopy.push(key) : pinnedCopy.splice(idx, 1);

    setPinned(pinnedCopy);
    localStorage.setItem("pinned", JSON.stringify(pinnedCopy));
  }

  useEffect(getPinned, []);
  useEffect(getMQTTClient, []);

  return (
    <div>
      <RefreshPrompt show={!isLive} />
      <ParameterList data={data} pinned={pinned} togglePinned={togglePinned} />
    </div>
  );
}
