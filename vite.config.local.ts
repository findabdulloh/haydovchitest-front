import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config";

export default mergeConfig(baseConfig, defineConfig({
  server: {
    port: 5000,
    host: "0.0.0.0",
  },
}));