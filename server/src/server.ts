import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authRouter } from "./routes/authRoutes.js";
import { bookRouter } from "./routes/bookRoutes.js";
import { prisma } from "./config/db.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000"
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", authRouter);
app.use("/api", bookRouter);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);
    res.status(500).json({ error: "Unexpected server error" });
  }
);

async function startServer() {
  await prisma.$connect();

  app.listen(port, () => {
    console.log("Book library server is up and ready to roll");
    console.log(`Listening on http://localhost:${port}`);
  });
}

startServer().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});

