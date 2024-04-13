import Loader2 from "lucide-react/dist/esm/icons/loader-2";

import { STRINGS } from "../../locale";

export default function LoadingText() {
  return (
    <div className="my-3 text-secondary">
      <Loader2 className="mb-2 rotate" strokeWidth={1.5} />
      <p>{STRINGS.LOADING}...</p>
    </div>
  );
}
