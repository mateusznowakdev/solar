import mqtt from "mqtt/dist/mqtt";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Pin from "react-bootstrap-icons/dist/icons/pin";
import PinFill from "react-bootstrap-icons/dist/icons/pin-fill";

import { STRINGS } from "../locale";
import { METADATA } from "../meta";
import { getBrokerURI } from "../utils";

const MQTT_JSON_TOPIC = "solar/json";

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

function RefreshPrompt({ show }) {
  if (!show) return;

  return (
    <div className="p-3 sticky-top">
      <Alert className="m-0 p-1 text-center" variant="warning">
        {STRINGS.PULL_TO_REFRESH}
      </Alert>
    </div>
  );
}

function StateListItem({ item, togglePinned }) {
  return (
    <ListGroup.Item
      action
      active={false}
      className="align-items-center d-flex justify-content-between"
      href={"/#/charts/" + item.key}
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
    const client = mqtt.connect(getBrokerURI());

    client.on("connect", () => {
      client.subscribe(MQTT_JSON_TOPIC, (err) => {
        if (!err) console.log("Connected");
      });
    });

    client.on("message", (topic, message) => {
      setLive(true);
      setState(JSON.parse(message.toString()));
    });

    client.on("error", () => setLive(false));
    client.on("close", () => setLive(false));
    client.on("disconnect", () => setLive(false));

    return () => {
      if (client) client.end();
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
