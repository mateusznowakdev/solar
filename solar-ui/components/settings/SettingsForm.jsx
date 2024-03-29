import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import HintText from "../generic/HintText";

export default function SettingsForm({ data, submit }) {
  return (
    <Form>
      <div className="mt-3 text-secondary">{STRINGS.SETTINGS_AUTOMATION}</div>
      <div className="mt-3">
        <Switch
          checked={data.auto_charge_priority}
          id="auto_charge_priority"
          label={STRINGS.SETTINGS_AUTO_CHARGE_PRIORITY}
          onChange={(e) =>
            submit({
              ...data,
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
            submit({
              ...data,
              auto_output_priority: !!e.target.checked,
            })
          }
        />
      </div>
      <div className="mt-3 text-secondary">{STRINGS.SETTINGS_LOCAL}</div>
      <div className="mt-3 mb-4">
        <Switch
          id="show_full_labels"
          label={STRINGS.SETTINGS_SHOW_FULL_LABELS}
        />
      </div>
      <HintText hint={STRINGS.SETTINGS_HINT} />
    </Form>
  );
}
