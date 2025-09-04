/**
 * @jest-environment node
 */

import request from "supertest";
import { createServer } from "../index";

// Mock the entire auth middleware module using Jest
jest.mock("../middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: () => void) => {
    req.user = { id: "test-admin-id" };
    next();
  },
}));

// Mock the supabase client
const mockSupabaseClient = {
  from: jest.fn(),
  auth: {
    admin: {
      deleteUser: jest.fn(),
    },
  },
};

jest.mock("../supabase", () => ({
  getSupabaseAdmin: () => mockSupabaseClient,
}));

describe("/api/admin", () => {
  let app: any;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createServer();
  });

  describe("GET /users", () => {
    it("should return a list of users for an admin", async () => {
      const mockUsers = [{ id: "user-1", role: "free" }];

      const adminCheckFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
      };
      const userListFrom = {
        select: jest.fn().mockResolvedValue({ data: mockUsers, error: null }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(adminCheckFrom)
        .mockReturnValueOnce(userListFrom);

      const response = await request(app).get("/api/admin/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it("should return 403 if user is not an admin", async () => {
        const adminCheckFrom = {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { role: "pro" }, error: null }),
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
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
        };
        mockSupabaseClient.from.mockReturnValueOnce(adminCheckFrom);
        mockSupabaseClient.auth.admin.deleteUser.mockResolvedValueOnce({ data: {}, error: null });

        const response = await request(app).delete("/api/admin/users/user-to-delete");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User deleted successfully.");
        expect(mockSupabaseClient.auth.admin.deleteUser).toHaveBeenCalledWith("user-to-delete");
    });
  });

  describe("GET /jobs", () => {
    it("should return a list of all jobs for an admin", async () => {
        const mockJobs = [{ id: "job-1", title: "Test Job" }];
        const adminCheckFrom = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: { role: "admin" }, error: null }) };
        const jobListFrom = { select: jest.fn().mockReturnThis(), order: jest.fn().mockResolvedValue({ data: mockJobs, error: null }) };
        mockSupabaseClient.from
            .mockReturnValueOnce(adminCheckFrom)
            .mockReturnValueOnce(jobListFrom);

        const response = await request(app).get("/api/admin/jobs");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobs);
    });
  });

  describe("DELETE /jobs/:id", () => {
    it("should delete a job successfully for an admin", async () => {
        const adminCheckFrom = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: { role: "admin" }, error: null }) };
        const deleteFrom = { delete: jest.fn().mockReturnThis(), eq: jest.fn().mockResolvedValue({ error: null }) };
        mockSupabaseClient.from
            .mockReturnValueOnce(adminCheckFrom)
            .mockReturnValueOnce(deleteFrom);

        const response = await request(app).delete("/api/admin/jobs/job-to-delete");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Job deleted successfully.");
        expect(deleteFrom.eq).toHaveBeenCalledWith("id", "job-to-delete");
    });
  });

  describe("GET /subscriptions", () => {
    it("should return a list of all subscriptions for an admin", async () => {
        const mockSubs = [{ id: "sub-1", status: "active" }];
        const adminCheckFrom = { select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: { role: "admin" }, error: null }) };
        const subsListFrom = { select: jest.fn().mockReturnThis(), order: jest.fn().mockResolvedValue({ data: mockSubs, error: null }) };
        mockSupabaseClient.from
            .mockReturnValueOnce(adminCheckFrom)
            .mockReturnValueOnce(subsListFrom);

        const response = await request(app).get("/api/admin/subscriptions");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockSubs);
    });
  });
});
