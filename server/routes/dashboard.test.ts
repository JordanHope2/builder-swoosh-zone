import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { createServer } from "../index";
import { getSupabaseAdmin } from "../supabase";

// Mock the auth middleware
vi.mock("../middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: () => void) => {
    req.user = { id: "test-user-id", email: "test@example.com" };
    next();
  },
}));

// Mock the supabase client
vi.mock("../supabase", () => ({
  getSupabaseAdmin: vi.fn(),
}));

describe("GET /api/dashboard/recruiter", () => {
  it("should return aggregated dashboard data for a recruiter", async () => {
    const mockJobs = [
      { id: "job-1", owner_id: "test-user-id", status: "active", created_at: "2024-01-01T12:00:00Z", title: "Job 1" },
      { id: "job-2", owner_id: "test-user-id", status: "closed", created_at: "2024-01-02T12:00:00Z", title: "Job 2" },
    ];

    const mockApplications = [
      { job_id: "job-1", status: "applied" },
      { job_id: "job-1", status: "reviewed" },
      { job_id: "job-2", status: "applied" },
    ];

    const mockSupabaseClient = {
      from: vi.fn((table: string) => {
        if (table === "jobs") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockJobs, error: null }),
          };
        }
        if (table === "applications") {
          return {
            select: vi.fn().mockReturnThis(),
            in: vi.fn().mockResolvedValue({ data: mockApplications, error: null }),
          };
        }
        return { from: vi.fn() };
      }),
    };

    (getSupabaseAdmin as any).mockReturnValue(mockSupabaseClient);

    const app = createServer();
    const response = await request(app).get("/api/dashboard/recruiter");

    expect(response.status).toBe(200);

    // Check stats and pipeline
    expect(response.body.stats).toEqual({
      activeJobs: 1,
      totalApplicants: 3,
    });
    expect(response.body.pipeline).toEqual({
      applied: 2,
      reviewed: 1,
    });

    // Check jobs array without being dependent on order
    expect(response.body.jobs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "job-1", applicantCount: 2 }),
        expect.objectContaining({ id: "job-2", applicantCount: 1 }),
      ])
    );
    expect(response.body.jobs.length).toBe(2);
  });
});
