import { ErrorBoundary } from "react-error-boundary";
import { HashRouter, Route, Routes } from "react-router-dom";

import NavigationBar from "./components/NavigationBar";
import ErrorText from "./components/generic/ErrorText";
import Charts from "./routes/Charts";
import Log from "./routes/Log";
import Parameters from "./routes/Parameters";
import Production from "./routes/Production";
import Settings from "./routes/Settings";

function errorRender({ error }) {
  return <ErrorText critical error={error.message} />;
}

export default function App() {
  return (
    <ErrorBoundary fallbackRender={errorRender}>
      <HashRouter>
        <Routes>
          <Route element={<Parameters />} index />
          <Route element={<Charts />} path="/charts" />
          <Route element={<Production />} path="/production" />
          <Route element={<Log />} path="/log" />
          <Route element={<Settings />} path="/settings" />
        </Routes>
        <NavigationBar />
      </HashRouter>
    </ErrorBoundary>
  );
}
