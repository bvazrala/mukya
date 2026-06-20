import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During dev the frontend runs on :5173 and the Python backend on :8000.
// This proxy forwards anything starting with /api to the backend, so the
// frontend can just call fetch("/api/prioritize") with no CORS headaches.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
