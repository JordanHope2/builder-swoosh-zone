import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createServer } from "../index";

const mockStats = {
  active_jobs: "12,345",
  registered_users: "54,321",
  success_rate: "98%",
};

const mockCompanies = [
  { id: "1", name: "Mock Company 1", featured: true },
  { id: "2", name: "Mock Company 2", featured: true },
];

const mockSupabase = {
  from: vi.fn((tableName: string) => {
    if (tableName === "stats") {
      return {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStats, error: null }),
      };
    }
    if (tableName === "companies") {
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockCompanies, error: null }),
      };
    }
    return {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: new Error("Table not found") }),
      eq: vi.fn().mockResolvedValue({ data: [], error: new Error("Table not found") }),
    };
  }),
};

vi.mock("../supabase", () => ({
  getSupabase: () => mockSupabase,
}));

const app = createServer();

describe("API routes", () => {
  describe("GET /api/stats", () => {
    it("should return statistics", async () => {
      const response = await request(app).get("/api/stats");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        activeJobs: "12,345",
        registeredUsers: "54,321",
        successRate: "98%",
      });
    });
  });

  describe("GET /api/companies/featured", () => {
    it("should return featured companies", async () => {
      const response = await request(app).get("/api/companies/featured");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCompanies);
    });
  });
});
