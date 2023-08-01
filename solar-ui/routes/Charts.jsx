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
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  FormSelect,
  InputGroup,
} from "react-bootstrap";
import { useParams } from "react-router-dom";

import { STRINGS } from "../locale.js";
import { METADATA } from "../meta.js";
import { getBackendURI } from "../utils.js";

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

function getPastDateState(offset) {
  const date = buildDateWithOffset(offset);
  return {
    date: dayjs(date).format("YYYY-MM-DD"),
    time: dayjs(date).format("HH:mm"),
  };
}

function shouldHaveChart(key) {
  return (METADATA[key] || {}).chart;
}

function sort(a, b) {
  return a.description.localeCompare(b.description);
}

function SeriesSelect({ choices, current, setCurrent }) {
  return (
    <InputGroup>
      <FormSelect
        className="mb-3 mx-3"
        onChange={(e) => setCurrent(e.target.value)}
        value={current}
      >
        <option key="" value="">
          ------
        </option>
        {choices.map((item) => (
          <option key={item.key} value={item.key}>
            {item.description}
          </option>
        ))}
      </FormSelect>
    </InputGroup>
  );
}

function PresetButtons({ setStartDate, setStopDate }) {
  return (
    <div className="mb-3 mx-3 preset-buttons">
      {Object.entries(OFFSETS).map(([label, offset]) => (
        <Button
          key={label}
          onClick={() => {
            setStartDate(getPastDateState(offset));
            setStopDate(getEmptyDateState());
          }}
          variant="light"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function DateTimeInput({ current: { date, time }, setCurrent }) {
  return (
    <InputGroup className="date-time-input mb-3">
      <FormControl
        className="ms-3"
        onChange={(e) => setCurrent((c) => ({ ...c, date: e.target.value }))}
        type="date"
        value={date}
      />
      <FormControl
        onChange={(e) => setCurrent((c) => ({ ...c, time: e.target.value }))}
        type="time"
        value={time}
      />
      <Button
        className="me-3"
        onClick={() => setCurrent(getEmptyDateState())}
        variant="light"
      >
        ×
      </Button>
    </InputGroup>
  );
}

function SeriesChart({ choice, data }) {
  if (!shouldHaveChart(choice)) {
    return (
      <div className="mx-3 text-center text-muted">
        {STRINGS.INVALID_SERIES_HINT}
      </div>
    );
  }

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

  return (
    <div className="mx-3">
      <canvas height="256px" id="canvas"></canvas>
    </div>
  );
}

export default function Charts() {
  const [series, setSeries] = useState([]);

  const { choice } = useParams();
  const [startDate, setStartDate] = useState(getPastDateState(OFFSETS["5m"]));
  const [stopDate, setStopDate] = useState(getEmptyDateState());

  function setChoice(choice) {
    window.location = `/#/charts/${choice}`;
  }

  function getSeries() {
    if (!shouldHaveChart(choice)) return;

    const params = {
      source: choice,
    };

    const startDateObj = buildDateFromStrings(startDate.date, startDate.time);
    if (!isNaN(startDateObj)) params.date_from = startDateObj.toISOString();

    const stopDateObj = buildDateFromStrings(stopDate.date, stopDate.time);
    if (!isNaN(stopDateObj)) params.date_to = stopDateObj.toISOString();

    fetch(getBackendURI() + "/api/series/?" + new URLSearchParams(params))
      .then((response) => (response.ok ? response.json() : []))
      .then((json) => setSeries(json));
  }

  function mergeSelectData() {
    return Object.entries(METADATA)
      .map(([key, meta]) => {
        let description = meta.description;
        if (meta.unit) description += ` (${meta.unit})`;

        return { description, key };
      })
      .sort(sort);
  }

  useEffect(getSeries, [choice, startDate, stopDate]);

  return (
    <>
      <Button
        className="m-3"
        onClick={() => (window.location = "/#/")}
        variant="light"
      >
        🡠 {STRINGS.BACK}
      </Button>
      <Form>
        <SeriesSelect
          choices={mergeSelectData()}
          current={choice}
          setCurrent={setChoice}
        />
        <PresetButtons
          setStartDate={setStartDate}
          setStopDate={setStopDate}
        ></PresetButtons>
        <DateTimeInput
          current={startDate}
          setCurrent={setStartDate}
        ></DateTimeInput>
        <DateTimeInput
          current={stopDate}
          setCurrent={setStopDate}
        ></DateTimeInput>
      </Form>
      <SeriesChart choice={choice} data={series}></SeriesChart>
    </>
  );
}
