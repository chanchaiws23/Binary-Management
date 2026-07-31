import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { readRequiredString } from "../utils/validation.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body as Record<string, unknown>;
  const parsedUsername = readRequiredString(username, "Username", 50);
  const parsedPassword = readRequiredString(password, "Password", 100);

  if ("error" in parsedUsername) {
    return res.status(400).json({ error: parsedUsername.error });
  }

  if ("error" in parsedPassword) {
    return res.status(400).json({ error: parsedPassword.error });
  }

  const user = await prisma.user.findUnique({
    where: { username: parsedUsername.value }
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const passwordMatches = await bcrypt.compare(
    parsedPassword.value,
    user.password
  );

  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "JWT secret is not configured" });
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ??
      "1h") as SignOptions["expiresIn"]
  };

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    secret,
    options
  );

  return res.json({ token });
});
