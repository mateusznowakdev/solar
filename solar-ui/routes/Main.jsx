import { Client } from "paho-mqtt/paho-mqtt";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Pin from "react-bootstrap-icons/dist/icons/pin";
import PinFill from "react-bootstrap-icons/dist/icons/pin-fill";
import LinkContainer from "react-router-bootstrap/LinkContainer";

import { STRINGS } from "../locale";
import { METADATA } from "../meta";

const MQTT_JSON_TOPIC = "solar/json";

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

function RefreshPrompt({ show }) {
  if (!show) return;

  return (
    <div className="p-2 sticky-top">
      <Alert className="m-0 p-1 text-center" variant="warning">
        {STRINGS.PULL_TO_REFRESH}
      </Alert>
    </div>
  );
}

function StateListItem({ item, togglePinned }) {
  return (
    <LinkContainer state={{ choice: item.key }} to="/charts">
      <ListGroup.Item
        action
        active={false}
        className="align-items-center d-flex justify-content-between"
      >
        <div
          className="pin-icon"
          onClick={(e) => {
            togglePinned(item.key);
            e.preventDefault();
          }}
        >
          {item.pin ? <PinFill /> : <Pin />}
        </div>
        <div className="flex-grow-1 me-2">{item.description}</div>
        <div>
          {item.value} {item.unit}
        </div>
      </ListGroup.Item>
    </LinkContainer>
  );
}

function StateList({ data, pinned, togglePinned }) {
  const finalData = Object.entries(METADATA)
    .map(([key, meta]) => ({
      description: meta.description,
      key,
      pin: pinned.includes(key),
      unit: meta.unit,
      value: meta.render(data[key]),
    }))
    .sort(sortByPinned);

  return (
    <ListGroup variant="flush">
      {finalData.map((item) => (
        <StateListItem item={item} key={item.key} togglePinned={togglePinned} />
      ))}
    </ListGroup>
  );
}

export default function Main() {
  const [state, setState] = useState({});
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
      setState(JSON.parse(message.payloadString));
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
      <StateList data={state} pinned={pinned} togglePinned={togglePinned} />
    </div>
  );
}
