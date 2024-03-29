import { Client } from "paho-mqtt/paho-mqtt";
import { useEffect, useState } from "react";

import RefreshIcon from "../components/RefreshIcon";
import ErrorText from "../components/generic/ErrorText";
import LoadingText from "../components/generic/LoadingText";
import LegalNotice from "../components/parameters/LegalNotice";
import ParameterList from "../components/parameters/ParameterList";
import { STRINGS } from "../locale";
import { STORAGE_PINNED, getStorage, setStorage } from "../storage";
import { dateReviver, toggleItem } from "../utils";

const MQTT_JSON_TOPIC = "solar/json";

function ParametersContainer({ data, error, loading, pinned, togglePinned }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <>
      <ParameterList data={data} pinned={pinned} togglePinned={togglePinned} />
      <LegalNotice />
    </>
  );
}

export default function Parameters() {
  const [data, setData] = useState({});
  const [pinned, setPinned] = useState(getStorage(STORAGE_PINNED));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lostConnection, setLostConnection] = useState(false);

  function getMQTTClient() {
    const clientName = "sub" + Math.floor(Math.random() * 1000000);
    const client = new Client(window.location.hostname, 8883, "/", clientName);

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
    setStorage(STORAGE_PINNED, pinnedCopy);
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
      {lostConnection && <RefreshIcon />}
    </div>
  );
}
