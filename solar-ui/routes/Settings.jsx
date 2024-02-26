import { useEffect, useState } from "react";

import ErrorText from "../components/generic/ErrorText";
import LoadingText from "../components/generic/LoadingText";
import SettingsForm from "../components/settings/SettingsForm";
import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

function SettingsContainer({ data, error, loading, setData, submit }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return <SettingsForm data={data} setData={setData} submit={submit} />;
}

export default function Settings() {
  const [data, setData] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getSettings() {
    setLoading(true);

    getBackendResponse("/api/settings/").then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }

  function putSettings() {
    setLoading(true);

    getBackendResponse("/api/settings/", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    }).then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }

  function putSettingsDelayed() {
    setLoading(true);
    setTimeout(putSettings, 1000);
  }

  useEffect(getSettings, []);

  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_SETTINGS}</h1>
      <SettingsContainer
        data={data}
        error={error}
        loading={loading}
        setData={setData}
        submit={putSettingsDelayed}
      />
    </>
  );
}
