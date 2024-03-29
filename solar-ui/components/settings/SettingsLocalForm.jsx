import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";

export default function SettingsLocalForm() {
  return (
    <Form>
      <div className="mt-3 text-secondary">{STRINGS.SETTINGS_LOCAL}</div>
      <div className="mt-3">
        <Switch
          id="show_full_labels"
          label={STRINGS.SETTINGS_SHOW_FULL_NAMES}
        />
      </div>
    </Form>
  );
}
