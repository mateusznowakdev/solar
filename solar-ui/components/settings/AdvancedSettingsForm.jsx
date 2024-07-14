import { useState } from "react";
import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import { STORAGE_KEYS, getStorage, setStorage } from "../../storage";
import Separator from "../generic/Separator";

export default function AdvancedSettingsForm() {
  const [data, setData] = useState({
    [STORAGE_KEYS.FULL_NAMES]: getStorage(STORAGE_KEYS.FULL_NAMES),
  });

  function updateSettings(data) {
    for (const [key, value] of Object.entries(data)) {
      setStorage(key, value);
    }
    setData((prev) => ({ ...prev, ...data }));
  }

  return (
    <Form>
      <Separator text={STRINGS.SETTINGS_APPEARANCE} />
      <div className="mt-3 mb-4">
        <Switch
          checked={data[STORAGE_KEYS.FULL_NAMES]}
          id={STORAGE_KEYS.FULL_NAMES}
          label={STRINGS.SETTINGS_SHOW_FULL_NAMES}
          onChange={(e) => {
            updateSettings({
              [STORAGE_KEYS.FULL_NAMES]: !!e.target.checked,
            });
          }}
        />
      </div>
    </Form>
  );
}
