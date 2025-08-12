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

const mockFooterLinks = [
  { id: "1", text: "Browse Jobs", url: "/jobs", category: "For Job Seekers" },
  { id: "2", text: "About Us", url: "/about", category: "Company" },
];

const mockTeamMembers = [{ id: "1", name: "John Doe", role: "CEO" }];
const mockAboutStats = [{ id: "1", label: "Projects", value: "100+" }];
const mockCompanyValues = [{ id: "1", title: "Integrity", description: "Be honest." }];
const mockPageContent = [{ id: "1", content_key: "hero_title", content: "Welcome" }];
const mockSupportTypes = [{ id: "1", title: "General", email: "test@test.com" }];
const mockOffices = [{ id: "1", city: "Zurich", address: "123 Main St" }];

const mockSupabase = {
  from: vi.fn((tableName: string) => {
    const handlers = {
      stats: {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockStats, error: null }),
      },
      companies: {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockCompanies, error: null }),
      },
      footer_links: {
        select: vi.fn().mockResolvedValue({ data: mockFooterLinks, error: null }),
      },
      team_members: {
        select: vi.fn().mockResolvedValue({ data: mockTeamMembers, error: null }),
      },
      about_page_stats: {
        select: vi.fn().mockResolvedValue({ data: mockAboutStats, error: null }),
      },
      company_values: {
        select: vi.fn().mockResolvedValue({ data: mockCompanyValues, error: null }),
      },
      page_content: {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockPageContent, error: null }),
      },
      support_types: {
        select: vi.fn().mockResolvedValue({ data: mockSupportTypes, error: null }),
      },
      offices: {
        select: vi.fn().mockResolvedValue({ data: mockOffices, error: null }),
      },
      contact_submissions: {
        insert: vi.fn().mockResolvedValue({ error: null }),
      },
      default: {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: {}, error: new Error("Table not found") }),
        eq: vi.fn().mockResolvedValue({ data: [], error: new Error("Table not found") }),
        insert: vi.fn().mockResolvedValue({ error: new Error("Table not found") }),
      }
    };
    return handlers[tableName] || handlers.default;
  }),
  auth: {
    signUp: vi.fn().mockResolvedValue({ data: { session: { access_token: "test-token" } }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { session: { access_token: "test-token" } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  }
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

  describe("GET /api/footer/links", () => {
    it("should return footer links", async () => {
      const response = await request(app).get("/api/footer/links");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        "For Job Seekers": [{ id: "1", text: "Browse Jobs", url: "/jobs" }],
        "Company": [{ id: "2", text: "About Us", url: "/about" }],
      });
    });
  });

  describe("GET /api/about", () => {
    it("should return about page data", async () => {
      const response = await request(app).get("/api/about");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        teamMembers: mockTeamMembers,
        stats: mockAboutStats,
        values: mockCompanyValues,
        content: { hero_title: "Welcome" },
      });
    });
  });

  describe("GET /api/contact", () => {
    it("should return contact page data", async () => {
      const response = await request(app).get("/api/contact");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        supportTypes: mockSupportTypes,
        offices: mockOffices,
      });
    });
  });

  describe("POST /api/contact/submit", () => {
    it("should return 200 for a valid submission", async () => {
      const validSubmission = {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "Test message",
        userType: "job-seeker",
      };
      const response = await request(app)
        .post("/api/contact/submit")
        .send(validSubmission);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Message sent successfully!" });
    });

    it("should return 400 for an invalid submission", async () => {
      const invalidSubmission = {
        name: "", // Invalid name
        email: "not-an-email",
        subject: "",
        message: "",
        userType: "job-seeker",
      };
      const response = await request(app)
        .post("/api/contact/submit")
        .send(invalidSubmission);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth", () => {
    it("should sign up a new user", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@example.com", password: "password123" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("session");
    });

    it("should sign in an existing user", async () => {
      const response = await request(app)
        .post("/api/auth/signin")
        .send({ email: "test@example.com", password: "password123" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("session");
    });

    it("should sign out a user", async () => {
      const response = await request(app).post("/api/auth/signout");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Signed out successfully" });
    });
  });
});
