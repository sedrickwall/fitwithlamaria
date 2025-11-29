import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite"; // ONLY serveStatic allowed in prod

const app = express();

// Stripe webhook raw body support
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// API logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJson: any;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJson = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) logLine += ` :: ${JSON.stringify(capturedJson)}`;
      log(logLine);
    }
  });

  next();
});

// Register API routes synchronously for Vercel compatibility
(async () => {
  try {
    await registerRoutes(app);
  } catch (err) {
    console.error("Error registering routes:", err);
  }
})();

// Error handler
app.use((err: any, _req: Request, res: Response) => {
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// Start server for local development
if (process.env.NODE_ENV !== "production") {
  (async () => {
    const { setupVite } = await import("./vite");
    const { createServer } = await import("http");
    const server = createServer(app);
    await setupVite(app, server);
    const port = 5000;
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  })();
} else {
  serveStatic(app);
}

export default app;
