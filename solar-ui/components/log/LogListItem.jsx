import ListGroup from "react-bootstrap/ListGroup";

import { METADATA } from "../../meta";
import { renderDateTime } from "../../utils";

export default function LogListItem({ data }) {
  return (
    <ListGroup.Item key={data.timestamp}>
      <div className="pt-2">
        {METADATA[data.field_name].description}
        {": "}
        {METADATA[data.field_name].render(data.new_value)}
      </div>
      <div className="pb-2 text-small">{renderDateTime(data.timestamp)}</div>
    </ListGroup.Item>
  );
}
