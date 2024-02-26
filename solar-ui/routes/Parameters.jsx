import { Client } from "paho-mqtt/paho-mqtt";
import { useEffect, useState } from "react";

import RefreshIcon from "../components/RefreshIcon";
import LegalNotice from "../components/parameters/LegalNotice";
import ParameterList from "../components/parameters/ParameterList";
import { STRINGS } from "../locale";
import { dateReviver, toggleItem } from "../utils";

const MQTT_JSON_TOPIC = "solar/json";

export default function Parameters() {
  const [data, setData] = useState({});
  const [pinned, setPinned] = useState(
    localStorage.getItem("pinned") || '["timestamp"]',
  );

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
    toggleItem(pinnedCopy, key);

    setPinned(pinnedCopy);
    localStorage.setItem("pinned", JSON.stringify(pinnedCopy));
  }

  useEffect(getMQTTClient, []);

  return (
    <div>
      <h1 className="my-3">{STRINGS.MENU_MAIN}</h1>
      <ParameterList data={data} pinned={pinned} togglePinned={togglePinned} />
      <LegalNotice />
      <RefreshIcon />
    </div>
  );
}
