import { useEffect, useState } from "react";

import LogList from "../components/log/LogList";

import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    getBackendResponse("/api/log/").then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <div className="mt-3 text-secondary">{STRINGS.LOADING}...</div>;

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return <LogList data={data} />;
}
