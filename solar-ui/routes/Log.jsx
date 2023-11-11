import { useEffect, useState } from "react";

import RefreshIcon from "../components/RefreshIcon";
import LogList from "../components/log/LogList";
import { STRINGS } from "../locale";
import { getBackendResponse, renderDate } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function getLogs() {
    setLoading(true);

    getBackendResponse("/api/log/").then(({ data, error }) => {
      if (data) {
        const items = Object.groupBy(data, (f) => renderDate(f.timestamp));
        setData(items);
      }

      setError(error);
      setLoading(false);
    });
  }

  useEffect(getLogs, []);

  if (loading)
    return <div className="mt-3 text-secondary">{STRINGS.LOADING}...</div>;

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return (
    <>
      <LogList data={data} />
      <RefreshIcon />
    </>
  );
}
