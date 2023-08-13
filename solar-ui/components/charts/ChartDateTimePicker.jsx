import dayjs from "dayjs";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import ChartDateTimeStepper from "./ChartDateTimeStepper";

export default function ChartDateTimePicker({ date, setDate }) {
  return (
    <Form.Group as={Row} className="g-1 mb-2">
      <Col xs={6}>
        <ChartDateTimeStepper
          decValue={() => setDate(dayjs(date).subtract(1, "day"))}
          incValue={() => setDate(dayjs(date).add(1, "day"))}
          setValue={() => {}}
          value={new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short",
          }).format(date)}
        />
      </Col>
      <Col xs={2}>
        <ChartDateTimeStepper
          decValue={() => setDate(dayjs(date).subtract(1, "hour"))}
          incValue={() => setDate(dayjs(date).add(1, "hour"))}
          setValue={() => setDate(dayjs(date).hour(e.target.value))}
          value={new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
          }).format(date)}
        />
      </Col>
      <Col xs={2}>
        <ChartDateTimeStepper
          decValue={() => setDate(dayjs(date).subtract(1, "minute"))}
          incValue={() => setDate(dayjs(date).add(1, "minute"))}
          setValue={() => setDate(dayjs(date).minute(e.target.value))}
          value={new Intl.DateTimeFormat(undefined, {
            minute: "2-digit",
          }).format(date)}
        />
      </Col>
      <Col xs={2}>
        <ChartDateTimeStepper
          decValue={() => setDate(dayjs(date).subtract(1, "second"))}
          incValue={() => setDate(dayjs(date).add(1, "second"))}
          setValue={() => setDate(dayjs(date).second(e.target.value))}
          value={new Intl.DateTimeFormat(undefined, {
            second: "2-digit",
          }).format(date)}
        />
      </Col>
    </Form.Group>
  );
}
