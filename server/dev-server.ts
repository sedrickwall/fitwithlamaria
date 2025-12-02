import express from "express";
import { registerRoutes } from "./routes";

const app = express();

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

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

(async () => {
  try {
    await registerRoutes(app);
    const port = 5001;
    app.listen(port, "0.0.0.0", () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start dev server:", err);
    process.exit(1);
  }
})();
