import { Nav } from "react-bootstrap";
import { GraphUp, Sun } from "react-bootstrap-icons";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";

import Charts from "./routes/Charts";
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
