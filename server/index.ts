import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Stripe webhook raw body support
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// API log middleware
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJsonResponse: any;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJsonResponse = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Register routes normally
registerRoutes(app).catch(err => {
  console.error("Error registering routes:", err);
});

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Production static files
if (process.env.NODE_ENV === "production") {
  serveStatic(app);
}

export default app;
