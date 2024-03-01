import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";

import ErrorText from "../components/generic/ErrorText";
import LoadingText from "../components/generic/LoadingText";
import ProductionList from "../components/production/ProductionList";
import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

function ProductionContainer({ data, error, loading, mode }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return <ProductionList data={data} mode={mode} />;
}

export default function Production() {
  const [mode, setMode] = useState("daily");
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getProduction() {
    setLoading(true);

    getBackendResponse(`/api/production/${mode}/`).then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }

  useEffect(getProduction, [mode]);

  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_PRODUCTION}</h1>
      <Form className="my-3">
        <FormGroup as={Row} className="mb-2">
          <Col>
            <FormSelect onChange={(e) => setMode(e.target.value)} value={mode}>
              <option value="daily">{STRINGS.PRODUCTION_DAYS}</option>
              <option value="monthly">{STRINGS.PRODUCTION_MONTHS}</option>
            </FormSelect>
          </Col>
        </FormGroup>
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
