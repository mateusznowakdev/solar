import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function ChartPresetButtons({
  offsets,
  setStartDate,
  setStopDate,
  submitButton,
}) {
  return (
    <Form.Group as={Row} className="g-2 mb-2">
      <Col xs={10}>
        <ButtonGroup className="d-flex">
          {Object.entries(offsets).map(([label, offset]) => (
            <Button
              className="w-100"
              key={label}
              onClick={() => {
                setStartDate(dayjs().subtract(offset, "seconds"));
                setStopDate(dayjs());
              }}
              variant="light"
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </Col>
      <Col xs={2}>{submitButton}</Col>
    </Form.Group>
  );
}
