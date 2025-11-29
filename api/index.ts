import type { VercelRequest, VercelResponse } from "@vercel/node";

let appPromise: Promise<typeof import("../server/index").default> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = import("../server/index").then((mod) => mod.default);
  }
  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  return app(req as any, res as any);
}
