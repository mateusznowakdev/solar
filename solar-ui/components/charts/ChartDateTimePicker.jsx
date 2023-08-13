import dayjs from "dayjs";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import ChevronDown from "react-bootstrap-icons/dist/icons/chevron-down";
import ChevronUp from "react-bootstrap-icons/dist/icons/chevron-up";

export default function ChartDateTimePicker({ date, setDate }) {
  return (
    <Form.Group as={Row} className="g-1 mb-2">
      <Col xs={6}>
        <InputGroup className="vertical">
          <Button
            onClick={() => setDate(dayjs(date).add(1, "day"))}
            variant="light"
          >
            <ChevronUp />
          </Button>
          <Form.Control
            className="p-0"
            onChange={() => {}}
            value={new Intl.DateTimeFormat(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              weekday: "short",
            }).format(date)}
          />
          <Button
            onClick={() => setDate(dayjs(date).subtract(1, "day"))}
            variant="light"
          >
            <ChevronDown />
          </Button>
        </InputGroup>
      </Col>
      <Col xs={2}>
        <InputGroup className="vertical">
          <Button
            onClick={() => setDate(dayjs(date).add(1, "hour"))}
            variant="light"
          >
            <ChevronUp />
          </Button>
          <Form.Control
            className="p-0"
            onChange={(e) => setDate(dayjs(date).hour(e.target.value))}
            type="number"
            value={new Intl.DateTimeFormat(undefined, {
              hour: "2-digit",
            }).format(date)}
          />
          <Button
            onClick={() => setDate(dayjs(date).subtract(1, "hour"))}
            variant="light"
          >
            <ChevronDown />
          </Button>
        </InputGroup>
      </Col>
      <Col xs={2}>
        <InputGroup className="vertical">
          <Button
            onClick={() => setDate(dayjs(date).add(1, "minute"))}
            variant="light"
          >
            <ChevronUp />
          </Button>
          <Form.Control
            className="p-0"
            onChange={(e) => setDate(dayjs(date).minute(e.target.value))}
            type="number"
            value={new Intl.DateTimeFormat(undefined, {
              minute: "2-digit",
            }).format(date)}
          />
          <Button
            onClick={() => setDate(dayjs(date).subtract(1, "minute"))}
            variant="light"
          >
            <ChevronDown />
          </Button>
        </InputGroup>
      </Col>
      <Col xs={2}>
        <InputGroup className="vertical">
          <Button
            onClick={() => setDate(dayjs(date).add(1, "second"))}
            variant="light"
          >
            <ChevronUp />
          </Button>
          <Form.Control
            className="p-0"
            onChange={(e) => setDate(dayjs(date).second(e.target.value))}
            type="number"
            value={new Intl.DateTimeFormat(undefined, {
              second: "2-digit",
            }).format(date)}
          />
          <Button
            onClick={() => setDate(dayjs(date).subtract(1, "second"))}
            variant="light"
          >
            <ChevronDown />
          </Button>
        </InputGroup>
      </Col>
    </Form.Group>
  );
}
