import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";
import dayjs from "dayjs";
import { Fragment, createElement as c, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:8000";

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

Chart.register(
  CategoryScale,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
);

function buildDateFromStrings(date, time) {
  return dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm");
}

function buildDateWithOffset(offset) {
  return dayjs().subtract(offset, "seconds");
}

function getEmptyDateState() {
  return { date: "", time: "" };
}

function getInitialKey() {
  return new URLSearchParams(location.search).get("initial");
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
        className: "form-select mb-3 mx-3",
        onChange: (e) => setCurrent(e.target.value),
        value: current,
      },
      c("option", { key: "", value: "" }, "------"),
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

function SeriesChart({ data }) {
  useEffect(() => {
    const chart = new Chart(document.getElementById("canvas"), {
      type: "line",
      data: {
        datasets: [
          {
            borderColor: "#ff0000",
            backgroundColor: "#ff000033",
            data: data.map((row) => parseFloat(row[1])),
            fill: true,
          },
        ],
        labels: data.map((row) => dayjs(row[0]).format("HH:mm:ss")),
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

    return () => {
      if (chart) chart.destroy();
    };
  }, [data]);

  return c(
    "div",
    { className: "mx-3", id: "canvasWrapper" },
    c("canvas", { height: "256px", id: "canvas" }),
  );
}

export default function Charts() {
  const [state, setState] = useState({});
  const [meta, setMeta] = useState({});

  const [series, setSeries] = useState([]);

  const { choice } = useParams();
  const [startDate, setStartDate] = useState(getPastDateState(OFFSETS["5m"]));
  const [stopDate, setStopDate] = useState(getEmptyDateState());

  function setChoice(choice) {
    window.location = `/#/charts/${choice}`;
  }

  function getState() {
    fetch(API_URL + "/api/state/")
      .then((response) => response.json())
      .then((json) => setState(json));
  }

  function getMeta() {
    fetch(API_URL + "/api/meta/")
      .then((response) => response.json())
      .then((json) => setMeta(json));
  }

  function getSeries() {
    const params = {
      source: choice,
    };

    const startDateObj = buildDateFromStrings(startDate.date, startDate.time);
    if (!isNaN(startDateObj)) params.date_from = startDateObj.toISOString();

    const stopDateObj = buildDateFromStrings(stopDate.date, stopDate.time);
    if (!isNaN(stopDateObj)) params.date_to = stopDateObj.toISOString();

    fetch(API_URL + "/api/series/?" + new URLSearchParams(params))
      .then((response) => (response.ok ? response.json() : []))
      .then((json) => setSeries(json));
  }

  function mergeSelectData() {
    return Object.keys(state)
      .map((key) => {
        const keyMeta = meta[key] || {};

        const unit = keyMeta["unit"];
        let description = keyMeta["description"] || key;
        if (unit) description += ` (${unit})`;

        return { description, key };
      })
      .sort(sort);
  }

  useEffect(getState, []);
  useEffect(getMeta, []);

  useEffect(getSeries, [choice, startDate, stopDate]);

  return c(
    Fragment,
    null,
    c(
      "button",
      { className: "btn btn-light m-3", onClick: () => (location.href = "/") },
      "←",
    ),
    c(SeriesSelect, {
      choices: mergeSelectData(),
      current: choice,
      setCurrent: setChoice,
    }),
    c(PresetButtons, { setStartDate, setStopDate }),
    c(DateTimeInput, { current: startDate, setCurrent: setStartDate }),
    c(DateTimeInput, { current: stopDate, setCurrent: setStopDate }),
    c(SeriesChart, { data: series }),
  );
}
