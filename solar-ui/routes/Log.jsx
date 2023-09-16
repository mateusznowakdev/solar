import { useEffect, useState } from "react";

import LogList from "../components/log/LogList";

import { STRINGS } from "../locale";
import { dateReviver, getBackendURI } from "../utils";

export default function Log() {
  const [progress, setProgress] = useState({ loading: true });
  const [data, setData] = useState([]);

  useEffect(() => {
    setProgress({ loading: true });

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
        setProgress({ loading: false, error: null });
      })
      .catch((error) =>
        setProgress({ loading: false, error: error.toString() }),
      );
  }, []);

  if (progress.loading)
    return <div className="mt-3 text-warning">{STRINGS.LOADING}...</div>;

  if (progress.error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {progress.error}
      </div>
    );

  return <LogList data={data} />;
}
