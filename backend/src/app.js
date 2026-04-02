import express from "express";
import cors from "cors";
import morgan from "morgan";
import notesRouter from "./routes/notes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/notes", notesRouter);

// Friendly 404
app.use((req, res) => {
  res.status(404).json({ message: `Path ${req.originalUrl} not found` });
});

// Central error handler with a dash of honesty
app.use((err, _req, res, _next) => {
  console.error("[api] unexpected error", err);
  res.status(500).json({ message: "Something went sideways. Try again?" });
});

export default app;
