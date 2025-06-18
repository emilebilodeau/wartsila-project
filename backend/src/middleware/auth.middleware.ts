import jwt from "jsonwebtoken";
import { createSecretKey } from "crypto";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

// middleware used to protect routes, requiring an authenticated token
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "Access token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      createSecretKey(Buffer.from(process.env.JWT_SECRET!, "utf-8"))
    ) as { user_id: number };

    req.userId = decoded.user_id;
    next(); // proceed to route
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
}
