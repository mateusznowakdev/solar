import { Fragment } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

import { METADATA } from "../../meta";
import { renderTime } from "../../utils";
import Separator from "../generic/Separator";

function LogListItem({ data }) {
  return (
    <ListGroupItem className="align-items-center d-flex justify-content-between py-2">
      <div>
        {METADATA[data.name].description}
        {data.value !== null && ": "}
        {data.value !== null && METADATA[data.name].render(data.value)}
      </div>
      <div className="text-small">{renderTime(data.timestamp)}</div>
    </ListGroupItem>
  );
}

function LogListItemGroup({ data }) {
  return (
    <ListGroup variant="flush">
      {data.map((entry) => (
        <LogListItem data={entry} key={entry.id} />
      ))}
    </ListGroup>
  );
}

export default function LogList({ data }) {
  return (
    <>
      {Object.entries(data).map(([day, entries]) => (
        <Fragment key={day}>
          <Separator text={day} />
          <LogListItemGroup data={entries} />
        </Fragment>
      ))}
    </>
  );
}
