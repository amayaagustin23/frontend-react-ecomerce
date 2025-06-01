import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lessVariables = fs.readFileSync(
  path.resolve(__dirname, "src/styles/antd-theme.less"),
  "utf8"
);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {},
        additionalData: lessVariables,
      },
    },
  },
});
