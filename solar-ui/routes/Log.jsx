import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";

import { METADATA } from "../meta";
import { renderDateTime } from "../render";
import { getBackendURI } from "../utils";

function LogItem({ data }) {
  return (
    <ListGroup.Item key={data.timestamp}>
      <div className="pt-2">
        {METADATA[data.field_name].description}
        {": "}
        {METADATA[data.field_name].render(data.new_value)}
      </div>
      <div className="pb-2 text-small">
        {renderDateTime(new Date(data.timestamp))}
      </div>
    </ListGroup.Item>
  );
}

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
        <LogItem data={entry} key={entry.timestamp} />
      ))}
    </ListGroup>
  );
}
