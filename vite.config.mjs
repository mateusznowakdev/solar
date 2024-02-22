import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import gzipPlugin from "rollup-plugin-gzip";
import loadVersion from "vite-plugin-package-version";

export default defineConfig({
  plugins: [react(), loadVersion(), gzipPlugin({ filter: /^assets\/.*/ })],
  root: "solar-ui",
});
