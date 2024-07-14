import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionItem from "react-bootstrap/AccordionItem";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useLocation } from "react-router-dom";

import Chart from "../components/charts/Chart";
import ChartDateTimePicker from "../components/charts/ChartDateTimePicker";
import ChartPresetButtonGroup from "../components/charts/ChartPresetButtonGroup";
import ChartSeriesPicker from "../components/charts/ChartSeriesPicker";
import ErrorText from "../components/generic/ErrorText";
import HintText from "../components/generic/HintText";
import LoadingText from "../components/generic/LoadingText";
import { STRINGS } from "../locale";
import { getBackendResponse, getDatesForOffset, renderDateTime } from "../utils";

const OFFSETS = {
  "10m": 60 * 10,
  "30m": 60 * 30,
  "1h": 60 * 60,
  "8h": 60 * 60 * 8,
  "24h": 60 * 60 * 24,
};

function ChartContainer({ data, error, loading, updateRange }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  if (!data) return <HintText hint={STRINGS.CHARTS_HINT} />;

  return (
    <>
      {data && data.values.length > 0 && (
        <Chart data={data.values[0]} updateRange={updateRange} />
      )}
      {data && data.values.length > 1 && (
        <Chart data={data.values[1]} updateRange={updateRange} />
      )}
    </>
  );
}

export default function Charts() {
  const [initialStartDate, initialStopDate] = getDatesForOffset(OFFSETS["10m"]);

  const location = useLocation();

  const [accordionKeys, setAccordionKeys] = useState([]);

  const [seriesA, setSeriesA] = useState(location.state?.choice || "");
  const [seriesB, setSeriesB] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [stopDate, setStopDate] = useState(initialStopDate);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false); // left false on purpose
  const [error, setError] = useState(null);

  function getSeries(dateFrom, dateTo) {
    if (!dateFrom || !dateTo) {
      dateFrom = startDate;
      dateTo = stopDate;
    }

    const params = [
      ["date_from", dateFrom.toISO()],
      ["date_to", dateTo.toISO()],
    ];

    if (!seriesA && !seriesB) return;
    if (seriesA) params.push(["field", seriesA]);
    if (seriesB) params.push(["field", seriesB]);

    setLoading(true);

    getBackendResponse("/api/series/?" + new URLSearchParams(params)).then(
      ({ data, error }) => {
        setData(data);
        setError(error);

        if (data) {
          setSeriesA(data?.values[0]?.field || "");
          setSeriesB(data?.values[1]?.field || "");
          setStartDate(data.date_from);
          setStopDate(data.date_to);
        }

        setLoading(false);
        setAccordionKeys([]);
      },
    );
  }

  function updateRange(min, max) {
    const start = DateTime.fromMillis(Math.floor(min));
    const stop = DateTime.fromMillis(Math.ceil(max));
    getSeries(start, stop);
  }

  useEffect(getSeries, []);

  const submitButton = (
    <Button
      className="w-100"
      disabled={loading || !startDate || !stopDate || (!seriesA && !seriesB)}
      onClick={getSeries}
      variant="light"
    >
      OK
    </Button>
  );

  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_CHARTS}</h1>
      <Accordion activeKey={accordionKeys}>
        <AccordionItem eventKey="0">
          <AccordionHeader
            onClick={() => setAccordionKeys(accordionKeys.length > 0 ? [] : ["0"])}
          >
            {renderDateTime(startDate)} &mdash;
            <br /> {renderDateTime(stopDate)}
          </AccordionHeader>
          <AccordionBody>
            <Form>
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
          </AccordionBody>
        </AccordionItem>
      </Accordion>
      <ChartContainer
        data={data}
        error={error}
        loading={loading}
        updateRange={updateRange}
      />
    </>
  );
}
