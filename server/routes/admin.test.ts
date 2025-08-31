import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Express } from 'express';

import { createServer } from "../index";

// Mock the entire auth middleware module
vi.mock("../middleware/auth", () => ({
  authMiddleware: (req: { user?: { id: string } }, _res: unknown, next: () => void) => {
    req.user = { id: "test-admin-id" };
    next();
  },
}));

// Mock the supabase client
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    admin: {
      deleteUser: vi.fn(),
    },
  },
};

vi.mock("../supabase", () => ({
  getSupabaseAdmin: () => mockSupabaseClient,
}));

describe("/api/admin", () => {
  let app: Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createServer();
  });

  describe("GET /users", () => {
    it("should return a list of users for an admin", async () => {
      const mockUsers = [{ id: "user-1", role: "free" }];

      // Mock the chain for the admin role check
      const adminCheckFrom = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
      };
      // Mock the chain for the user list fetch
      const userListFrom = {
        select: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(adminCheckFrom) // For adminAuthMiddleware
        .mockReturnValueOnce(userListFrom);  // For the route handler

      const response = await request(app).get("/api/admin/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it("should return 403 if user is not an admin", async () => {
        const adminCheckFrom = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { role: "pro" }, error: null }),
        };
        mockSupabaseClient.from.mockReturnValueOnce(adminCheckFrom);

        const response = await request(app).get("/api/admin/users");

        expect(response.status).toBe(403);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.error).toBe("Forbidden: requires admin privileges.");
      });
  });

  describe("DELETE /users/:id", () => {
    it("should delete a user successfully for an admin", async () => {
        const adminCheckFrom = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
        };
        mockSupabaseClient.from.mockReturnValueOnce(adminCheckFrom);
        mockSupabaseClient.auth.admin.deleteUser.mockResolvedValueOnce({ data: {}, error: null });

        const response = await request(app).delete("/api/admin/users/user-to-delete");

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe("User deleted successfully.");
        expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith("user-to-delete");
    });
  });

  // --- Job Management Tests ---

  describe("GET /jobs", () => {
    it("should return a list of all jobs for an admin", async () => {
        const mockJobs = [{ id: "job-1", title: "Test Job" }];
        const adminCheckFrom = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }) };
        const jobListFrom = { select: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: mockJobs, error: null }) };
        mockSupabaseClient.from
            .mockReturnValueOnce(adminCheckFrom)
            .mockReturnValueOnce(jobListFrom);

        const response = await request(app).get("/api/admin/jobs");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
    });

    it("should return 403 if a non-admin tries to access jobs", async () => {
        const adminCheckFrom = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { role: "free" }, error: null }) };
        mockSupabaseClient.from.mockReturnValueOnce(adminCheckFrom);

        const response = await request(app).get("/api/admin/jobs");
        expect(response.status).toBe(403);
    });
  });

  describe("DELETE /jobs/:id", () => {
    it("should delete a job successfully for an admin", async () => {
        const adminCheckFrom = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }) };
        const deleteFrom = { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) };
        mockSupabaseClient.from
            .mockReturnValueOnce(adminCheckFrom)
            .mockReturnValueOnce(deleteFrom);

        const response = await request(app).delete("/api/admin/jobs/job-to-delete");

        expect(response.status).toBe(200);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.body.message).toBe("Job deleted successfully.");
        expect(deleteFrom.eq).toHaveBeenCalledWith("id", "job-to-delete");
    });
  });

  // --- Subscription Management Tests ---

  describe("GET /subscriptions", () => {
    it("should return a list of all subscriptions for an admin", async () => {
        const mockSubs = [{ id: "sub-1", status: "active" }];
        const adminCheckFrom = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }) };
        const subsListFrom = { select: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: mockSubs, error: null }) };
        mockSupabaseClient.from
            .mockReturnValueOnce(adminCheckFrom)
            .mockReturnValueOnce(subsListFrom);

        const response = await request(app).get("/api/admin/subscriptions");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSubs);
    });
  });

  describe("POST /subscriptions/:id", () => {
    it("should return 403 if a non-admin tries to cancel a subscription", async () => {
        const adminCheckFrom = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { role: "free" }, error: null }) };
        mockSupabaseClient.from.mockReturnValueOnce(adminCheckFrom);

        const response = await request(app).post("/api/admin/subscriptions/sub-123").send({ action: 'cancel' });
        expect(response.status).toBe(403);
    });
  });
});
