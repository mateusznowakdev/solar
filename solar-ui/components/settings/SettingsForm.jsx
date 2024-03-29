import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import HintText from "../generic/HintText";

export default function SettingsForm({ data, submit }) {
  return (
    <Form>
      <div className="mt-3">
        <Switch
          checked={data.auto_charge_priority}
          id="auto_charge_priority"
          label={STRINGS.AUTO_CHARGE_PRIORITY}
          onChange={(e) =>
            submit({
              ...data,
              auto_charge_priority: !!e.target.checked,
            })
          }
        />
      </div>
      <div className="mt-3 mb-4">
        <Switch
          checked={data.auto_output_priority}
          id="auto_output_priority"
          label={STRINGS.AUTO_OUTPUT_PRIORITY}
          onChange={(e) =>
            submit({
              ...data,
              auto_output_priority: !!e.target.checked,
            })
          }
        />
      </div>
      <HintText hint={STRINGS.SETTINGS_HINT} />
    </Form>
  );
}
