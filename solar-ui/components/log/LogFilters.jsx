import Check from "lucide-react/dist/esm/icons/check";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import { STRINGS } from "../../locale";

function LogFilter({ name, description, checked, toggleFilter }) {
  return (
    <Badge
      bg=""
      className={"py-2 " + (checked ? "success" : "")}
      onClick={() => toggleFilter(name)}
      pill
    >
      {checked && <Check size={16} />}
      {description}
    </Badge>
  );
}

export default function LogFilters({ filters, toggleFilter }) {
  return (
    <Stack className="mb-3 pb-2" direction="horizontal" gap={2}>
      <LogFilter
        name="errors"
        description={STRINGS.ERRORS}
        checked={filters.includes("errors")}
        toggleFilter={toggleFilter}
      />
      <LogFilter
        name="automation"
        description={STRINGS.AUTOMATION}
        checked={filters.includes("automation")}
        toggleFilter={toggleFilter}
      />
      <LogFilter
        name="system"
        description={STRINGS.SYSTEM}
        checked={filters.includes("system")}
        toggleFilter={toggleFilter}
      />
    </Stack>
  );
}
