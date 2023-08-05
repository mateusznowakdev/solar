import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import gzipPlugin from "rollup-plugin-gzip";

export default defineConfig({
  plugins: [react(), gzipPlugin({ filter: /^assets\/.*/ })],
  root: "solar-ui",
});
