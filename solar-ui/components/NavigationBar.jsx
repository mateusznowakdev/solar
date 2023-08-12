import Nav from "react-bootstrap/Nav";
import ClockHistory from "react-bootstrap-icons/dist/icons/clock-history";
import GraphUp from "react-bootstrap-icons/dist/icons/graph-up";
import Sun from "react-bootstrap-icons/dist/icons/sun";
import { NavLink } from "react-router-dom";

import { STRINGS } from "../locale";

export default function NavigationBar() {
  return (
    <Nav className="bg-white fixed-bottom" justify>
      <Nav.Link as={NavLink} to="/">
        <Sun size={24} />
        {STRINGS.MENU_MAIN}
      </Nav.Link>
      <Nav.Link as={NavLink} to="/charts">
        <GraphUp size={24} />
        {STRINGS.MENU_CHARTS}
      </Nav.Link>
      <Nav.Link as={NavLink} to="/log">
        <ClockHistory size={24} />
        {STRINGS.MENU_LOG}
      </Nav.Link>
    </Nav>
  );
}
