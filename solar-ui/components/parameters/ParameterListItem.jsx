import ListGroup from "react-bootstrap/ListGroup";
import LinkContainer from "react-router-bootstrap/LinkContainer";

import Dot from "lucide-react/dist/esm/icons/dot";
import Star from "lucide-react/dist/esm/icons/star";

import { COLORS } from "../../meta";

export default function ParameterListItem({ data, togglePinned }) {
  return (
    <LinkContainer
      state={{ choice: data.chart ? data.key : null }}
      to="/charts"
    >
      <ListGroup.Item
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
            <Dot size={16} />
          )}
        </div>
        <div className="flex-grow-1 me-2">{data.description}</div>
        <div>
          {data.value} {data.unit}
        </div>
      </ListGroup.Item>
    </LinkContainer>
  );
}
