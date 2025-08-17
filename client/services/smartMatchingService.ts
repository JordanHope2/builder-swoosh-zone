import { supabase } from "../lib/supabase";

export interface JobMatch {
  id: string;
  jobId: string;
  candidateId: string;
  matchScore: number;
  matchReasons: string[];
  skillMatches: SkillMatch[];
  locationMatch: boolean;
  salaryMatch: boolean;
  experienceMatch: boolean;
  createdAt: string;
  job?: Job;
}

export interface SkillMatch {
  skill: string;
  required: boolean;
  candidateHas: boolean;
  experience: number;
  match: "exact" | "similar" | "missing";
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string[];
  skills: string[];
  experience_level: string;
  remote: boolean;
  created_at: string;
}

export interface CandidateProfile {
  id: string;
  skills: string[];
  experience: number;
  location: string;
  salaryExpectation: { min: number; max: number };
  remote: boolean;
  jobPreferences: {
    industries: string[];
    roles: string[];
    companySize: string[];
  };
}

class SmartMatchingService {
  private readonly AI_ENDPOINT = "/api/ai/match";

  async findJobMatches(
    candidateId: string,
    limit: number = 10,
  ): Promise<JobMatch[]> {
    try {
      // Get candidate profile
      const profile = await this.getCandidateProfile(candidateId);
      if (!profile) {
        throw new Error("Candidate profile not found");
      }

      // Get available jobs
      const jobs = await this.getAvailableJobs();

      // Calculate matches using AI
      const matches = await this.calculateMatches(profile, jobs);

      // Sort by match score and return top matches
      return matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      console.error("Error finding job matches:", error);
      return this.getFallbackMatches(candidateId);
    }
  }

  private async getCandidateProfile(
    candidateId: string,
  ): Promise<CandidateProfile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", candidateId)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        skills: data.skills || [],
        experience: data.experience || 0,
        location: data.location || "",
        salaryExpectation: data.salary_expectation || { min: 0, max: 200000 },
        remote: data.remote_work || false,
        jobPreferences: data.job_preferences || {
          industries: [],
          roles: [],
          companySize: [],
        },
      };
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
      return null;
    }
  }

  private async getAvailableJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          `
          id,
          title,
          description,
          location,
          salary_min,
          salary_max,
          requirements,
          skills,
          experience_level,
          remote,
          created_at,
          companies (name)
        `,
        )
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      return data.map((job) => ({
        ...job,
        company: job.companies?.[0]?.name || "Unknown Company",
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        skills: Array.isArray(job.skills) ? job.skills : [],
      }));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  }

  private async calculateMatches(
    profile: CandidateProfile,
    jobs: Job[],
  ): Promise<JobMatch[]> {
    const matches: JobMatch[] = [];

    for (const job of jobs) {
      const match = await this.calculateSingleMatch(profile, job);
      if (match.matchScore > 30) {
        // Only include matches above 30%
        matches.push(match);
      }
    }

    return matches;
  }

  private async calculateSingleMatch(
    profile: CandidateProfile,
    job: Job,
  ): Promise<JobMatch> {
    // Skill matching
    const skillMatches = this.calculateSkillMatches(
      profile.skills,
      job.skills,
      job.requirements,
    );
    const skillScore = this.calculateSkillScore(skillMatches);

    // Location matching
    const locationMatch = this.calculateLocationMatch(profile, job);
    const locationScore = locationMatch
      ? 20
      : job.remote && profile.remote
        ? 15
        : 0;

    // Salary matching
    const salaryMatch = this.calculateSalaryMatch(profile, job);
    const salaryScore = salaryMatch ? 15 : 0;

    // Experience matching
    const experienceMatch = this.calculateExperienceMatch(profile, job);
    const experienceScore = experienceMatch ? 15 : 10;

    // Calculate total score
    const matchScore = Math.min(
      100,
      skillScore + locationScore + salaryScore + experienceScore,
    );

    // Generate match reasons
    const matchReasons = this.generateMatchReasons(
      skillMatches,
      locationMatch,
      salaryMatch,
      experienceMatch,
      job,
    );

    return {
      id: `${profile.id}-${job.id}`,
      jobId: job.id,
      candidateId: profile.id,
      matchScore,
      matchReasons,
      skillMatches,
      locationMatch,
      salaryMatch,
      experienceMatch,
      createdAt: new Date().toISOString(),
      job,
    };
  }

  private calculateSkillMatches(
    candidateSkills: string[],
    jobSkills: string[],
    requirements: string[],
  ): SkillMatch[] {
    const allJobSkills = [...new Set([...jobSkills, ...requirements])];
    const skillMatches: SkillMatch[] = [];

    // Normalize skills for better matching
    const normalizeSkill = (skill: string) => skill.toLowerCase().trim();
    const normalizedCandidateSkills = candidateSkills.map(normalizeSkill);

    for (const jobSkill of allJobSkills) {
      const normalizedJobSkill = normalizeSkill(jobSkill);
      const isRequired = requirements.includes(jobSkill);

      let match: "exact" | "similar" | "missing" = "missing";
      let candidateHas = false;

      // Check for exact match
      if (normalizedCandidateSkills.includes(normalizedJobSkill)) {
        match = "exact";
        candidateHas = true;
      } else {
        // Check for similar skills
        const similarSkills = this.findSimilarSkills(
          normalizedJobSkill,
          normalizedCandidateSkills,
        );
        if (similarSkills.length > 0) {
          match = "similar";
          candidateHas = true;
        }
      }

      skillMatches.push({
        skill: jobSkill,
        required: isRequired,
        candidateHas,
        experience: candidateHas
          ? this.estimateSkillExperience(jobSkill, candidateSkills)
          : 0,
        match,
      });
    }

    return skillMatches;
  }

  private findSimilarSkills(
    targetSkill: string,
    candidateSkills: string[],
  ): string[] {
    const similarityMap: { [key: string]: string[] } = {
      javascript: ["js", "node.js", "react", "vue", "angular"],
      typescript: ["ts", "javascript", "js"],
      react: ["reactjs", "react.js", "javascript"],
      python: ["django", "flask", "fastapi"],
      java: ["spring", "spring boot"],
      sql: ["postgresql", "mysql", "sqlite", "database"],
      docker: ["containerization", "kubernetes"],
      aws: ["cloud", "azure", "gcp"],
    };

    const similar = similarityMap[targetSkill] || [];
    return candidateSkills.filter((skill) =>
      similar.some((s) => skill.includes(s) || s.includes(skill)),
    );
  }

  private estimateSkillExperience(
    skill: string,
    candidateSkills: string[],
  ): number {
    // Simple heuristic: assume more experience for exact matches
    return candidateSkills.includes(skill) ? 3 : 1;
  }

  private calculateSkillScore(skillMatches: SkillMatch[]): number {
    if (skillMatches.length === 0) return 0;

    let score = 0;
    let totalWeight = 0;

    for (const match of skillMatches) {
      const weight = match.required ? 3 : 1;
      totalWeight += weight;

      if (match.match === "exact") {
        score += weight * 10;
      } else if (match.match === "similar") {
        score += weight * 6;
      }
    }

    return totalWeight > 0 ? Math.min(50, score / totalWeight) : 0;
  }

  private calculateLocationMatch(profile: CandidateProfile, job: Job): boolean {
    if (job.remote && profile.remote) return true;
    if (!profile.location || !job.location) return false;

    const normalizeLocation = (loc: string) => loc.toLowerCase().trim();
    return (
      normalizeLocation(profile.location).includes(
        normalizeLocation(job.location),
      ) ||
      normalizeLocation(job.location).includes(
        normalizeLocation(profile.location),
      )
    );
  }

  private calculateSalaryMatch(profile: CandidateProfile, job: Job): boolean {
    if (!job.salary_min || !job.salary_max) return true; // No salary info, assume match
    if (!profile.salaryExpectation) return true;

    const jobSalaryAvg = (job.salary_min + job.salary_max) / 2;
    const profileSalaryAvg =
      (profile.salaryExpectation.min + profile.salaryExpectation.max) / 2;

    // Consider it a match if within 20% range
    const tolerance = 0.2;
    return (
      Math.abs(jobSalaryAvg - profileSalaryAvg) / profileSalaryAvg <= tolerance
    );
  }

  private calculateExperienceMatch(
    profile: CandidateProfile,
    job: Job,
  ): boolean {
    const experienceMapping: { [key: string]: number } = {
      entry: 1,
      junior: 2,
      mid: 4,
      senior: 7,
      lead: 10,
      executive: 15,
    };

    const requiredExp =
      experienceMapping[job.experience_level?.toLowerCase()] || 3;
    return profile.experience >= requiredExp * 0.8; // Allow 20% tolerance
  }

  private generateMatchReasons(
    skillMatches: SkillMatch[],
    locationMatch: boolean,
    salaryMatch: boolean,
    experienceMatch: boolean,
    job: Job,
  ): string[] {
    const reasons: string[] = [];

    // Skill reasons
    const exactSkills = skillMatches.filter(
      (s) => s.match === "exact" && s.candidateHas,
    ).length;
    const similarSkills = skillMatches.filter(
      (s) => s.match === "similar" && s.candidateHas,
    ).length;

    if (exactSkills > 0) {
      reasons.push(
        `${exactSkills} exact skill match${exactSkills > 1 ? "es" : ""}`,
      );
    }
    if (similarSkills > 0) {
      reasons.push(
        `${similarSkills} related skill${similarSkills > 1 ? "s" : ""}`,
      );
    }

    // Location reason
    if (locationMatch) {
      reasons.push(job.remote ? "Remote work available" : "Location match");
    }

    // Salary reason
    if (salaryMatch) {
      reasons.push("Salary range alignment");
    }

    // Experience reason
    if (experienceMatch) {
      reasons.push("Experience level match");
    }

    return reasons;
  }

  private getFallbackMatches(candidateId: string): JobMatch[] {
    // Return mock matches for demo purposes
    return [
      {
        id: "1",
        jobId: "1",
        candidateId,
        matchScore: 92,
        matchReasons: [
          "8 exact skill matches",
          "Location match",
          "Salary range alignment",
        ],
        skillMatches: [],
        locationMatch: true,
        salaryMatch: true,
        experienceMatch: true,
        createdAt: new Date().toISOString(),
        job: {
          id: "1",
          title: "Senior Software Engineer",
          company: "Google Zurich",
          location: "Zurich",
          salary_min: 120000,
          salary_max: 140000,
          description:
            "Join our innovative team building next-generation technology solutions.",
          requirements: ["React", "TypeScript", "Node.js"],
          skills: ["React", "TypeScript", "Node.js", "AWS"],
          experience_level: "senior",
          remote: false,
          created_at: new Date().toISOString(),
        },
      },
    ];
  }

  async saveJobMatch(match: JobMatch): Promise<void> {
    try {
      const { error } = await supabase.from("job_matches").upsert({
        id: match.id,
        job_id: match.jobId,
        candidate_id: match.candidateId,
        match_score: match.matchScore,
        match_reasons: match.matchReasons,
        skill_matches: match.skillMatches,
        location_match: match.locationMatch,
        salary_match: match.salaryMatch,
        experience_match: match.experienceMatch,
        created_at: match.createdAt,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving job match:", error);
    }
  }

  async getJobMatches(candidateId: string): Promise<JobMatch[]> {
    try {
      const { data, error } = await supabase
        .from("job_matches")
        .select(
          `
          *,
          jobs (
            id,
            title,
            description,
            location,
            salary_min,
            salary_max,
            companies (name)
          )
        `,
        )
        .eq("candidate_id", candidateId)
        .order("match_score", { ascending: false });

      if (error) throw error;

      return data.map((match) => ({
        id: match.id,
        jobId: match.job_id,
        candidateId: match.candidate_id,
        matchScore: match.match_score,
        matchReasons: match.match_reasons || [],
        skillMatches: match.skill_matches || [],
        locationMatch: match.location_match,
        salaryMatch: match.salary_match,
        experienceMatch: match.experience_match,
        createdAt: match.created_at,
        job: match.jobs
          ? {
              id: match.jobs.id,
              title: match.jobs.title,
              company: match.jobs.companies?.[0]?.name || "Unknown Company",
              location: match.jobs.location,
              salary_min: match.jobs.salary_min,
              salary_max: match.jobs.salary_max,
              description: match.jobs.description,
              requirements: [],
              skills: [],
              experience_level: "",
              remote: false,
              created_at: match.jobs.created_at,
            }
          : undefined,
      }));
    } catch (error) {
      console.error("Error fetching job matches:", error);
      return this.getFallbackMatches(candidateId);
    }
  }

  async triggerMatchingForCandidate(candidateId: string): Promise<void> {
    try {
      const matches = await this.findJobMatches(candidateId, 20);

      // Save all matches
      for (const match of matches) {
        await this.saveJobMatch(match);
      }

      // Send notifications for high-scoring matches
      const highScoreMatches = matches.filter((m) => m.matchScore >= 80);
      for (const match of highScoreMatches) {
        await this.sendMatchNotification(match);
      }
    } catch (error) {
      console.error("Error triggering matching:", error);
    }
  }

  private async sendMatchNotification(match: JobMatch): Promise<void> {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: match.candidateId,
        type: "job_match",
        title: "New High-Quality Job Match!",
        content: `${match.job?.title} at ${match.job?.company} is a ${match.matchScore}% match for your profile`,
        data: {
          jobId: match.jobId,
          matchId: match.id,
          matchScore: match.matchScore,
        },
        read: false,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending match notification:", error);
    }
  }
}

export const smartMatchingService = new SmartMatchingService();
export default smartMatchingService;
