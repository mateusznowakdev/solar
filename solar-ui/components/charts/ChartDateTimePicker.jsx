import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function ChartDateTimePicker({ setValue, value }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (date && time) {
      setValue(dayjs(date + time, "YYYY-MM-DDHH:mm"));
    } else {
      setValue(null);
    }
  }, [date, time]);

  useEffect(() => {
    if (value) {
      setDate(dayjs(value).format("YYYY-MM-DD"));
      setTime(dayjs(value).format("HH:mm"));
    }
  }, [value]);

  return (
    <Form.Group as={Row} className="g-2 mb-2">
      <Col xs={7}>
        <Form.Control
          onChange={(e) => setDate(e.target.value)}
          required
          type="date"
          value={date}
        />
      </Col>
      <Col xs={5}>
        <Form.Control
          onChange={(e) => setTime(e.target.value)}
          required
          type="time"
          value={time}
        />
      </Col>
    </Form.Group>
  );
}
