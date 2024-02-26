import ButtonToolbar from "react-bootstrap/ButtonToolbar";

import { STRINGS } from "../../locale";
import LogFilter from "./LogFilter";

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
