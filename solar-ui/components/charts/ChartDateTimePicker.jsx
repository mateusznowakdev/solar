import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import X from "lucide-react/dist/esm/icons/x";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

export default function ChartDateTimePicker({ setValue, value }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (date && time) {
      setValue(DateTime.fromFormat(date + time, "yyyy-MM-ddHH:mm"));
    } else {
      setValue(null);
    }
  }, [date, time]);

  useEffect(() => {
    if (value) {
      setDate(value.toFormat("yyyy-MM-dd"));
      setTime(value.toFormat("HH:mm"));
    }
  }, [value]);

  function addDay() {
    setDate(DateTime.fromFormat(date, "yyyy-MM-dd").plus({ days: 1 }).toFormat("yyyy-MM-dd"));
  }

  function subDay() {
    setDate(DateTime.fromFormat(date, "yyyy-MM-dd").minus({ days: 1 }).toFormat("yyyy-MM-dd"));
  }

  return (
    <FormGroup as={Row} className="g-2 mb-2">
      <InputGroup>
        <Button onClick={subDay} variant="light">
          <ChevronLeft strokeWidth={1.25} />
        </Button>
        <FormControl
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ flex: 3 }}
          type="date"
          value={date}
        />
        <Button onClick={addDay} variant="light">
          <ChevronRight strokeWidth={1.25} />
        </Button>
        <FormControl
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
    </FormGroup>
  );
}
