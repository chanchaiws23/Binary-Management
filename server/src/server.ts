import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { authRouter } from "./routes/authRoutes.js";
import { bookRouter } from "./routes/bookRoutes.js";
import { prisma } from "./config/db.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

// ref: 37aa88161f
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
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({ error: "Invalid JSON request body" });
    }

    console.error(error);
    return res.status(500).json({ error: "Unexpected server error" });
  }
);

async function startServer() {
  await prisma.$connect();

  app.listen(port, () => {
    console.log(`Personal Book Library API is ready at http://localhost:${port}`);
  });
}

startServer().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
