const { Fragment, createElement: c, useEffect, useState } = React;

const PRESETS = {
  "1m": 60,
  "5m": 60 * 5,
  "10m": 60 * 10,
  "30m": 60 * 30,
  "1h": 60 * 60,
  "2h": 60 * 60 * 2,
  "4h": 60 * 60 * 4,
  "12h": 60 * 60 * 12,
  "1d": 60 * 60 * 24,
  "7d": 60 * 60 * 24 * 7,
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
    { className: "mb-3 mx-3 preset-buttons" },
    Object.keys(PRESETS).map((label) =>
      c("button", { className: "btn btn-light", key: label }, label),
    ),
  );
}

function DateTimeInput({ current: { date, time }, setCurrent }) {
  return c(
    "div",
    { className: "date-time-input input-group mb-3" },
    c("input", {
      className: "form-control ms-3",
      onChange: (e) => setCurrent((c) => ({ ...c, date: e.target.value })),
      type: "date",
      value: date,
    }),
    c("input", {
      className: "form-control",
      onChange: (e) => setCurrent((c) => ({ ...c, time: e.target.value })),
      type: "time",
      value: time,
    }),
    c("button", { className: "btn btn-light me-3" }, "×"),
  );
}

function App() {
  const [state, setState] = useState({});
  const [meta, setMeta] = useState({});

  const [choice, setChoice] = useState("");
  const [startDate, setStartDate] = useState({ date: "", time: "" });
  const [stopDate, setStopDate] = useState({ date: "", time: "" });

  function getInitialKey() {
    const params = new URLSearchParams(location.search);
    const initial = params.get("initial");

    if (initial) setChoice(initial);
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
    c(SeriesSelect, {
      choices: mergeSelectData(),
      current: choice,
      setCurrent: setChoice,
    }),
    c(PresetButtons),
    c(DateTimeInput, { current: startDate, setCurrent: setStartDate }),
    c(DateTimeInput, { current: stopDate, setCurrent: setStopDate }),
    c("pre", {}, JSON.stringify({ from: startDate, to: stopDate }, null, 4)),
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(c(App));
