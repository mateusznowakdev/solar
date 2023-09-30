import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

import Factory from "lucide-react/dist/esm/icons/factory";
import LineChart from "lucide-react/dist/esm/icons/line-chart";
import RadioTower from "lucide-react/dist/esm/icons/radio-tower";
import ScrollText from "lucide-react/dist/esm/icons/scroll-text";

import { STRINGS } from "../locale";

export default function NavigationBar() {
  return (
    <Nav className="bg-white fixed-bottom" justify>
      <Nav.Link as={NavLink} to="/">
        <RadioTower strokeWidth={1.25} />
        {STRINGS.MENU_MAIN}
      </Nav.Link>
      <Nav.Link as={NavLink} to="/charts">
        <LineChart strokeWidth={1.25} />
        {STRINGS.MENU_CHARTS}
      </Nav.Link>
      <Nav.Link as={NavLink} to="/production">
        <Factory strokeWidth={1.25} />
        {STRINGS.MENU_PRODUCTION}
      </Nav.Link>
      <Nav.Link as={NavLink} to="/log">
        <ScrollText strokeWidth={1.25} />
        {STRINGS.MENU_LOG}
      </Nav.Link>
    </Nav>
  );
}
