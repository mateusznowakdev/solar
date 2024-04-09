import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import loadVersion from "vite-plugin-package-version";

export default defineConfig({
  plugins: [react(), loadVersion()],
  root: "solar-ui",
});
