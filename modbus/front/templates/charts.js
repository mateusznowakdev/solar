const { Fragment, createElement: c, useEffect, useState } = React;

const PRESETS = {
  "1m": 60,
  "5m": 60 * 5,
  "10m": 60 * 10,
  "30m": 60 * 30,
  "60m": 60 * 60,
  "1h": 60 * 60,
  "2h": 60 * 60 * 2,
  "4h": 60 * 60 * 4,
  "12h": 60 * 60 * 12,
  "24h": 60 * 60 * 24,
};

function sort(a, b) {
  return a.description.localeCompare(b.description);
}

function SeriesSelect({ choices, current, setCurrent }) {
  return c(
    "div",
    { className: "input-group" },
    c(
      "select",
      {
        className: "form-select m-3",
        onChange: (e) => setCurrent(e.target.value),
        value: current,
      },
      choices.map((item) =>
        c("option", { key: item.key, value: item.key }, item.description),
      ),
    ),
  );
}

function PresetButtons() {
  return c(
    "div",
    { className: "mx-3 time-buttons" },
    Object.keys(PRESETS).map((label) =>
      c("button", { className: "btn btn-light", key: label }, label),
    ),
  );
}

function App() {
  const [state, setState] = useState({});
  const [meta, setMeta] = useState({});

  const [current, setCurrent] = useState("");

  function getInitialKey() {
    const params = new URLSearchParams(location.search);
    const initial = params.get("initial");

    if (initial) setCurrent(initial);
  }

  function getState() {
    fetch("/api/state/")
      .then((response) => response.json())
      .then((json) => setState(json));
  }

  function getMeta() {
    fetch("/api/meta/")
      .then((response) => response.json())
      .then((json) => setMeta(json));
  }

  function mergeSelectData() {
    return Object.keys(state)
      .map((key) => {
        const keyMeta = meta[key] || {};
        return {
          key,
          description: keyMeta["description"] || key,
        };
      })
      .sort(sort);
  }

  useEffect(getInitialKey, []);
  useEffect(getState, []);
  useEffect(getMeta, []);

  return c(
    Fragment,
    null,
    c(SeriesSelect, { choices: mergeSelectData(), current, setCurrent }),
    c(PresetButtons),
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(c(App));
