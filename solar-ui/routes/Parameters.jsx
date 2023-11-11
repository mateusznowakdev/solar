import { Client } from "paho-mqtt/paho-mqtt";
import { useEffect, useState } from "react";

import LegalNotice from "../components/LegalNotice";
import RefreshIcon from "../components/RefreshIcon";
import ParameterList from "../components/parameters/ParameterList";
import { dateReviver } from "../utils";

const MQTT_JSON_TOPIC = "solar/json";

export default function Parameters() {
  const [data, setData] = useState({});
  const [pinned, setPinned] = useState([]);

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
      setData(JSON.parse(message.payloadString, dateReviver));
    };
    client.onConnectionLost = () => {};

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
      <ParameterList data={data} pinned={pinned} togglePinned={togglePinned} />
      <LegalNotice />
      <RefreshIcon />
    </div>
  );
}
