import Col from "react-bootstrap/Col";
import FormGroup from "react-bootstrap/FormGroup";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";

import { PARAMETER_METADATA } from "../../meta";

function shouldHaveChart(key) {
  return (PARAMETER_METADATA[key] || {}).chart;
}

function sortByDescription(a, b) {
  return a.description.localeCompare(b.description);
}

export default function ChartSeriesPicker({ setValue, value }) {
  const choices = Object.entries(PARAMETER_METADATA)
    .filter(([key]) => shouldHaveChart(key))
    .map(([key, meta]) => {
      let description = meta.description;
      let unit = meta.unit;
      if (unit) description += ` (${unit})`;

      return { description, key };
    })
    .sort(sortByDescription);

  return (
    <FormGroup as={Row} className="mb-2">
      <Col>
        <FormSelect onChange={(e) => setValue(e.target.value)} value={value}>
          <option value="">---</option>
          {choices.map((item) => (
            <option key={item.key} value={item.key}>
              {item.description}
            </option>
          ))}
        </FormSelect>
      </Col>
    </FormGroup>
  );
}
