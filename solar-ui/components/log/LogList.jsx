import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import { Fragment } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

import { METADATA } from "../../meta";
import { renderTime } from "../../utils";

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
          <p className="align-items-center d-flex my-2 pt-1">
            <CalendarDays size={17} />
            &nbsp;{day}
          </p>
          <LogListItemGroup data={entries} />
        </Fragment>
      ))}
    </>
  );
}
