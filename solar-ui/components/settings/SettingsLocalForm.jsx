import Pencil from "lucide-react/dist/esm/icons/pencil";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Switch from "react-bootstrap/Switch";

import { STRINGS } from "../../locale";
import {
  STORAGE_KEYS,
  getDefaultValue,
  getStorage,
  setStorage,
} from "../../storage";

export default function SettingsLocalForm() {
  const [data, setData] = useState({
    [STORAGE_KEYS.FULL_NAMES]: getStorage(STORAGE_KEYS.FULL_NAMES),
    [STORAGE_KEYS.API_URL]: getStorage(STORAGE_KEYS.API_URL),
  });

  function showURLPrompt(key) {
    const response = prompt(undefined, data[key]);
    if (response != null) {
      updateSettings({ [key]: response || getDefaultValue(key) });
    }
  }

  function updateSettings(data) {
    for (const [key, value] of Object.entries(data)) {
      setStorage(key, value);
    }
    setData((prev) => ({ ...prev, ...data }));
  }

  return (
    <Form>
      <div className="mt-3">
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
      <div className="align-items-center d-flex mt-3">
        <Button
          className="px-2 me-2"
          onClick={() => showURLPrompt(STORAGE_KEYS.API_URL)}
          variant="light"
        >
          <Pencil strokeWidth={1.5} size={17} />
        </Button>
        <div>
          {STRINGS.SETTINGS_API_URL}
          <br />
          <span className="text-secondary text-small">
            {data[STORAGE_KEYS.API_URL]}
          </span>
        </div>
      </div>
    </Form>
  );
}
