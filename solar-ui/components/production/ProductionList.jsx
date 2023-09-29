import Table from "react-bootstrap/Table";

import ProductionListItem from "./ProductionListItem";

import { STRINGS } from "../../locale";

export default function ProductionList({ data }) {
  return (
    <Table>
      <thead>
        <tr>
          <th></th>
          <th>{STRINGS.PRODUCTION_PV}</th>
          <th>{STRINGS.PRODUCTION_TOTAL}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <ProductionListItem data={entry} />
        ))}
      </tbody>
    </Table>
  );
}
