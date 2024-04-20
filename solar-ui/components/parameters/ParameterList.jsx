import Dot from "lucide-react/dist/esm/icons/dot";
import Star from "lucide-react/dist/esm/icons/star";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import LinkContainer from "react-router-bootstrap/LinkContainer";

import { PARAMETER_METADATA } from "../../meta";
import { COLORS } from "../../meta";

function sortByPinned(a, b) {
  if (a.pin && !b.pin) return -1;
  if (!a.pin && b.pin) return 1;

  return a.description.localeCompare(b.description);
}

function ParameterListItem({ data, togglePinned }) {
  return (
    <LinkContainer state={{ choice: data.chart ? data.key : null }} to="/charts">
      <ListGroupItem
        action
        active={false}
        className="align-items-center d-flex justify-content-between"
      >
        <div
          className="pin-icon"
          onClick={(e) => {
            togglePinned(data.key);
            e.preventDefault();
          }}
        >
          {data.pin ? (
            <Star color={COLORS.PRIMARY} size={16} />
          ) : (
            <Dot color={COLORS.SECONDARY} size={16} />
          )}
        </div>
        <div className="flex-grow-1 me-2">{data.description}</div>
        <div>
          {data.value} {data.unit}
        </div>
      </ListGroupItem>
    </LinkContainer>
  );
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
        <ParameterListItem data={item} key={item.key} togglePinned={togglePinned} />
      ))}
    </ListGroup>
  );
}
