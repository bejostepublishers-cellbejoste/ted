import express from "express";
import path from "path";
import routes from "./routes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
// API routes
app.use("/api", routes);

// In production serve the built client from ../client/dist (or ./dist/client)
const isProd = process.env.NODE_ENV === "production";
if (isProd) {
  const clientDist = path.resolve(process.cwd(), "dist", "client");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  // In dev, keep previous Vite-based dev server behavior
  (async () => {
    const { createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: "ssr" },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, await (await import('fs')).promises.readFile(path.resolve('client','index.html'),'utf-8'));
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  })();
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port} (prod=${isProd})`);
});
