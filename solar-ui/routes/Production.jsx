import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import ProductionList from "../components/production/ProductionList";

import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

function ProductionContainer({ data, error, loading }) {
  if (loading)
    return <div className="mt-3 text-secondary">{STRINGS.LOADING}...</div>;

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return <ProductionList data={data} />;
}

export default function Production() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
    const allDates = [...Array(14).keys()].map((i) =>
      startDate.subtract(i, "days"),
    );

    const params = allDates.map((date) => ["timestamp", date.toISOString()]);

    setLoading(true);

    getBackendResponse("/api/production/?" + new URLSearchParams(params)).then(
      ({ data, error }) => {
        setData(data);
        setError(error);
        setLoading(false);
      },
    );
  }, []);

  return (
    <div>
      <Form className="my-3">
        <Form.Group as={Row} className="mb-2">
          <Col>
            <Form.Select>
              <option value="days">{STRINGS.PRODUCTION_DAYS}</option>
              <option value="months">{STRINGS.PRODUCTION_MONTHS}</option>
            </Form.Select>
          </Col>
        </Form.Group>
      </Form>
      <ProductionContainer data={data} error={error} loading={loading} />
    </div>
  );
}
