import Home from "lucide-react/dist/esm/icons/home";

import { STRINGS } from "../../locale";

export default function ExternalText() {
  return (
    <div className="my-3 text-secondary">
      <Home className="mb-2" strokeWidth={1.5} />
      <br />
      {STRINGS.EXTERNAL_TEXT}
    </div>
  );
}
