import XCircle from "lucide-react/dist/esm/icons/x-circle";
import Button from "react-bootstrap/Button";

import { STRINGS } from "../../locale";

export default function ErrorText({ critical, error }) {
  const criticalErrorText = (
    <>
      <p>{STRINGS.CRITICAL_ERROR_OCCURRED}</p>
      <Button onClick={() => window.location.reload()} variant="light px-2">
        {STRINGS.REFRESH}
      </Button>
    </>
  );

  return (
    <div className="my-3 text-danger">
      <XCircle className="mb-2" strokeWidth={1.5} />
      <p>
        {STRINGS.AN_ERROR_OCCURRED}: {error}
      </p>
      {critical && criticalErrorText}
    </div>
  );
}
