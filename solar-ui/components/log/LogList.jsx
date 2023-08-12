import ListGroup from "react-bootstrap/ListGroup";

import LogListItem from "./LogListItem";

export default function LogList({ data }) {
  return (
    <ListGroup variant="flush">
      {data.map((entry) => (
        <LogListItem data={entry} key={entry.timestamp} />
      ))}
    </ListGroup>
  );
}
