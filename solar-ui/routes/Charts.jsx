import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";

import Chart from "../components/charts/Chart";
import ChartDateTimePicker from "../components/charts/ChartDateTimePicker";
import ChartPresetButtonGroup from "../components/charts/ChartPresetButtonGroup";
import ChartSeriesPicker from "../components/charts/ChartSeriesPicker";

import { dateReviver, getBackendURI, getDatesForOffset } from "../utils";

const OFFSETS = {
  "10m": 60 * 10,
  "30m": 60 * 30,
  "1h": 60 * 60,
  "8h": 60 * 60 * 8,
  "24h": 60 * 60 * 24,
};

export default function Charts() {
  const [initialStartDate, initialStopDate] = getDatesForOffset(OFFSETS["10m"]);

  const location = useLocation();

  const [data, setData] = useState(null);

  const [seriesA, setSeriesA] = useState(location.state?.choice || "");
  const [seriesB, setSeriesB] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [stopDate, setStopDate] = useState(initialStopDate);

  function getSeries() {
    const params = [
      ["date_from", startDate.toISOString()],
      ["date_to", stopDate.toISOString()],
    ];

    if (!seriesA && !seriesB) return;
    if (seriesA) params.push(["field", seriesA]);
    if (seriesB) params.push(["field", seriesB]);

    fetch(getBackendURI() + "/api/series/?" + new URLSearchParams(params))
      .then((response) => (response.ok ? response.text() : "{}"))
      .then((text) => {
        const json = JSON.parse(text, dateReviver);

        if (!json.values) {
          setData(null);
          return;
        }

        setData(json);
        setSeriesA(json.values[0]?.field || "");
        setSeriesB(json.values[1]?.field || "");
        setStartDate(json.date_from);
        setStopDate(json.date_to);
      });
  }

  useEffect(getSeries, []);

  const submitButton = (
    <Button
      className="w-100"
      disabled={!startDate || !stopDate || (!seriesA && !seriesB)}
      onClick={getSeries}
      variant="light"
    >
      OK
    </Button>
  );

  return (
    <div>
      <Form className="my-3">
        <ChartSeriesPicker setValue={setSeriesA} value={seriesA} />
        <ChartSeriesPicker setValue={setSeriesB} value={seriesB} />
        <ChartDateTimePicker setValue={setStartDate} value={startDate} />
        <ChartDateTimePicker setValue={setStopDate} value={stopDate} />
        <ChartPresetButtonGroup
          offsets={OFFSETS}
          setStartDate={setStartDate}
          setStopDate={setStopDate}
          submitButton={submitButton}
        />
      </Form>
      {data && data.values.length > 0 && <Chart data={data.values[0]} />}
      {data && data.values.length > 1 && <Chart data={data.values[1]} />}
    </div>
  );
}
