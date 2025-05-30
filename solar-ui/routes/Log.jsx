import { useEffect, useState } from "react";

import ErrorText from "../components/generic/ErrorText";
import HintText from "../components/generic/HintText";
import LoadingText from "../components/generic/LoadingText";
import LogFilters from "../components/log/LogFilters";
import LogList from "../components/log/LogList";
import { STRINGS } from "../locale";
import { STORAGE_KEYS, getStorage, setStorage } from "../storage";
import { getBackendResponse, renderDate, toggleItem } from "../utils";

function LogContainer({ filters, data, error, loading }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  if (filters.length === 0) return <HintText hint={STRINGS.LOG_HINT} />;

  return <LogList data={data} />;
}

export default function Log() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(getStorage(STORAGE_KEYS.FILTERS));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getLogs() {
    if (filters.length === 0) {
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const params = filters.map((f) => ["category", f]);
    getBackendResponse("/api/log/?" + new URLSearchParams(params)).then(({ data, error }) => {
      if (data) {
        const items = Object.groupBy(data, (f) => renderDate(f.timestamp));
        setData(items);
      }

      setError(error);
      setLoading(false);
    });
  }

  function toggleFilter(filter) {
    const filtersCopy = [...filters];
    toggleItem(filtersCopy, filter);

    setFilters(filtersCopy);
    setStorage(STORAGE_KEYS.FILTERS, filtersCopy);
  }

  useEffect(getLogs, [filters]);

  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_LOG}</h1>
      <LogFilters filters={filters} toggleFilter={toggleFilter} />
      <LogContainer filters={filters} data={data} error={error} loading={loading} />
    </>
  );
}
