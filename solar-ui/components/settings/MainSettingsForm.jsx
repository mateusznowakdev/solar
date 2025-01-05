import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import { CHARGE_PRIORITY, OUTPUT_PRIORITY, PARAMETER_METADATA } from "../../meta";
import { getBackendResponse } from "../../utils";
import ErrorText from "../generic/ErrorText";
import HintText from "../generic/HintText";
import LoadingText from "../generic/LoadingText";
import Separator from "../generic/Separator";

export default function MainSettingsForm() {
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

  if (loading) return <LoadingText />;
  if (error) return <ErrorText error={error} />;

  return (
    <Form>
      <Separator text={PARAMETER_METADATA.charge_priority.description} />
      <div className="mb-4">
        <div>
          <Switch
            checked={data.auto_charge_priority}
            id="auto_charge_priority"
            label={STRINGS.SETTINGS_AUTOMATIC}
            onChange={(e) =>
              putSettingsDelayed({
                auto_charge_priority: !!e.target.checked,
              })
            }
          />
        </div>
        {!data.auto_charge_priority && (
          <ListGroup className="mt-3">
            {Object.entries(CHARGE_PRIORITY).map(([value, label]) => (
              <ListGroupItem className="p-2" key={value}>
                {label}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
      <Separator text={PARAMETER_METADATA.output_priority.description} />
      <div className="mb-4">
        <div>
          <Switch
            checked={data.auto_output_priority}
            id="auto_output_priority"
            label={STRINGS.SETTINGS_AUTOMATIC}
            onChange={(e) =>
              putSettingsDelayed({
                auto_output_priority: !!e.target.checked,
              })
            }
          />
        </div>
        {!data.auto_output_priority && (
          <ListGroup className="mt-3">
            {Object.entries(OUTPUT_PRIORITY).map(([value, label]) => (
              <ListGroupItem className="p-2" key={value}>
                {label}
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
      <HintText hint={STRINGS.SETTINGS_AUTOMATION_HINT} />
    </Form>
  );
}
