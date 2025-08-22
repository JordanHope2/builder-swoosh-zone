import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createServer } from "../index";

// Mock the entire auth middleware module
vi.mock("../middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: () => void) => {
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
  let app: any;

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
        expect(response.body.message).toBe("User deleted successfully.");
        expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith("user-to-delete");
    });
  });
});
