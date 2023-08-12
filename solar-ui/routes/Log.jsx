import { useEffect, useState } from "react";

import LogList from "../components/log/LogList";

import { getBackendURI } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(getBackendURI() + "/api/log/")
      .then((response) => (response.ok ? response.json() : []))
      .then((json) => setData(json));
  }, []);

  return <LogList data={data} />;
}
