const { createElement: c, useEffect, useState } = React;

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  if (a.key < b.key) return -1;
  if (a.key > b.key) return 1;

  return 0;
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
      c("div", { className: "me-2" }, item.key),
    ),
    c("div", null, item.value),
  );
}

function StateList({ items, toggleFn }) {
  return c(
    "ul",
    { className: "list-group list-group-flush" },
    items.map((item) => c(StateListItem, { item, toggleFn })),
  );
}

function App() {
  const [state, setState] = useState({});
  const [pinned, setPinned] = useState([]);

  function getState() {
    fetch("/api/state/")
      .then((response) => response.json())
      .then((json) => setState(json));
  }

  function getPinned() {
    const pinned = JSON.parse(localStorage.getItem("pinned") || '["timestamp"]');
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
      .map(([key, value]) => ({
        key,
        value,
        pin: pinned.includes(key),
      }))
      .sort(sortByPinned);
  }

  useEffect(getPinned, []);
  useEffect(getState, []);

  return c(StateList, { items: mergeData(), toggleFn: togglePinned });
}

ReactDOM.render(c(App), document.getElementById("root"));
