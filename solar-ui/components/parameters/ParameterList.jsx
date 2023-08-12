import ListGroup from "react-bootstrap/ListGroup";

import ParameterListItem from "./ParameterListItem";

import { METADATA } from "../../meta";

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

export default function ParameterList({ data, pinned, togglePinned }) {
  const finalData = Object.entries(METADATA)
    .map(([key, meta]) => ({
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