import Nav from "react-bootstrap/Nav";
import ClockHistory from "react-bootstrap-icons/dist/icons/clock-history";
import GraphUp from "react-bootstrap-icons/dist/icons/graph-up";
import Sun from "react-bootstrap-icons/dist/icons/sun";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";

import Charts from "./routes/Charts";
import Log from "./routes/Log";
import Main from "./routes/Main";

function AppMenu() {
  return (
    <Nav justify>
      <Nav.Link as={NavLink} to="/">
        <Sun size={24} />
        Podsumowanie
      </Nav.Link>
      <Nav.Link as={NavLink} to="/charts">
        <GraphUp size={24} />
        Wykresy
      </Nav.Link>
      <Nav.Link as={NavLink} to="/log">
        <ClockHistory size={24} />
        Dziennik
      </Nav.Link>
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
        <Route element={<Log />} path="/log" />
      </Routes>
      <AppMenu />
    </HashRouter>
  );
}
