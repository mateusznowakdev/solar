import { HashRouter, Route, Routes } from "react-router-dom";

import Charts from "./routes/Charts";
import Main from "./routes/Main";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Main />} index />
        <Route element={<Charts />} path="/charts/:choice" />
      </Routes>
    </HashRouter>
  );
}
