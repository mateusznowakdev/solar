import Check from "lucide-react/dist/esm/icons/check";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

import { STRINGS } from "../../locale";

export default function LogFilters({ filters, toggleFilter }) {
  return (
    <ButtonToolbar className="pb-2">
      <ButtonGroup className="me-2">
        <Button
          className="px-2"
          onClick={() => toggleFilter("errors")}
          size="sm"
          variant="light"
        >
          {filters.includes("errors") && <Check size={16} />}
          {STRINGS.ERRORS}
        </Button>
      </ButtonGroup>
      <ButtonGroup className="me-2">
        <Button
          className="px-2"
          onClick={() => toggleFilter("automation")}
          size="sm"
          variant="light"
        >
          {filters.includes("automation") && <Check size={16} />}
          {STRINGS.AUTOMATION}
        </Button>
      </ButtonGroup>
      <ButtonGroup className="me-2">
        <Button
          className="px-2"
          onClick={() => toggleFilter("system")}
          size="sm"
          variant="light"
        >
          {filters.includes("system") && <Check size={16} />}
          {STRINGS.SYSTEM}
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
}
