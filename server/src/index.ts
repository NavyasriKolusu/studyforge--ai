import "dotenv/config";

import express from "express";
import cors from "cors";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "StudyForge API",
  });
});

app.listen(PORT, () => {
  console.log(
    `StudyForge API running on http://localhost:${PORT}`
  );
});