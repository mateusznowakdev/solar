import { HashRouter, Route, Routes } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import About from "./routes/About";
import Charts from "./routes/Charts";
import Log from "./routes/Log";
import Parameters from "./routes/Parameters";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Parameters />} index />
        <Route element={<Charts />} path="/charts" />
        <Route element={<Log />} path="/log" />
        <Route element={<About />} path="/about" />
      </Routes>
      <NavigationBar />
    </HashRouter>
  );
}
