import Loader from "lucide-react/dist/esm/icons/loader";

import { STRINGS } from "../../locale";

export default function LoadingText() {
  return (
    <div className="my-3 text-secondary">
      <Loader strokeWidth={1.5} />
      <br />
      {STRINGS.LOADING}...
    </div>
  );
}
