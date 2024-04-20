import { Client } from "paho-mqtt/paho-mqtt";
import { useEffect, useState } from "react";

import RefreshButton from "../components/RefreshButton";
import ErrorText from "../components/generic/ErrorText";
import LoadingText from "../components/generic/LoadingText";
import ParameterList from "../components/parameters/ParameterList";
import { STRINGS } from "../locale";
import { STORAGE_KEYS, getStorage, setStorage } from "../storage";
import { dateReviver, isSecureNetwork, toggleItem } from "../utils";

const MQTT_JSON_TOPIC = "solar/json";

function ParametersContainer({ data, error, loading, pinned, togglePinned }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return <ParameterList data={data} pinned={pinned} togglePinned={togglePinned} />;
}

export default function Parameters() {
  const [data, setData] = useState({});
  const [pinned, setPinned] = useState(getStorage(STORAGE_KEYS.PINNED));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lostConnection, setLostConnection] = useState(false);

  function getMQTTClient() {
    const host = window.location.hostname;
    const name = "sub" + Math.floor(Math.random() * 1000000);

    let port, path;
    if (!import.meta.env.DEV) {
      port = isSecureNetwork() ? 443 : 80;
      path = "/ws/";
    } else {
      port = 8883;
      path = "/";
    }

    const client = new Client(host, port, path, name);

    client.onMessageArrived = (message) => {
      try {
        setData(JSON.parse(message.payloadString, dateReviver));
      } catch (e) {
        setError(e.toString());
      }
    };
    client.onConnectionLost = () => {
      setLostConnection(true);
    };

    client.connect({
      onSuccess: () => {
        setLostConnection(false);
        setLoading(false);
        setError(false);
        client.subscribe(MQTT_JSON_TOPIC, {});
      },
      onFailure: (e) => {
        setLoading(false);
        setError(e.errorMessage);
      },
      timeout: 5.0,
      useSSL: isSecureNetwork(),
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
    setStorage(STORAGE_KEYS.PINNED, pinnedCopy);
  }

  useEffect(getMQTTClient, []);

  return (
    <div>
      <h1 className="my-3">{STRINGS.MENU_MAIN}</h1>
      <ParametersContainer
        data={data}
        error={error}
        loading={loading}
        pinned={pinned}
        togglePinned={togglePinned}
      />
      {lostConnection && <RefreshButton />}
    </div>
  );
}
