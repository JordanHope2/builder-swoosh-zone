// server/routes/admin.ts
import { Router, type Request, type Response, type NextFunction } from "express";
import { Stripe } from "stripe";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";
import { UpdateUserSchema, UpdateJobSchema, UpdateSubscriptionSchema } from "../validation/adminSchemas";
import type { Database } from "../../app/types/supabase";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

const router = Router();

// Middleware to check for admin role
const adminAuthMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "User not authenticated." });
    return;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    res.status(500).json({ error: "Failed to verify admin role." });
    return;
  }

  if (data?.role !== "admin") {
    res.status(403).json({ error: "Forbidden: requires admin privileges." });
    return;
  }

  next();
});

// Chain the auth middleware and admin check middleware
const protectedAdminRoute = [authMiddleware, adminAuthMiddleware];


// GET /api/admin/users - List all users
router.get("/users", protectedAdminRoute, asyncHandler(async (_req: Request, res: Response) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      full_name,
      avatar_url,
      website,
      role
    `);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
}));


// POST /api/admin/users/:id - Update a user's details
router.post("/users/:id", protectedAdminRoute, asyncHandler(async (req: Request, res: Response) => {
  const { id: userIdToUpdate } = req.params;

  const parsed = UpdateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { role, status } = parsed.data;

  const supabase = getSupabaseAdmin();
  // Update role in profiles table
  if (role) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userIdToUpdate)
      .select();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.json(data);
    return;
  }

  // Note: A 'status' field would need to be added to the profiles schema to be updatable.
  // For now, we only handle role updates.

  res.status(400).json({ error: "No updatable fields provided." });
}));


// DELETE /api/admin/users/:id - Delete a user
router.delete("/users/:id", protectedAdminRoute, asyncHandler(async (req: Request, res: Response) => {
    const { id: userIdToDelete } = req.params;

    const supabase = getSupabaseAdmin();
    // This deletes the user from the `auth.users` table, and thanks to
    // `ON DELETE CASCADE` in our schemas, their profile, subscriptions, etc.,
    // will be deleted automatically.
    const { error } = await supabase.auth.admin.deleteUser(userIdToDelete);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(200).json({ message: "User deleted successfully." });
}));


// --- Job Management ---

// GET /api/admin/jobs - List all jobs
router.get("/jobs", protectedAdminRoute, asyncHandler(async (_req: Request, res: Response) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("jobs")
      .select(`*, owner:profiles(full_name)`)
      .order("created_at", { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
}));

// POST /api/admin/jobs/:id - Update a job
router.post("/jobs/:id", protectedAdminRoute, asyncHandler(async (req: Request, res: Response) => {
    const { id: jobId } = req.params;

    const parsed = UpdateJobSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const { title, description, status } = parsed.data;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("jobs")
        .update({ title, description, status })
        .eq("id", jobId)
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.json(data);
}));

// DELETE /api/admin/jobs/:id - Delete a job
router.delete("/jobs/:id", protectedAdminRoute, asyncHandler(async (req: Request, res: Response) => {
    const { id: jobId } = req.params;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.status(200).json({ message: "Job deleted successfully." });
}));


// --- Subscription Management ---

// GET /api/admin/subscriptions - List all subscriptions
router.get("/subscriptions", protectedAdminRoute, asyncHandler(async (_req: Request, res: Response) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("subscriptions")
        .select(`
            *,
            profile:profiles(full_name, email)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.json(data);
}));

// POST /api/admin/subscriptions/:id - Cancel a subscription
router.post("/subscriptions/:id", protectedAdminRoute, asyncHandler(async (req: Request, res: Response) => {
    const { id: subscriptionId } = req.params;

    const parsed = UpdateSubscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    // We don't need to update our local DB here, because the `customer.subscription.deleted`
    // or `customer.subscription.updated` webhook will handle that automatically.
    const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

    res.json(deletedSubscription);
}));


export default router;
