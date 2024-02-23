import { useEffect, useState } from "react";

import RefreshIcon from "../components/RefreshIcon";
import LogList from "../components/log/LogList";
import { STRINGS } from "../locale";
import { getBackendResponse, renderDate, toggleItem } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(
    JSON.parse(localStorage.getItem("filters") || "[]"),
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function getLogs() {
    setLoading(true);

    const params = filters.map((f) => ["category", f]);
    getBackendResponse("/api/log/?" + new URLSearchParams(params)).then(
      ({ data, error }) => {
        if (data) {
          const items = Object.groupBy(data, (f) => renderDate(f.timestamp));
          setData(items);
        }

        setError(error);
        setLoading(false);
      },
    );
  }

  function toggleFilter(filter) {
    const filtersCopy = [...filters];
    toggleItem(filtersCopy, filter);

    setFilters(filtersCopy);
    localStorage.setItem("filters", JSON.stringify(filtersCopy));
  }

  useEffect(getLogs, [filters]);

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
      <h1 className="my-3">{STRINGS.MENU_LOG}</h1>
      <LogList data={data} filters={filters} toggleFilters={toggleFilter} />
      <RefreshIcon />
    </>
  );
}
