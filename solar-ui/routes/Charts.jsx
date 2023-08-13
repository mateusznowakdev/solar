import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useLocation } from "react-router-dom";

import Chart from "../components/charts/Chart";

import { METADATA } from "../meta";
import { getBackendURI } from "../utils";

const OFFSETS = {
  "1m": 60,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "8h": 60 * 60 * 8,
  "24h": 60 * 60 * 24,
};

function buildDateFromStrings({ date, time }) {
  return dayjs(`${date} ${time}`, "YYYY-MM-DD HH:mm");
}

function buildStringsFromDate(date) {
  return {
    date: dayjs(date).format("YYYY-MM-DD"),
    time: dayjs(date).format("HH:mm"),
  };
}

function buildStringsFromOffsetDate(date, offset) {
  return buildStringsFromDate(dayjs().subtract(offset, "seconds"));
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
      <Form.Select
        className="my-1"
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
      </Form.Select>
    </InputGroup>
  );
}

function DateTimeInput({ current: { date, time }, setCurrent }) {
  return (
    <InputGroup className="date-time-input">
      <Form.Control
        className="my-1"
        onChange={(e) => setCurrent((c) => ({ ...c, date: e.target.value }))}
        type="date"
        value={date}
      />
      <Form.Control
        className="my-1"
        onChange={(e) => setCurrent((c) => ({ ...c, time: e.target.value }))}
        type="time"
        value={time}
      />
      <Button
        className="my-1"
        onClick={() => setCurrent(getEmptyDateState())}
        variant="light"
      >
        ×
      </Button>
    </InputGroup>
  );
}

function PresetButtons({ setStartDate, setStopDate, submitButton }) {
  return (
    <div className="preset-buttons">
      {Object.entries(OFFSETS).map(([label, offset]) => (
        <Button
          className="my-1"
          key={label}
          onClick={() => {
            setStartDate(buildStringsFromOffsetDate(new Date(), offset));
            setStopDate(buildStringsFromDate(new Date()));
          }}
          size="sm"
          variant="light"
        >
          {label}
        </Button>
      ))}
      {submitButton}
    </div>
  );
}

export default function Charts() {
  const location = useLocation();

  const [data, setData] = useState(null);

  const [seriesA, setSeriesA] = useState(location.state?.choice || "");
  const [seriesB, setSeriesB] = useState("");
  const [startDate, setStartDate] = useState(
    buildStringsFromOffsetDate(new Date(), OFFSETS["15m"]),
  );
  const [stopDate, setStopDate] = useState(buildStringsFromDate(new Date()));

  function getSeries() {
    if (!seriesA && !seriesB) return;

    const startDateObj = buildDateFromStrings(startDate);
    const stopDateObj = buildDateFromStrings(stopDate);

    const params = [
      ["date_from", startDateObj.toISOString()],
      ["date_to", stopDateObj.toISOString()],
    ];

    if (seriesA) params.push(["field", seriesA]);
    if (seriesB) params.push(["field", seriesB]);

    fetch(getBackendURI() + "/api/series/?" + new URLSearchParams(params))
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => {
        if (!json.values) {
          setData(null);
          return;
        }

        const dateFrom = new Date(json.date_from);
        const dateTo = new Date(json.date_to);
        const fields = json.fields;
        const values = json.values.map(([x, y1, y2]) => [new Date(x), y1, y2]);

        setSeriesA(fields[0] || fields[0]);
        setSeriesB(fields[1] || "");
        setStartDate(buildStringsFromDate(dateFrom));
        setStopDate(buildStringsFromDate(dateTo));
        setData({ dateFrom, dateTo, fields, values });
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

  useEffect(getSeries, []);

  const submitButton = (
    <Button
      disabled={
        !startDate.date ||
        !startDate.time ||
        !stopDate.date ||
        !stopDate.time ||
        (!seriesA && !seriesB)
      }
      onClick={getSeries}
      variant="light"
    >
      OK
    </Button>
  );

  return (
    <div>
      <Form className="my-2">
        <SeriesSelect
          choices={mergeSelectData()}
          current={seriesA}
          setCurrent={setSeriesA}
        />
        <SeriesSelect
          choices={mergeSelectData()}
          current={seriesB}
          setCurrent={setSeriesB}
        />
        <DateTimeInput
          current={startDate}
          setCurrent={setStartDate}
        ></DateTimeInput>
        <DateTimeInput
          current={stopDate}
          setCurrent={setStopDate}
        ></DateTimeInput>
        <PresetButtons
          setStartDate={setStartDate}
          setStopDate={setStopDate}
          submitButton={submitButton}
        ></PresetButtons>
      </Form>
      {data && <Chart column={0} data={data} />}
      {data && data.fields.length > 1 && <Chart column={1} data={data} />}
    </div>
  );
}
