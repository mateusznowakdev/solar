import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";

import { METADATA } from "../meta";
import { renderDateTime } from "../render";
import { getBackendURI } from "../utils";

export default function Log() {
  const [state, setState] = useState([]);

  useEffect(() => {
    fetch(getBackendURI() + "/api/log/")
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => setState(json));
  }, []);

  return (
    <div className="m-3">
      {state.map((entry) => (
        <Card className="mt-1 mb-2" key={entry.timestamp}>
          <Card.Body>
            <Card.Title as="h6">
              {renderDateTime(new Date(entry.timestamp))}
            </Card.Title>
            <Card.Text>
              {METADATA[entry.field_name].description}
              <br />
              {METADATA[entry.field_name].render(entry.old_value)} &rarr;{" "}
              {METADATA[entry.field_name].render(entry.new_value)}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
