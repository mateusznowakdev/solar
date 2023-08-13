import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { METADATA } from "../../meta";

function shouldHaveChart(key) {
  return (METADATA[key] || {}).chart;
}

function sort(a, b) {
  return a.description.localeCompare(b.description);
}

export default function ChartSeriesPicker({ setValue, value }) {
  const choices = Object.entries(METADATA)
    .filter(([key]) => shouldHaveChart(key))
    .map(([key, meta]) => {
      let description = meta.description;
      if (meta.unit) description += ` (${meta.unit})`;

      return { description, key };
    })
    .sort(sort);

  return (
    <Form.Group as={Row} className="mb-2">
      <Col>
        <Form.Select onChange={(e) => setValue(e.target.value)} value={value}>
          <option value="">---</option>
          {choices.map((item) => (
            <option key={item.key} value={item.key}>
              {item.description}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Form.Group>
  );
}
