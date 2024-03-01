import dayjs from "dayjs";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import X from "lucide-react/dist/esm/icons/x";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

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

  function addDay() {
    setDate(dayjs(date).add(1, "day").format("YYYY-MM-DD"));
  }

  function subDay() {
    setDate(dayjs(date).subtract(1, "day").format("YYYY-MM-DD"));
  }

  return (
    <InputGroup className="mb-2">
      <Button onClick={subDay} variant="light">
        <ChevronLeft strokeWidth={1.25} />
      </Button>
      <Form.Control
        onChange={(e) => setDate(e.target.value)}
        required
        style={{ flex: 3 }}
        type="date"
        value={date}
      />
      <Button onClick={addDay} variant="light">
        <ChevronRight strokeWidth={1.25} />
      </Button>
      <Form.Control
        onChange={(e) => setTime(e.target.value)}
        required
        style={{ flex: 2 }}
        type="time"
        value={time}
      />
      <Button onClick={() => setTime("00:00")} variant="light">
        <X strokeWidth={1.25} />
      </Button>
    </InputGroup>
  );
}
