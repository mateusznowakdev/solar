import XCircle from "lucide-react/dist/esm/icons/x-circle";

import { STRINGS } from "../../locale";

export default function ErrorText({ error }) {
  return (
    <div className="my-3 text-danger">
      <XCircle className="mb-2" strokeWidth={1.5} />
      <br />
      {STRINGS.AN_ERROR_OCCURRED}: {error}
    </div>
  );
}
