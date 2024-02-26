import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";

import { STRINGS } from "../../locale";
import HintText from "../generic/HintText";

export default function SettingsForm({ data, setData, submit }) {
  return (
    <Form>
      <div className="mt-3">
        <FormCheck
          checked={data.auto_charge_priority}
          id="auto_charge_priority"
          label={STRINGS.AUTO_CHARGE_PRIORITY}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              auto_charge_priority: !!e.target.checked,
            }))
          }
        />
      </div>
      <div className="mt-3">
        <FormCheck
          checked={data.auto_output_priority}
          id="auto_output_priority"
          label={STRINGS.AUTO_OUTPUT_PRIORITY}
          onChange={(e) =>
            setData((d) => ({
              ...d,
              auto_output_priority: !!e.target.checked,
            }))
          }
        />
      </div>
      <div className="d-grid mt-3">
        <Button onClick={submit} variant="light">
          {STRINGS.SAVE}
        </Button>
      </div>
      <HintText hint={STRINGS.SETTINGS_HINT} />
    </Form>
  );
}
