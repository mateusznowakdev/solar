import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import ArrowClockwise from "react-bootstrap-icons/dist/icons/arrow-clockwise";
import Pin from "react-bootstrap-icons/dist/icons/pin";
import PinFill from "react-bootstrap-icons/dist/icons/pin-fill";

import { STRINGS } from "../locale";
import { METADATA } from "../meta";
import { getBackendURI } from "../utils";

const UPDATE_INTERVAL = 2500;
const UPDATE_MAX_COUNT = 120; // {# 2.5s x 120 = 5min #}

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

function IdleRefreshButton({ value }) {
  let stickyContent;

  if (value >= UPDATE_MAX_COUNT) {
    stickyContent = (
      <Button
        className="m-3"
        onClick={() => window.location.reload()}
        variant="light"
      >
        <ArrowClockwise />
        {STRINGS.REFRESH}
      </Button>
    );
  } else {
    stickyContent = (
      <ProgressBar
        now={100 - (value * 100) / UPDATE_MAX_COUNT}
        style={{ height: "2px" }}
        variant="danger"
      />
    );
  }

  return <div className="sticky-top">{stickyContent}</div>;
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
      <div className="me-3">
        {item.value} {item.unit}
      </div>
    </ListGroup.Item>
  );
}

function StateList({ items, togglePinned }) {
  return (
    <ListGroup variant="flush">
      {items.map((item) => (
        <StateListItem item={item} key={item.key} togglePinned={togglePinned} />
      ))}
    </ListGroup>
  );
}

export default function Main() {
  const [state, setState] = useState({});
  const [pinned, setPinned] = useState([]);

  const [counter, setCounter] = useState(0);

  function getState() {
    fetch(getBackendURI() + "/api/state/")
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => setState(json));
  }

  function getPinned() {
    const pinned = JSON.parse(
      localStorage.getItem("pinned") || '["timestamp"]',
    );
    setPinned(pinned);
  }

  function togglePinned(key) {
    const pinnedCopy = [...pinned];

    const idx = pinnedCopy.indexOf(key);
    idx === -1 ? pinnedCopy.push(key) : pinnedCopy.splice(idx, 1);

    setPinned(pinnedCopy);
    localStorage.setItem("pinned", JSON.stringify(pinnedCopy));
  }

  function mergeListData() {
    return Object.entries(METADATA)
      .map(([key, meta]) => ({
        description: meta.description,
        key,
        pin: pinned.includes(key),
        unit: meta.unit,
        value: meta.render(state[key]),
      }))
      .sort(sortByPinned);
  }

  function updateCounter() {
    // {# This is counter-intuitive, but updated state would not be accessible #}
    setCounter((c) => {
      if (c < UPDATE_MAX_COUNT) {
        getState();
        return c + 1;
      } else {
        return c;
      }
    });
  }

  useEffect(getState, []);
  useEffect(getPinned, []);

  useEffect(() => {
    const fn = setInterval(updateCounter, UPDATE_INTERVAL);
    return () => clearInterval(fn);
  }, []);

  return (
    <div>
      <IdleRefreshButton value={counter} />
      <StateList items={mergeListData()} togglePinned={togglePinned} />
    </div>
  );
}
