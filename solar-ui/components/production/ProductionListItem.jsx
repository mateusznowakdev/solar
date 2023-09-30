import { renderDate, renderMonth, renderNumber } from "../../utils";

export default function ProductionListItem({ data, mode }) {
  let dateString;

  switch (mode) {
    case "days":
      dateString = renderDate(data.timestamp);
      break;
    case "months":
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
