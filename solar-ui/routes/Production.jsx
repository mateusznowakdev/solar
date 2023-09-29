import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

export default function Production() {
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startDate = dayjs().hour(0).minute(0).second(0).millisecond(0);
    const allDates = [...Array(14).keys()].map((i) =>
      startDate.subtract(i, "days"),
    );

    const params = allDates.map((date) => ["timestamp", date.toISOString()]);

    setLoading(true);

    getBackendResponse("/api/production/?" + new URLSearchParams(params)).then(
      ({ data, error }) => {
        setData(data);
        setError(error);
        setLoading(false);
      },
    );
  }, []);

  if (loading)
    return <div className="mt-3 text-secondary">{STRINGS.LOADING}...</div>;

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return <div>{data}</div>;
}
