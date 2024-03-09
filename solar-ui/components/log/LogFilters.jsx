import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";

import { STRINGS } from "../../locale";

function LogFilter({ name, description, filters, toggleFilter }) {
  return (
    <Badge
      bg=""
      className={"py-2 " + (filters.includes(name) ? "success" : "")}
      onClick={() => toggleFilter(name)}
      pill
    >
      {description}
    </Badge>
  );
}

export default function LogFilters({ filters, toggleFilter }) {
  return (
    <Stack className="mb-3" direction="horizontal" gap={2}>
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
    </Stack>
  );
}
