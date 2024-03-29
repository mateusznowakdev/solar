import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";

export default function SettingsAutomationForm({ data, submit }) {
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
              auto_output_priority: !!e.target.checked,
            })
          }
        />
      </div>
    </Form>
  );
}
