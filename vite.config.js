import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/",
  plugins: [vue()],
  server: {
    proxy: {
      "/api/auth/session": {
        target: process.env.VITE_LOGIN_PROXY_TARGET || "http://localhost:8088",
        changeOrigin: true,
      },
      "/api/control/public": {
        target: process.env.VITE_CONTROL_PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
