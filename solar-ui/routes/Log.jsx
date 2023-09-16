import { useEffect, useState } from "react";

import LogList from "../components/log/LogList";

import { STRINGS } from "../locale";
import { dateReviver, getBackendURI } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(getBackendURI() + "/api/log/")
      .then(async (response) => {
        const status = response.status;
        const text = await response.text();

        if (response.ok) return text;
        else throw new Error(`(HTTP ${status}) ${text}`);
      })
      .then((text) => {
        const json = JSON.parse(text, dateReviver);
        setData(json);
        setError(null);
      })
      .catch((error) => setError(error.toString()));
  }, []);

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return <LogList data={data} />;
}
