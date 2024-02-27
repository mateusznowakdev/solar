import Check from "lucide-react/dist/esm/icons/check";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function LogFilter({
  name,
  description,
  filters,
  toggleFilter,
}) {
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
