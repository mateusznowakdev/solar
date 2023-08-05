import { useEffect, useState } from "react";
import { getBackendURI } from "../utils";
import { renderDateTime } from "../render";

export default function Log() {
  const [state, setState] = useState([]);

  useEffect(() => {
    fetch(getBackendURI() + "/api/log/")
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => setState(json));
  }, []);

  return (
    <div>
      <ul>
        {state.map((entry) => (
          <li key={entry.timestamp}>
            timestamp={renderDateTime(entry.timestamp)} field_name=
            {entry.field_name} old_value={entry.old_value} new_value=
            {entry.new_value}
          </li>
        ))}
      </ul>
    </div>
  );
}
