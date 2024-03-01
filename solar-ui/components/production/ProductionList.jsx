import Table from "react-bootstrap/Table";

import { STRINGS } from "../../locale";
import { renderDate, renderMonth, renderNumber } from "../../utils";

function ProductionListItem({ data, mode }) {
  let dateString;

  switch (mode) {
    case "daily":
      dateString = renderDate(data.timestamp);
      break;
    case "monthly":
      dateString = renderMonth(data.timestamp);
      break;
    default:
      dateString = "";
  }

  return (
    <tr>
      <td>{dateString}</td>
      <td>
        {renderNumber(data.pv_power / 1000, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}{" "}
        kWh
      </td>
      <td>
        {renderNumber(data.load_active_power / 1000, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}{" "}
        kWh
      </td>
    </tr>
  );
}

export default function ProductionList({ data, mode }) {
  return (
    <Table className="production-table">
      <thead>
        <tr>
          <th></th>
          <th>{STRINGS.PRODUCTION_PV}</th>
          <th>{STRINGS.PRODUCTION_TOTAL}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, idx) => (
          <ProductionListItem data={entry} key={idx} mode={mode} />
        ))}
      </tbody>
    </Table>
  );
}
