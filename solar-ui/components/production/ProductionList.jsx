import Table from "react-bootstrap/Table";

import { STRINGS } from "../../locale";
import ProductionListItem from "./ProductionListItem";

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
