import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const unauthorizedBody = {
  error: "Access denied: session credential missing or expired"
};

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;

  if (!token) {
    return res.status(401).json(unauthorizedBody);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
      id: string;
      username: string;
    };

    req.user = {
      id: payload.id,
      username: payload.username
    };

    return next();
  } catch {
    return res.status(401).json(unauthorizedBody);
  }
}

