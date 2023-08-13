import Alert from "react-bootstrap/Alert";

import { STRINGS } from "../../locale";

export default function RefreshPrompt({ show }) {
  if (!show) return;

  return (
    <div className="p-2 sticky-top">
      <Alert className="m-0 p-1 text-center" variant="warning">
        {STRINGS.PARAMETERS_REFRESH_PROMPT}
      </Alert>
    </div>
  );
}
