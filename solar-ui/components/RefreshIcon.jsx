import RefreshCw from "lucide-react/dist/esm/icons/refresh-cw";
import Button from "react-bootstrap/Button";

export default function RefreshIcon() {
  return (
    <Button
      className="refresh-button"
      onClick={() => window.location.reload()}
      variant="light"
    >
      <RefreshCw strokeWidth={1.25} />
    </Button>
  );
}
