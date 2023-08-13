import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ChevronDown from "react-bootstrap-icons/dist/icons/chevron-down";
import ChevronUp from "react-bootstrap-icons/dist/icons/chevron-up";

export default function ChartDateTimeStepper({
  decValue,
  incValue,
  setValue,
  value,
}) {
  return (
    <InputGroup className="vertical">
      <Button onClick={incValue} variant="light">
        <ChevronUp />
      </Button>
      <Form.Control className="p-0" onChange={setValue} value={value} />
      <Button onClick={decValue} variant="light">
        <ChevronDown />
      </Button>
    </InputGroup>
  );
}
