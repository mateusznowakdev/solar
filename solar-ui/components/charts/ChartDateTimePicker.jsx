import dayjs from "dayjs";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import ChartDateTimeStepper from "./ChartDateTimeStepper";

export default function ChartDateTimePicker({ setValue, value }) {
  return (
    <Form.Group as={Row} className="g-1 mb-2">
      <Col xs={6}>
        <ChartDateTimeStepper
          decValue={() => setValue(dayjs(value).subtract(1, "day"))}
          incValue={() => setValue(dayjs(value).add(1, "day"))}
          setValue={() => {}}
          value={new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            weekday: "short",
          }).format(value)}
        />
      </Col>
      <Col xs={2}>
        <ChartDateTimeStepper
          decValue={() => setValue(dayjs(value).subtract(1, "hour"))}
          incValue={() => setValue(dayjs(value).add(1, "hour"))}
          setValue={(h) => setValue(dayjs(value).hour(h))}
          value={new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
          }).format(value)}
        />
      </Col>
      <Col xs={2}>
        <ChartDateTimeStepper
          decValue={() => setValue(dayjs(value).subtract(1, "minute"))}
          incValue={() => setValue(dayjs(value).add(1, "minute"))}
          setValue={(m) => setValue(dayjs(value).minute(m))}
          value={new Intl.DateTimeFormat(undefined, {
            minute: "2-digit",
          }).format(value)}
        />
      </Col>
      <Col xs={2}>
        <ChartDateTimeStepper
          decValue={() => setValue(dayjs(value).subtract(1, "second"))}
          incValue={() => setValue(dayjs(value).add(1, "second"))}
          setValue={(s) => setValue(dayjs(value).second(s))}
          value={new Intl.DateTimeFormat(undefined, {
            second: "2-digit",
          }).format(value)}
        />
      </Col>
    </Form.Group>
  );
}
