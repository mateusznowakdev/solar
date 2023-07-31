import { useEffect, useState } from "react";
import { Button, ListGroup, ListGroupItem, ProgressBar } from "react-bootstrap";

const API_URL = "http://localhost:8000";

const UPDATE_INTERVAL = 2500;
const UPDATE_MAX_COUNT = 120; // {# 2.5s x 120 = 5min #}

function isDate(value) {
  return value
    .toString()
    .substring(0, 10)
    .match(/\d{4}-\d{2}-\d{2}/);
}

function mapValue(value, choices) {
  if (choices) {
    return choices[value.toString()] || value;
  }

  if (isDate(value)) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(value));
  }

  if (typeof value == "object") {
    return JSON.stringify(value);
  }

  return value;
}

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
        ↻
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
    <ListGroupItem
      action
      className="d-flex justify-content-between list-group-item"
      href={"/#/charts/" + item.key}
    >
      <div className="d-flex">
        <div
          className="me-2 pin-icon"
          onClick={(e) => {
            togglePinned(item.key);
            e.preventDefault();
          }}
        >
          {item.pin ? "🔴" : "⚪"}
        </div>
        <div className="me-2">{item.description}</div>
      </div>
      <div>
        {item.value} {item.unit}
      </div>
    </ListGroupItem>
  );
}

function StateList({ items, togglePinned }) {
  return (
    <ListGroup>
      {items.map((item) => (
        <StateListItem item={item} key={item.key} togglePinned={togglePinned} />
      ))}
    </ListGroup>
  );
}

export default function Main() {
  const [state, setState] = useState({});
  const [meta, setMeta] = useState({});
  const [pinned, setPinned] = useState([]);

  const [counter, setCounter] = useState(0);

  function getState() {
    fetch(API_URL + "/api/state/")
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => setState(json));
  }

  function getMeta() {
    fetch(API_URL + "/api/meta/")
      .then((response) => response.json())
      .then((json) => setMeta(json));
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
    return Object.entries(state)
      .map(([key, value]) => {
        const keyMeta = meta[key] || {};
        return {
          key,
          value: mapValue(value, keyMeta["choices"]),
          pin: pinned.includes(key),
          description: keyMeta["description"] || key,
          unit: keyMeta["unit"] || "",
        };
      })
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
  useEffect(getMeta, []);
  useEffect(getPinned, []);

  useEffect(() => {
    const fn = setInterval(updateCounter, UPDATE_INTERVAL);
    return () => clearInterval(fn);
  }, []);

  return (
    <>
      <IdleRefreshButton value={counter} />
      <StateList items={mergeListData()} togglePinned={togglePinned} />
    </>
  );
}
