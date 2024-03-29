import { useEffect, useState } from "react";

import ErrorText from "../components/generic/ErrorText";
import HintText from "../components/generic/HintText";
import LoadingText from "../components/generic/LoadingText";
import SettingsAutomationForm from "../components/settings/SettingsAutomationForm";
import SettingsLocalForm from "../components/settings/SettingsLocalForm";
import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

function SettingsContainer({ data, error, loading, submit }) {
  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <>
      <SettingsAutomationForm data={data} submit={submit} />
      <SettingsLocalForm />
      <HintText hint={STRINGS.SETTINGS_HINT} />
    </>
  );
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

  function putSettings(data) {
    setLoading(true);

    getBackendResponse("/api/settings/", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    }).then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }

  function putSettingsDelayed(data) {
    setLoading(true);
    setTimeout(() => putSettings(data), 1000);
  }

  useEffect(getSettings, []);

  return (
    <>
      <h1 className="my-3">{STRINGS.MENU_SETTINGS}</h1>
      <SettingsContainer
        data={data}
        error={error}
        loading={loading}
        submit={putSettingsDelayed}
      />
    </>
  );
}
