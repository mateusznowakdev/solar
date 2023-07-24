const { createElement: c, useEffect, useState } = React;

function sort(a, b) {
  return a.description.localeCompare(b.description);
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
    "div",
    { className: "input-group" },
    c(
      "select",
      {
        className: "form-select m-3",
        onChange: (e) => setCurrent(e.target.value),
        value: current,
      },
      mergeSelectData().map((item, key) =>
        c("option", { key, value: item.key }, item.description),
      ),
    ),
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(c(App));
