// server/middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import { getSupabase } from "../supabase";

// Extend the Express Request type to include our user property
declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const supabase = getSupabase();
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Token validation error:", error.message);
      return res.status(401).json({ error: `Unauthorized: ${error.message}` });
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "Unknown authentication error" });
  }
};