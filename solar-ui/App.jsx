import { HashRouter, Route, Routes } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import Charts from "./routes/Charts";
import Log from "./routes/Log";
import Main from "./routes/Main";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Main />} index />
        <Route element={<Charts />} path="/charts" />
        <Route element={<Log />} path="/log" />
      </Routes>
      <NavigationBar />
    </HashRouter>
  );
}
