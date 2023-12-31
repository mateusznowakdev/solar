import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";

import { STRINGS } from "../locale";
import { getBackendResponse } from "../utils";

export default function Settings() {
  const [data, setData] = useState({});

  const [loading, setLoading] = useState(false);
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

  if (loading)
    return <div className="mt-3 text-secondary">{STRINGS.LOADING}...</div>;

  if (error)
    return (
      <div className="mt-3 text-danger">
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </div>
    );

  return (
    <Form>
      <div className="mt-3">
        <FormCheck
          checked={data.auto_charge_priority}
          id="auto_charge_priority"
          label={STRINGS.AUTO_CHARGE_PRIORITY}
          onChange={(e) =>
            setData((d) => ({ ...d, auto_charge_priority: !!e.target.checked }))
          }
        />
      </div>
      <div className="mt-3">
        <FormCheck
          checked={data.auto_output_priority}
          id="auto_output_priority"
          label={STRINGS.AUTO_OUTPUT_PRIORITY}
          onChange={(e) =>
            setData((d) => ({ ...d, auto_output_priority: !!e.target.checked }))
          }
        />
      </div>
      <div className="d-grid mt-3">
        <Button onClick={putSettingsDelayed} variant="light">
          {STRINGS.SAVE}
        </Button>
      </div>
      <div className="mt-3 text-secondary text-small">
        {STRINGS.SETTINGS_HINT}
      </div>
    </Form>
  );
}
