import Home from "lucide-react/dist/esm/icons/home";
import { useState } from "react";
import Button from "react-bootstrap/Button";

import { STRINGS } from "../locale";
import { STORAGE_INTERNAL_URL, getStorage, setStorage } from "../storage";

export default function NetworkText({ full }) {
  const [internalURL, setInternalURL] = useState(
    getStorage(STORAGE_INTERNAL_URL),
  );

  function navigate() {
    window.location.href = internalURL;
  }

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
      <p className="mb-1">{STRINGS.EXTERNAL_NETWORK_HINT}</p>
      {internalURL && (
        <Button className="text-secondary" onClick={navigate} variant="link">
          {STRINGS.EXTERNAL_NETWORK_SWITCH_TO} {internalURL}
        </Button>
      )}
      {full && (
        <Button
          className="text-secondary pt-0"
          onClick={showModal}
          variant="link"
        >
          {STRINGS.EXTERNAL_NETWORK_SETUP}
        </Button>
      )}
    </div>
  );
}
