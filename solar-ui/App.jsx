import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";
import GraphUp from "react-bootstrap-icons/dist/icons/graph-up";
import Sun from "react-bootstrap-icons/dist/icons/sun";

import {
  HashRouter,
  NavLink as RRNavLink,
  Route,
  Routes,
} from "react-router-dom";

import Charts from "./routes/Charts";
import Main from "./routes/Main";

function AppMenu() {
  return (
    <Nav justify>
      <NavLink as={RRNavLink} to="/">
        <Sun size={24} />
        Podsumowanie
      </NavLink>
      <NavLink as={RRNavLink} to="/charts">
        <GraphUp size={24} />
        Wykresy
      </NavLink>
    </Nav>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Main />} index />
        <Route element={<Charts />} path="/charts">
          <Route element={<Charts />} path=":choice" />
        </Route>
      </Routes>
      <AppMenu />
    </HashRouter>
  );
}
