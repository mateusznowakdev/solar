const UPDATE_INTERVAL = 2500;
const UPDATE_MAX_COUNT = 120; // {# 2.5s x 120 = 5min #}

const { Fragment, createElement: c, useEffect, useState } = React;

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

function IdleRefreshButton({ value }) {
  if (value < UPDATE_MAX_COUNT) return;

  return c(
    "button",
    { className: "btn btn-light m-3", onClick: () => location.reload() },
    "Odśwież",
  );
}

function StateListItem({ item, toggleFn }) {
  return c(
    "li",
    { className: "d-flex justify-content-between list-group-item" },
    c(
      "div",
      { className: "d-flex" },
      c(
        "div",
        { className: "me-2 pin-icon", onClick: () => toggleFn(item.key) },
        item.pin ? "⚫" : "⚪",
      ),
      c("div", { className: "me-2" }, item.description),
    ),
    c("div", null, `${item.value} ${item.unit}`),
  );
}

function StateList({ items, toggleFn }) {
  return c(
    "ul",
    { className: "list-group list-group-flush" },
    items.map((item, key) => c(StateListItem, { item, key, toggleFn })),
  );
}

function App() {
  const [state, setState] = useState({});
  const [meta, setMeta] = useState({});
  const [pinned, setPinned] = useState([]);

  const [counter, setCounter] = useState(0);

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

  function mergeData() {
    return Object.entries(state)
      .map(([key, value]) => {
        const keyMeta = meta[key] || {};
        return {
          key,
          value,
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

  return c(
    Fragment,
    null,
    c(IdleRefreshButton, { value: counter }),
    c(StateList, { items: mergeData(), toggleFn: togglePinned }),
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(c(App));
