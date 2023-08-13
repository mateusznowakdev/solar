import { useEffect, useState } from "react";

import LogList from "../components/log/LogList";

import { dateReviver, getBackendURI } from "../utils";

export default function Log() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(getBackendURI() + "/api/log/")
      .then((response) => (response.ok ? response.text() : "[]"))
      .then((text) => {
        const json = JSON.parse(text, dateReviver);
        setData(json);
      });
  }, []);

  return <LogList data={data} />;
}
