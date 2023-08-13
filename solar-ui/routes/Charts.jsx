import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";

import Chart from "../components/charts/Chart";
import ChartDateTimePicker from "../components/charts/ChartDateTimePicker";
import ChartPresetButtons from "../components/charts/ChartPresetButtons";
import ChartSeriesPicker from "../components/charts/ChartSeriesPicker";

import { getBackendURI } from "../utils";

const OFFSETS = {
  "1m": 60,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "8h": 60 * 60 * 8,
  "24h": 60 * 60 * 24,
};

export default function Charts() {
  const location = useLocation();

  const [data, setData] = useState(null);

  const [seriesA, setSeriesA] = useState(location.state?.choice || "");
  const [seriesB, setSeriesB] = useState("");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(OFFSETS["15m"], "seconds"),
  );
  const [stopDate, setStopDate] = useState(dayjs());

  function getSeries() {
    const params = [
      ["date_from", startDate.toISOString()],
      ["date_to", stopDate.toISOString()],
    ];

    if (!seriesA && !seriesB) return;
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
        setStartDate(dateFrom);
        setStopDate(dateTo);
        setData({ dateFrom, dateTo, fields, values });
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
        <ChartPresetButtons
          offsets={OFFSETS}
          setStartDate={setStartDate}
          setStopDate={setStopDate}
          submitButton={submitButton}
        />
      </Form>
      {data && <Chart column={0} data={data} />}
      {data && data.fields.length > 1 && <Chart column={1} data={data} />}
    </div>
  );
}
