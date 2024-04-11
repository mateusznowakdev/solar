import Home from "lucide-react/dist/esm/icons/home";

import { isExternalNetwork } from "../utils";

export default function NetworkIndicator() {
  const className = isExternalNetwork() ? "text-danger" : "text-success";

  return (
    <Home
      className={`${className} bg-white network-indicator`}
      size={16}
      strokeWidth={2}
    />
  );
}
