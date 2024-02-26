import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import { Fragment } from "react";

import LogListItemGroup from "./LogListItemGroup";

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
