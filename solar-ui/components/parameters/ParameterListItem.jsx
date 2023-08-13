import ListGroup from "react-bootstrap/ListGroup";
import Pin from "react-bootstrap-icons/dist/icons/pin";
import PinFill from "react-bootstrap-icons/dist/icons/pin-fill";
import LinkContainer from "react-router-bootstrap/LinkContainer";

import { COLORS } from "../../meta";

export default function ParameterListItem({ data, togglePinned }) {
  return (
    <LinkContainer state={{ choice: data.key }} to="/charts">
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
          {data.pin ? <PinFill color={COLORS.PRIMARY} /> : <Pin />}
        </div>
        <div className="flex-grow-1 me-2">{data.description}</div>
        <div>
          {data.value} {data.unit}
        </div>
      </ListGroup.Item>
    </LinkContainer>
  );
}
