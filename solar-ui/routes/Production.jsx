import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import ErrorText from "../components/generic/ErrorText";
import LoadingText from "../components/generic/LoadingText";
import ProductionList from "../components/production/ProductionList";
import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

function getLastDays() {
  const startDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
  return [...Array(14).keys()].map((i) => startDate.subtract(i, "days"));
}

function getLastMonths() {
  const startDate = dayjs().date(1).hour(0).minute(0).second(0).millisecond(0);
  return [...Array(12).keys()].map((i) => startDate.subtract(i, "months"));
}

function ProductionContainer({ data, error, loading, mode }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return <ProductionList data={data} mode={mode} />;
}

export default function Production() {
  const [mode, setMode] = useState("days");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getProduction() {
    let timestamps;

    switch (mode) {
      case "days":
        timestamps = getLastDays();
        break;
      case "months":
        timestamps = getLastMonths();
        break;
      default:
        return;
    }

    setLoading(true);

    const params = timestamps.map((date) => ["timestamp", date.toISOString()]);
    getBackendResponse("/api/production/?" + new URLSearchParams(params)).then(
      ({ data, error }) => {
        setData(data);
        setError(error);
        setLoading(false);
      },
    );
  }

  useEffect(getProduction, [mode]);

  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_PRODUCTION}</h1>
      <Form className="my-3">
        <Form.Group as={Row} className="mb-2">
          <Col>
            <Form.Select onChange={(e) => setMode(e.target.value)} value={mode}>
              <option value="days">{STRINGS.PRODUCTION_DAYS}</option>
              <option value="months">{STRINGS.PRODUCTION_MONTHS}</option>
            </Form.Select>
          </Col>
        </Form.Group>
      </Form>
      <ProductionContainer
        data={data}
        error={error}
        loading={loading}
        mode={mode}
      />
    </>
  );
}
