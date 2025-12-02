import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { spawn, type ChildProcess } from "child_process";

function apiServerPlugin(): Plugin {
  let serverProcess: ChildProcess | null = null;
  let isStarting = false;

  function startServer() {
    if (isStarting || serverProcess) return;
    isStarting = true;

    const tsxPath = path.resolve(__dirname, "../node_modules/.bin/tsx");
    const serverPath = path.resolve(__dirname, "../server/dev-server.ts");
    
    serverProcess = spawn(tsxPath, ["watch", serverPath], {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, NODE_ENV: "development" }
    });

    serverProcess.on("error", (err) => {
      console.error("Failed to start API server:", err);
      serverProcess = null;
      isStarting = false;
    });

    serverProcess.on("exit", () => {
      serverProcess = null;
      isStarting = false;
    });

    isStarting = false;
  }

  function stopServer() {
    if (serverProcess) {
      serverProcess.kill();
      serverProcess = null;
    }
  }

  return {
    name: "api-server",
    configureServer() {
      startServer();
      process.on("exit", stopServer);
      process.on("SIGINT", stopServer);
      process.on("SIGTERM", stopServer);
    }
  };
}

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  root: __dirname,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
      "@shared": path.resolve(__dirname, "../shared")
    }
  },
  server: {
    port: 5000,
    host: "0.0.0.0",
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
