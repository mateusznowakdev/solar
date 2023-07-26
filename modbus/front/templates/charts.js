const { Fragment, createElement: c, useEffect, useState } = React;

const OFFSETS = {
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

const SAMPLE_BASE_DATE = new Date();
const SAMPLE = [...Array(60).keys()].reverse().map((offset) => ({
  x: dayjs(SAMPLE_BASE_DATE).subtract(offset, "seconds").format("HH:mm:ss"),
  y: offset + Math.random() * 5,
}));

function buildDateFromStrings(date, time) {
  return dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm");
}

function buildDateWithOffset(offset) {
  return dayjs().subtract(offset, "seconds");
}

function getEmptyDateState() {
  return { date: "", time: "" };
}

function getPastDateState(offset) {
  const date = buildDateWithOffset(offset);
  return {
    date: dayjs(date).format("YYYY-MM-DD"),
    time: dayjs(date).format("HH:mm"),
  };
}

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

function PresetButtons({ setStartDate, setStopDate }) {
  return c(
    "div",
    { className: "mb-3 mx-3 preset-buttons" },
    Object.entries(OFFSETS).map(([label, offset]) =>
      c(
        "button",
        {
          className: "btn btn-light",
          onClick: () => {
            setStartDate(getPastDateState(offset));
            setStopDate(getEmptyDateState());
          },
          key: label,
        },
        label,
      ),
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
    c(
      "button",
      {
        className: "btn btn-light me-3",
        onClick: () => setCurrent(getEmptyDateState()),
      },
      "×",
    ),
  );
}

function SeriesChart() {
  useEffect(() => {
    new Chart(document.getElementById("canvas"), {
      type: "line",
      data: {
        datasets: [{ data: SAMPLE.map((row) => row.y) }],
        labels: SAMPLE.map((row) => row.x),
      },
      options: {
        animation: false,
        elements: {
          line: { borderWidth: 1 },
          point: { pointStyle: false },
        },
        interaction: { intersect: false },
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        responsive: true,
      },
    });
  }, []);

  return c(
    "div",
    { className: "mx-3", id: "canvasWrapper" },
    c("canvas", { height: "256px", id: "canvas" }),
  );
}

function App() {
  const [state, setState] = useState({});
  const [meta, setMeta] = useState({});

  const [choice, setChoice] = useState("");
  const [startDate, setStartDate] = useState(getPastDateState(OFFSETS["5m"]));
  const [stopDate, setStopDate] = useState(getEmptyDateState());

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

  useEffect(() => {
    console.log({
      from: buildDateFromStrings(startDate.date, startDate.time),
      to: buildDateFromStrings(stopDate.date, stopDate.time),
    });
  }, [startDate, stopDate]);

  return c(
    Fragment,
    null,
    c(SeriesSelect, {
      choices: mergeSelectData(),
      current: choice,
      setCurrent: setChoice,
    }),
    c(PresetButtons, { setStartDate, setStopDate }),
    c(DateTimeInput, { current: startDate, setCurrent: setStartDate }),
    c(DateTimeInput, { current: stopDate, setCurrent: setStopDate }),
    c(SeriesChart),
  );
}

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(c(App));
