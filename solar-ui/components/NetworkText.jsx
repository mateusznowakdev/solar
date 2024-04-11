import Home from "lucide-react/dist/esm/icons/home";
import { useState } from "react";
import Button from "react-bootstrap/Button";

import { STRINGS } from "../locale";
import { STORAGE_INTERNAL_URL, getStorage, setStorage } from "../storage";

export default function NetworkText() {
  const [internalURL, setInternalURL] = useState(
    getStorage(STORAGE_INTERNAL_URL),
  );

  function showModal() {
    const response = prompt(
      STRINGS.EXTERNAL_NETWORK_SETUP_HINT,
      internalURL || "",
    );

    if (response !== null) {
      setInternalURL(response);
      setStorage(STORAGE_INTERNAL_URL, response);
    }
  }

  return (
    <div className="my-3 text-secondary">
      <Home className="mb-2" strokeWidth={1.5} />
      <br />
      {STRINGS.EXTERNAL_NETWORK_HINT}
      <br />
      {internalURL}
      <Button className="text-secondary" onClick={showModal} variant="link">
        {STRINGS.EXTERNAL_NETWORK_SETUP}
      </Button>
    </div>
  );
}
