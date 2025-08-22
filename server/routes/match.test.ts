import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { createServer } from "../index";
import { getSupabaseAdmin } from "../supabase";
import * as aiService from "../services/aiService";

// Mock the auth middleware
vi.mock("../middleware/auth", () => ({
  authMiddleware: (req: any, res: any, next: () => void) => {
    req.user = { id: "test-user-id" };
    next();
  },
}));

// Mock the AI service
vi.mock("../services/aiService", () => ({
  getEmbedding: vi.fn(),
}));

// Mock the supabase client
const mockSupabaseClient = {
  rpc: vi.fn(),
};
vi.mock("../supabase", () => ({
  getSupabaseAdmin: () => mockSupabaseClient,
}));


describe("POST /api/match/jobs", () => {
  let app: any;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createServer();
  });

  it("should return matching jobs for a valid query", async () => {
    const mockQuery = "software engineer with react";
    const mockEmbedding = [0.1, 0.2, 0.3];
    const mockJobs = [{ id: "job-1", title: "React Developer" }];

    // Setup mocks
    (aiService.getEmbedding as any).mockResolvedValue(mockEmbedding);
    mockSupabaseClient.rpc.mockResolvedValue({ data: mockJobs, error: null });

    const response = await request(app)
      .post("/api/match/jobs")
      .send({ query: mockQuery });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ jobs: mockJobs });
    expect(aiService.getEmbedding).toHaveBeenCalledWith(mockQuery);
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith("match_jobs", expect.anything());
  });

  it("should return 400 if query is missing", async () => {
    const response = await request(app)
      .post("/api/match/jobs")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("A 'query' string is required.");
  });
});
