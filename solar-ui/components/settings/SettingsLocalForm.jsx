import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import { STORAGE_FULL_NAMES } from "../../storage";

export default function SettingsLocalForm({ data, submit }) {
  return (
    <Form>
      <div className="mt-3 text-secondary">{STRINGS.SETTINGS_LOCAL}</div>
      <div className="mt-3">
        <Switch
          checked={data.fullNames}
          id="show_full_labels"
          label={STRINGS.SETTINGS_SHOW_FULL_NAMES}
          onChange={(e) => {
            submit({
              [STORAGE_FULL_NAMES]: !!e.target.checked,
            });
          }}
        />
      </div>
    </Form>
  );
}
