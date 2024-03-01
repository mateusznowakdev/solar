import Check from "lucide-react/dist/esm/icons/check";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";

import { STRINGS } from "../../locale";

function LogFilter({ name, description, filters, toggleFilter }) {
  return (
    <ButtonGroup className="me-2">
      <Button
        className="p-2"
        onClick={() => toggleFilter(name)}
        size="sm"
        variant="light"
      >
        {filters.includes(name) && <Check size={16} />}
        {description}
      </Button>
    </ButtonGroup>
  );
}

export default function LogFilters({ filters, toggleFilter }) {
  return (
    <ButtonToolbar className="pb-2">
      <LogFilter
        name="errors"
        description={STRINGS.ERRORS}
        filters={filters}
        toggleFilter={toggleFilter}
      />
      <LogFilter
        name="automation"
        description={STRINGS.AUTOMATION}
        filters={filters}
        toggleFilter={toggleFilter}
      />
      <LogFilter
        name="system"
        description={STRINGS.SYSTEM}
        filters={filters}
        toggleFilter={toggleFilter}
      />
    </ButtonToolbar>
  );
}
