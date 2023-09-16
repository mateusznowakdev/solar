import { useEffect, useState } from "react";

import LogList from "../components/log/LogList";

import { STRINGS } from "../locale";
import { dateReviver, getBackendURI } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const result = fetch(getBackendURI() + "/api/log/")
      .then(async (response) => {
        const status = response.status;
        const text = await response.text();

        if (response.ok) return text;
        else throw new Error(`(HTTP ${status}) ${text}`);
      })
      .then((text) => ({
        data: JSON.parse(text, dateReviver),
        error: null,
      }))
      .catch((error) => ({
        data: null,
        error: error.toString(),
      }));

    result.then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <div className="mt-3 text-warning">{STRINGS.LOADING}...</div>;

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return <LogList data={data} />;
}
