import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "m24zrp-5173.csb.app", // your current sandbox host
      "*.csb.app",
      "*.codesandbox.io",
    ],
    host: true,
  },
});
