import Check from "lucide-react/dist/esm/icons/check";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import { CHARGE_PRIORITY, OUTPUT_PRIORITY } from "../../meta";
import { getBackendResponse } from "../../utils";
import ErrorText from "../generic/ErrorText";
import LoadingText from "../generic/LoadingText";

export default function DeviceSettingsForm() {
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

  function patchSettings(data) {
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

  function patchSettingsDelayed(data) {
    setLoading(true);
    setTimeout(() => patchSettings(data), 100);
  }

  function patchChargePriority(value) {
    patchSettingsDelayed({ charge_priority: value });
  }

  function patchOutputPriority(value) {
    patchSettingsDelayed({ output_priority: value });
  }

  function patchAutoChargePriority(value) {
    patchSettingsDelayed({ auto_charge_priority: value });
  }

  function patchAutoOutputPriority(value) {
    patchSettingsDelayed({ auto_output_priority: value });
  }

  useEffect(getSettings, []);

  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <Form>
      <div className="mt-3 mb-4">
        <Switch
          checked={data.auto_charge_priority}
          id="auto_charge_priority"
          label={STRINGS.SETTINGS_CHARGE_PRIORITY}
          onChange={(e) => patchAutoChargePriority(!!e.target.checked)}
        />
        {!data.auto_charge_priority && (
          <ListGroup className="mt-3">
            {Object.entries(CHARGE_PRIORITY).map(([value, label]) => (
              <ListGroupItem
                className="d-flex justify-content-between p-2"
                key={value}
                onClick={() => patchChargePriority(+value)}
              >
                {label}
                {data.charge_priority === +value && <Check strokeWidth={1.25} />}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
      <div className="mb-4">
        <Switch
          checked={data.auto_output_priority}
          id="auto_output_priority"
          label={STRINGS.SETTINGS_OUTPUT_PRIORITY}
          onChange={(e) => patchAutoOutputPriority(!!e.target.checked)}
        />
        {!data.auto_output_priority && (
          <ListGroup className="mt-3">
            {Object.entries(OUTPUT_PRIORITY).map(([value, label]) => (
              <ListGroupItem
                className="d-flex justify-content-between p-2"
                key={value}
                onClick={() => patchOutputPriority(+value)}
              >
                {label}
                {data.output_priority === +value && <Check strokeWidth={1.25} />}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
    </Form>
  );
}
