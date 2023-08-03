import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
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
import { renderDate, renderDateTime } from "../render.js";
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
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
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

function SeriesChart({ choice, choice2, data }) {
  const dateFromString = renderDateTime(data.dateFrom);
  const dateToString = renderDateTime(data.dateTo);

  const choice1Valid = shouldHaveChart(choice);
  const choice2Valid = shouldHaveChart(choice2);

  useEffect(() => {
    const chartData = {
      datasets: [],
      labels: data.values.map((row) => row[0]),
    };

    if (choice1Valid) {
      chartData.datasets.push({
        backgroundColor: "#ff000033",
        borderColor: "#ff0000",
        data: data.values.map((row) => row[1]),
        label: METADATA[choice].description,
        yAxisID: "y1",
      });
    }
    if (choice2Valid) {
      chartData.datasets.push({
        backgroundColor: "#ffaa0033",
        borderColor: "#ffaa00",
        data: data.values.map((row) => row[2]),
        label: METADATA[choice2].description,
        yAxisID: "y2",
      });
    }

    const chart = new Chart(document.getElementById("canvas"), {
      type: "line",
      data: chartData,
      options: {
        animation: false,
        elements: {
          line: { borderWidth: 1 },
          point: { pointStyle: false },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${dateFromString} — ${dateToString}`,
          },
          tooltip: {
            callbacks: {
              title: (context) =>
                renderDateTime(data.values[context[0].parsed.x][0]),
              label: (context) => METADATA[choice].render(context.raw),
            },
          },
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              callback: (value) => renderDate(data.values[value][0]),
            },
          },
          y1: {
            grid: {
              display: false,
            },
            position: "left",
            ticks: {
              callback: (value) => METADATA[choice].render(value),
              precision: 0,
            },
          },
          y2: {
            grid: {
              display: false,
            },
            position: "right",
            ticks: {
              callback: (value) => METADATA[choice].render(value),
              precision: 0,
            },
          },
        },
      },
    });

    return () => {
      if (chart) chart.destroy();
    };
  }, [data]);

  if (choice1Valid || choice2Valid) {
    return (
      <div className="mx-3">
        <canvas height="256px" id="canvas"></canvas>
      </div>
    );
  } else {
    return (
      <div className="mx-3 text-center text-muted">
        {STRINGS.INVALID_SERIES_HINT}
      </div>
    );
  }
}

export default function Charts() {
  const [series, setSeries] = useState({ values: [] });

  const { choice } = useParams();
  const [choice2, setChoice2] = useState("");
  const [startDate, setStartDate] = useState(getPastDateState(OFFSETS["5m"]));
  const [stopDate, setStopDate] = useState(getEmptyDateState());

  function setChoice(choice) {
    window.location = `/#/charts/${choice}`;
  }

  function getSeries() {
    const params = {};

    if (shouldHaveChart(choice)) params.source1 = choice;
    if (shouldHaveChart(choice2)) params.source2 = choice2;

    if (Object.keys(params).length < 1) return;

    const startDateObj = buildDateFromStrings(startDate.date, startDate.time);
    if (!isNaN(startDateObj)) params.date_from = startDateObj.toISOString();

    const stopDateObj = buildDateFromStrings(stopDate.date, stopDate.time);
    if (!isNaN(stopDateObj)) params.date_to = stopDateObj.toISOString();

    fetch(getBackendURI() + "/api/series/?" + new URLSearchParams(params))
      .then((response) => (response.ok ? response.json() : []))
      .then((json) => {
        const jsonParsed = {
          dateFrom: new Date(json.date_from),
          dateTo: new Date(json.date_to),
          values: json.values.map(([x, y1, y2]) => [new Date(x), y1, y2]),
        };
        setSeries(jsonParsed);
      });
  }

  function mergeSelectData() {
    return Object.entries(METADATA)
      .filter(([key]) => shouldHaveChart(key))
      .map(([key, meta]) => {
        let description = meta.description;
        if (meta.unit) description += ` (${meta.unit})`;

        return { description, key };
      })
      .sort(sort);
  }

  useEffect(getSeries, [choice, choice2, startDate, stopDate]);

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
        <SeriesSelect
          choices={mergeSelectData()}
          current={choice2}
          setCurrent={setChoice2}
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
      <SeriesChart
        choice={choice}
        choice2={choice2}
        data={series}
      ></SeriesChart>
    </>
  );
}
