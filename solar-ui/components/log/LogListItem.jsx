import ListGroup from "react-bootstrap/ListGroup";

import { METADATA } from "../../meta";
import { renderTime } from "../../utils";

export default function LogListItem({ data }) {
  return (
    <ListGroup.Item className="align-items-center d-flex justify-content-between py-2">
      <div>
        {METADATA[data.event].description}
        {": "}
        {METADATA[data.event].render(data.value)}
      </div>
      <div className="text-small">{renderTime(data.timestamp)}</div>
    </ListGroup.Item>
  );
}
