import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import { getBackendResponse } from "../../utils";
import ErrorText from "../generic/ErrorText";
import HintText from "../generic/HintText";
import LoadingText from "../generic/LoadingText";

export default function MainSettingsForm() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getSettings() {
    setLoading(true);

    getBackendResponse("/settings/").then(({ data, error }) => {
      setData(data);
      setError(error);
      setLoading(false);
    });
  }

  function putSettings(data) {
    setLoading(true);

    getBackendResponse("/settings/", {
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

  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <Form>
      <div className="mt-3 text-secondary text-small text-uppercase">
        {STRINGS.SETTINGS_AUTOMATION}
      </div>
      <div className="mt-3">
        <Switch
          checked={data.auto_charge_priority}
          id="auto_charge_priority"
          label={STRINGS.SETTINGS_AUTO_CHARGE_PRIORITY}
          onChange={(e) =>
            putSettingsDelayed({
              auto_charge_priority: !!e.target.checked,
            })
          }
        />
      </div>
      <div className="mt-3">
        <Switch
          checked={data.auto_output_priority}
          id="auto_output_priority"
          label={STRINGS.SETTINGS_AUTO_OUTPUT_PRIORITY}
          onChange={(e) =>
            putSettingsDelayed({
              auto_output_priority: !!e.target.checked,
            })
          }
        />
      </div>
      <HintText className="mt-4" hint={STRINGS.SETTINGS_MAIN_HINT} />
    </Form>
  );
}
