import ListGroup from "react-bootstrap/ListGroup";

import { PARAMETER_METADATA } from "../../meta";
import ParameterListItem from "./ParameterListItem";

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

export default function ParameterList({ data, pinned, togglePinned }) {
  const finalData = Object.entries(PARAMETER_METADATA)
    .map(([key, meta]) => ({
      chart: meta.chart,
      description: meta.description,
      key,
      pin: pinned.includes(key),
      unit: meta.unit,
      value: meta.render(data[key]),
    }))
    .sort(sortByPinned);

  return (
    <ListGroup variant="flush">
      {finalData.map((item) => (
        <ParameterListItem
          data={item}
          key={item.key}
          togglePinned={togglePinned}
        />
      ))}
    </ListGroup>
  );
}
