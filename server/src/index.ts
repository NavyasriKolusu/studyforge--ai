import "dotenv/config";

import express from "express";
import cors from "cors";

import generateRouter from "./routes/generate.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "StudyForge API",
  });
});

app.use("/api/generate", generateRouter);

app.use(
  (
    error: Error,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);

    response.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong.",
    });
  }
);

app.listen(PORT, () => {
  console.log(
    `StudyForge API running on http://localhost:${PORT}`
  );
});