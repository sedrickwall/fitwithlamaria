import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { spawn, type ChildProcess } from "child_process";

function apiServerPlugin(): Plugin {
  let serverProcess: ChildProcess | null = null;

  return {
    name: "api-server",
    configureServer() {
      const tsxPath = path.resolve(__dirname, "../node_modules/.bin/tsx");
      const serverPath = path.resolve(__dirname, "../server/dev-server.ts");
      
      serverProcess = spawn(tsxPath, [serverPath], {
        stdio: "inherit",
        shell: true,
        env: { ...process.env, NODE_ENV: "development" }
      });

      serverProcess.on("error", (err) => {
        console.error("Failed to start API server:", err);
      });

      process.on("exit", () => {
        if (serverProcess) {
          serverProcess.kill();
        }
      });
    },
    closeBundle() {
      if (serverProcess) {
        serverProcess.kill();
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true
  }
});
