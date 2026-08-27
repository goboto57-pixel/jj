import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import chatRoutes from "./routes/chat.js";
import fileRoutes from "./routes/files.js";
import projectRoutes from "./routes/projects.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*",
    credentials: true
  })
);
app.use(express.json({ limit: "15mb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});
app.use("/api", limiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: process.env.MISTRAL_MODEL || "codestral-latest" });
});

app.use("/api/chat", chatRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/projects", projectRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`CodeForge server running on port ${PORT}`);
});
