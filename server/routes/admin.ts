import { Router, Request, Response as ExpressResponse, NextFunction } from "express";
import { authMiddleware } from "../middleware/auth";
import { getSupabaseAdmin } from "../supabase";

const router = Router();

// Middleware to check for admin role
const adminAuthMiddleware = async (req: Request, res: ExpressResponse, next: NextFunction) => {
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

    if (data?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: requires admin privileges." });
    }

    next();
  } catch (error: any) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({ error: "Failed to verify admin role." });
  }
};

// Chain the auth middleware and admin check middleware
const protectedAdminRoute = [authMiddleware, adminAuthMiddleware];


// GET /api/admin/users - List all users
router.get("/users", protectedAdminRoute, async (req, res: ExpressResponse) => {
  try {
    const supabase = getSupabaseAdmin();
    // Supabase auth users are not directly queryable in a simple way.
    // We fetch profiles and can join other data.
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

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// POST /api/admin/users/:id - Update a user's details
router.post("/users/:id", protectedAdminRoute, async (req, res: ExpressResponse) => {
  const { id: userIdToUpdate } = req.params;
  const { role, status } = req.body; // e.g., update role or a conceptual 'status'

  try {
    const supabase = getSupabaseAdmin();
    // Update role in profiles table
    if (role) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userIdToUpdate)
        .select();

      if (error) throw error;
      return res.json(data);
    }

    // Note: A 'status' field would need to be added to the profiles schema to be updatable.
    // For now, we only handle role updates.

    res.status(400).json({ error: "No updatable fields provided." });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE /api/admin/users/:id - Delete a user
router.delete("/users/:id", protectedAdminRoute, async (req, res: ExpressResponse) => {
    const { id: userIdToDelete } = req.params;

    try {
        const supabase = getSupabaseAdmin();
        // This deletes the user from the `auth.users` table, and thanks to
        // `ON DELETE CASCADE` in our schemas, their profile, subscriptions, etc.,
        // will be deleted automatically.
        const { error } = await supabase.auth.admin.deleteUser(userIdToDelete);

        if (error) throw error;

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


// --- Job Management ---

// GET /api/admin/jobs - List all jobs
router.get("/jobs", protectedAdminRoute, async (req, res: ExpressResponse) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("jobs")
        .select(`*, owner:profiles(full_name)`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

// POST /api/admin/jobs/:id - Update a job
router.post("/jobs/:id", protectedAdminRoute, async (req, res: ExpressResponse) => {
    const { id: jobId } = req.params;
    const { title, description, status } = req.body;

    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("jobs")
            .update({ title, description, status })
            .eq("id", jobId)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/admin/jobs/:id - Delete a job
router.delete("/jobs/:id", protectedAdminRoute, async (req, res: ExpressResponse) => {
    const { id: jobId } = req.params;

    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from("jobs")
            .delete()
            .eq("id", jobId);

        if (error) throw error;
        res.status(200).json({ message: "Job deleted successfully." });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


// --- Subscription Management ---

// GET /api/admin/subscriptions - List all subscriptions
router.get("/subscriptions", protectedAdminRoute, async (req, res: ExpressResponse) => {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from("subscriptions")
            .select(`
                *,
                profile:profiles(full_name, email)
            `)
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/admin/subscriptions/:id - Cancel a subscription
router.post("/subscriptions/:id", protectedAdminRoute, async (req, res: ExpressResponse) => {
    const { id: subscriptionId } = req.params;
    const { action } = req.body;

    if (action !== 'cancel') {
        return res.status(400).json({ error: "Invalid action." });
    }

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

        // We don't need to update our local DB here, because the `customer.subscription.deleted`
        // or `customer.subscription.updated` webhook will handle that automatically.
        const deletedSubscription = await stripe.subscriptions.cancel(subscriptionId);

        res.json(deletedSubscription);
    } catch (error: any) {
        console.error("Error cancelling Stripe subscription:", error);
        res.status(500).json({ error: error.message });
    }
});


export default router;
