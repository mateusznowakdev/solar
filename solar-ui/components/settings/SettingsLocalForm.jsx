import { useState } from "react";
import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import { STORAGE_FULL_NAMES, getStorage, setStorage } from "../../storage";

export default function SettingsLocalForm() {
  const [data, setData] = useState({
    fullNames: getStorage(STORAGE_FULL_NAMES),
  });

  function updateSettings(data) {
    for (const [key, value] of Object.entries(data)) {
      setStorage(key, value);
    }
    setData((prev) => ({ ...prev, ...data }));
  }

  return (
    <Form>
      <div className="mt-3 text-secondary">{STRINGS.SETTINGS_LOCAL}</div>
      <div className="mt-3">
        <Switch
          checked={data.fullNames}
          id={STORAGE_FULL_NAMES}
          label={STRINGS.SETTINGS_SHOW_FULL_NAMES}
          onChange={(e) => {
            updateSettings({
              [STORAGE_FULL_NAMES]: !!e.target.checked,
            });
          }}
        />
      </div>
    </Form>
  );
}
