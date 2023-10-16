import ListGroup from "react-bootstrap/ListGroup";

import LogListItem from "./LogListItem";

export function LogListItemGroup({ data }) {
  return (
    <ListGroup variant="flush">
      {data.map((entry) => (
        <LogListItem data={entry} key={entry.timestamp} />
      ))}
    </ListGroup>
  );
}
