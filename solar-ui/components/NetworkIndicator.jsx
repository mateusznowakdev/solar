import Home from "lucide-react/dist/esm/icons/home";

import { isExternalNetwork } from "../utils";

export default function NetworkIndicator() {
  if (isExternalNetwork()) return "";

  return (
    <Home
      className="bg-white network-indicator text-success"
      size={16}
      strokeWidth={2}
    />
  );
}
