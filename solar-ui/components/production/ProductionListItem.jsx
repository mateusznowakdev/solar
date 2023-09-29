import { renderDate } from "../../utils";

export default function ProductionListItem({ data }) {
  return (
    <tr>
      <td>{renderDate(data.timestamp)}</td>
      <td>{data.pv_power} Wh</td>
      <td>{data.load_active_power} Wh</td>
    </tr>
  );
}
