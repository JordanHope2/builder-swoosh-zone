import { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin } from "../supabase";

export const rbacMiddleware = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated." });
    }

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) throw error;

      const userRole = data?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden: insufficient privileges." });
      }

      next();
    } catch (error: any) {
      console.error("RBAC middleware error:", error);
      res.status(500).json({ error: "Failed to verify user role." });
    }
  };
};
