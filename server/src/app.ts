import cors from "cors";
import express from "express";
import { owners } from "./data.js";

const allowedOrigins = (process.env.CLIENT_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
  }),
);

app.get("/api/books", (_request, response) => {
  response.json(owners);
});

app.use((_request, response) => {
  response.status(404).json({ error: "Not found" });
});

app.use(
  (error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled API error:", error);
    response.status(500).json({ error: "An unexpected server error occurred." });
  },
);
