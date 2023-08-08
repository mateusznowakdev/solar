import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";

import { METADATA } from "../meta";
import { renderDateTime } from "../render";
import { getBackendURI } from "../utils";

export default function Log() {
  const [state, setState] = useState([]);

  useEffect(() => {
    fetch(getBackendURI() + "/api/log/")
      .then((response) => (response.ok ? response.json() : []))
      .then((json) => setState(json));
  }, []);

  return (
    <ListGroup variant="flush">
      {state.map((entry) => (
        <ListGroup.Item key={entry.timestamp}>
          <div className="pt-2 px-3">
            {METADATA[entry.field_name].description}
            {": "}
            {METADATA[entry.field_name].render(entry.new_value)}
          </div>
          <div className="pb-2 px-3 text-small">
            {renderDateTime(new Date(entry.timestamp))}
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
