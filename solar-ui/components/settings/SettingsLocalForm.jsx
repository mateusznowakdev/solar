import Pencil from "lucide-react/dist/esm/icons/pencil";
import { useState } from "react";
import Button from "react-bootstrap/Button";
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
      <div className="mt-4 text-secondary text-small text-uppercase">
        {STRINGS.SETTINGS_NETWORK}
      </div>
      <div className="align-items-start d-flex mt-3">
        <Button className="px-2 me-2" variant="light">
          <Pencil strokeWidth={1.5} size={17} />
        </Button>
        <div>
          {STRINGS.SETTINGS_NETWORK_WS}
          <br />
          <span className="text-small">http://localhost:5173/ws/</span>
        </div>
      </div>
      <div className="align-items-start d-flex mt-3">
        <Button className="px-2 me-2" variant="light">
          <Pencil strokeWidth={1.5} size={17} />
        </Button>
        <div>
          {STRINGS.SETTINGS_NETWORK_API}
          <br />
          <span className="text-small">http://localhost:8000/api/</span>
        </div>
      </div>
    </Form>
  );
}
