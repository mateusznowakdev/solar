import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import Row from "react-bootstrap/Row";

import { getDatesForOffset } from "../../utils";

function ChartPresetButton({ label, offset, setStartDate, setStopDate }) {
  const [startDate, stopDate] = getDatesForOffset(offset);

  return (
    <Button
      className="w-100"
      onClick={() => {
        setStartDate(startDate);
        setStopDate(stopDate);
      }}
      variant="light"
    >
      {label}
    </Button>
  );
}

export default function ChartPresetButtonGroup({
  offsets,
  setStartDate,
  setStopDate,
  submitButton,
}) {
  return (
    <FormGroup as={Row} className="g-2 mb-2">
      <Col xs={10}>
        <ButtonGroup className="d-flex">
          {Object.entries(offsets).map(([label, offset]) => (
            <ChartPresetButton
              key={label}
              label={label}
              offset={offset}
              setStartDate={setStartDate}
              setStopDate={setStopDate}
            />
          ))}
        </ButtonGroup>
      </Col>
      <Col xs={2}>{submitButton}</Col>
    </FormGroup>
  );
}
