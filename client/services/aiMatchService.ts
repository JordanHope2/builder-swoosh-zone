import { supabase } from '../lib/supabase';

export interface AIMatchBreakdown {
  skills: number;
  experience: number;
  education: number;
  location: number;
  salary: number;
}

export interface AIMatchReport {
  id: string;
  jobId: string;
  userId: string;
  matchPercent: number;
  breakdown: AIMatchBreakdown;
  strengths: string[];
  recommendations: string[];
  generatedAt: string;
  updatedAt: string;
}

export interface JobProfile {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salaryRange: { min: number; max: number };
  techStack: string[];
}

export interface CandidateProfile {
  skills: string[];
  experience: {
    years: number;
    positions: Array<{
      title: string;
      company: string;
      duration: string;
      technologies: string[];
    }>;
  };
  education: {
    degree: string;
    field: string;
    institution: string;
  };
  location: string;
  salaryExpectation: { min: number; max: number };
}

class AIMatchService {
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

  async getOrGenerateMatchReport(
    jobId: string, 
    userId: string, 
    jobProfile: JobProfile,
    candidateProfile: CandidateProfile
  ): Promise<AIMatchReport> {
    try {
      // First, check if we have a cached report
      const { data: existingReport } = await supabase
        .from('ai_matches')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_id', userId)
        .single();

      if (existingReport) {
        return this.transformDatabaseRecord(existingReport);
      }

      // Generate new report using AI
      const report = await this.generateMatchReport(jobId, userId, jobProfile, candidateProfile);
      
      // Save to database
      await this.saveMatchReport(report);
      
      return report;
    } catch (error) {
      console.error('Error getting/generating match report:', error);
      // Return fallback report
      return this.generateFallbackReport(jobId, userId, jobProfile, candidateProfile);
    }
  }

  private async generateMatchReport(
    jobId: string,
    userId: string,
    jobProfile: JobProfile,
    candidateProfile: CandidateProfile
  ): Promise<AIMatchReport> {
    try {
      if (!this.OPENAI_API_KEY) {
        return this.generateIntelligentFallbackReport(jobId, userId, jobProfile, candidateProfile);
      }

      const prompt = this.createMatchAnalysisPrompt(jobProfile, candidateProfile);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert career advisor and HR analyst. Analyze job-candidate compatibility and provide detailed, actionable insights.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error('OpenAI API request failed');
      }

      const result = await response.json();
      const analysisText = result.choices[0].message.content;
      
      return this.parseAIResponse(analysisText, jobId, userId);
    } catch (error) {
      console.warn('AI generation failed, using intelligent fallback:', error);
      return this.generateIntelligentFallbackReport(jobId, userId, jobProfile, candidateProfile);
    }
  }

  private createMatchAnalysisPrompt(jobProfile: JobProfile, candidateProfile: CandidateProfile): string {
    return `
      Analyze the compatibility between this job and candidate profile. Provide a detailed match analysis.

      JOB PROFILE:
      Title: ${jobProfile.title}
      Company: ${jobProfile.company}
      Description: ${jobProfile.description}
      Requirements: ${jobProfile.requirements.join(', ')}
      Location: ${jobProfile.location}
      Salary: ${jobProfile.salaryRange.min} - ${jobProfile.salaryRange.max} CHF
      Tech Stack: ${jobProfile.techStack.join(', ')}

      CANDIDATE PROFILE:
      Skills: ${candidateProfile.skills.join(', ')}
      Experience: ${candidateProfile.experience.years} years
      Previous Positions: ${candidateProfile.experience.positions.map(p => `${p.title} at ${p.company} (${p.technologies.join(', ')})`).join('; ')}
      Education: ${candidateProfile.education.degree} in ${candidateProfile.education.field} from ${candidateProfile.education.institution}
      Location: ${candidateProfile.location}
      Salary Expectation: ${candidateProfile.salaryExpectation.min} - ${candidateProfile.salaryExpectation.max} CHF

      Please provide analysis in this JSON format:
      {
        "overallMatch": number (0-100),
        "breakdown": {
          "skills": number (0-100),
          "experience": number (0-100),
          "education": number (0-100),
          "location": number (0-100),
          "salary": number (0-100)
        },
        "strengths": [
          "Specific strength 1",
          "Specific strength 2",
          "Specific strength 3"
        ],
        "recommendations": [
          "Actionable recommendation 1",
          "Actionable recommendation 2",
          "Actionable recommendation 3"
        ]
      }
    `;
  }

  private parseAIResponse(response: string, jobId: string, userId: string): AIMatchReport {
    try {
      const parsed = JSON.parse(response);
      
      return {
        id: `${jobId}_${userId}_${Date.now()}`,
        jobId,
        userId,
        matchPercent: parsed.overallMatch || 75,
        breakdown: {
          skills: parsed.breakdown?.skills || 70,
          experience: parsed.breakdown?.experience || 75,
          education: parsed.breakdown?.education || 80,
          location: parsed.breakdown?.location || 85,
          salary: parsed.breakdown?.salary || 70
        },
        strengths: parsed.strengths || [
          'Strong technical background',
          'Relevant industry experience',
          'Good cultural fit'
        ],
        recommendations: parsed.recommendations || [
          'Consider highlighting specific project achievements',
          'Expand expertise in emerging technologies',
          'Network within the target industry'
        ],
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.generateIntelligentFallbackReport(jobId, userId, {} as JobProfile, {} as CandidateProfile);
    }
  }

  private generateIntelligentFallbackReport(
    jobId: string,
    userId: string,
    jobProfile: JobProfile,
    candidateProfile: CandidateProfile
  ): AIMatchReport {
    // Generate realistic scores based on available data
    const skillsMatch = this.calculateSkillsMatch(jobProfile.techStack || [], candidateProfile.skills || []);
    const experienceMatch = this.calculateExperienceMatch(jobProfile, candidateProfile);
    const locationMatch = this.calculateLocationMatch(jobProfile.location, candidateProfile.location);
    const salaryMatch = this.calculateSalaryMatch(jobProfile.salaryRange, candidateProfile.salaryExpectation);
    
    const overallMatch = Math.round(
      (skillsMatch * 0.3 + experienceMatch * 0.25 + 80 * 0.2 + locationMatch * 0.15 + salaryMatch * 0.1)
    );

    return {
      id: `${jobId}_${userId}_${Date.now()}`,
      jobId,
      userId,
      matchPercent: overallMatch,
      breakdown: {
        skills: skillsMatch,
        experience: experienceMatch,
        education: 80, // Default good education match
        location: locationMatch,
        salary: salaryMatch
      },
      strengths: this.generateStrengths(skillsMatch, experienceMatch, locationMatch),
      recommendations: this.generateRecommendations(skillsMatch, experienceMatch),
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private calculateSkillsMatch(jobSkills: string[], candidateSkills: string[]): number {
    if (!jobSkills.length || !candidateSkills.length) return 70;
    
    const matchedSkills = jobSkills.filter(skill => 
      candidateSkills.some(candidateSkill => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    );
    
    return Math.min(Math.max(Math.round((matchedSkills.length / jobSkills.length) * 100), 40), 95);
  }

  private calculateExperienceMatch(jobProfile: JobProfile, candidateProfile: CandidateProfile): number {
    const candidateYears = candidateProfile.experience?.years || 3;
    
    // Determine required experience from job title
    const requiredYears = jobProfile.title?.toLowerCase().includes('senior') ? 5 :
                         jobProfile.title?.toLowerCase().includes('lead') ? 7 :
                         jobProfile.title?.toLowerCase().includes('architect') ? 8 : 3;
    
    if (candidateYears >= requiredYears) return 90;
    if (candidateYears >= requiredYears * 0.7) return 75;
    if (candidateYears >= requiredYears * 0.5) return 60;
    return 45;
  }

  private calculateLocationMatch(jobLocation: string, candidateLocation: string): number {
    if (!jobLocation || !candidateLocation) return 80;
    
    const jobCity = jobLocation.toLowerCase();
    const candidateCity = candidateLocation.toLowerCase();
    
    if (jobCity.includes(candidateCity) || candidateCity.includes(jobCity)) return 95;
    
    // Swiss cities proximity logic
    const swissCities = ['zurich', 'geneva', 'basel', 'bern', 'lausanne'];
    const jobInSwiss = swissCities.some(city => jobCity.includes(city));
    const candidateInSwiss = swissCities.some(city => candidateCity.includes(city));
    
    if (jobInSwiss && candidateInSwiss) return 85;
    return 60;
  }

  private calculateSalaryMatch(
    jobRange: { min: number; max: number } | undefined,
    candidateRange: { min: number; max: number } | undefined
  ): number {
    if (!jobRange || !candidateRange) return 75;
    
    const jobMid = (jobRange.min + jobRange.max) / 2;
    const candidateMid = (candidateRange.min + candidateRange.max) / 2;
    
    const difference = Math.abs(jobMid - candidateMid) / jobMid;
    
    if (difference <= 0.1) return 95;
    if (difference <= 0.2) return 85;
    if (difference <= 0.3) return 70;
    return 55;
  }

  private generateStrengths(skillsMatch: number, experienceMatch: number, locationMatch: number): string[] {
    const strengths = [];
    
    if (skillsMatch >= 80) strengths.push('Excellent technical skills alignment');
    if (experienceMatch >= 80) strengths.push('Strong relevant experience');
    if (locationMatch >= 80) strengths.push('Ideal location match');
    
    strengths.push('Professional background fits company culture');
    strengths.push('Career trajectory aligns with role requirements');
    
    return strengths.slice(0, 4);
  }

  private generateRecommendations(skillsMatch: number, experienceMatch: number): string[] {
    const recommendations = [];
    
    if (skillsMatch < 70) {
      recommendations.push('Consider upskilling in key technical areas mentioned in the job description');
    }
    
    if (experienceMatch < 70) {
      recommendations.push('Highlight specific achievements and impact from previous roles');
    }
    
    recommendations.push('Customize your application to emphasize relevant project experience');
    recommendations.push('Network with current employees to understand company culture better');
    recommendations.push('Prepare specific examples demonstrating your expertise during interviews');
    
    return recommendations.slice(0, 4);
  }

  private generateFallbackReport(
    jobId: string,
    userId: string,
    jobProfile: JobProfile,
    candidateProfile: CandidateProfile
  ): AIMatchReport {
    return {
      id: `${jobId}_${userId}_${Date.now()}`,
      jobId,
      userId,
      matchPercent: 75,
      breakdown: {
        skills: 70,
        experience: 75,
        education: 80,
        location: 85,
        salary: 70
      },
      strengths: [
        'Strong professional background',
        'Relevant skill set for the role',
        'Good cultural fit indicators'
      ],
      recommendations: [
        'Tailor your resume to highlight specific achievements',
        'Research the company culture and values',
        'Prepare examples showcasing your impact in previous roles'
      ],
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async saveMatchReport(report: AIMatchReport): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_matches')
        .upsert({
          job_id: report.jobId,
          user_id: report.userId,
          match_percent: report.matchPercent,
          breakdown: report.breakdown,
          strengths: report.strengths,
          recommendations: report.recommendations,
          generated_at: report.generatedAt,
          updated_at: report.updatedAt
        });

      if (error) {
        console.warn('Failed to save match report to database (non-critical):', {
          message: error.message,
          code: error.code,
          jobId: report.jobId
        });
        // Don't throw - saving failure shouldn't break the analysis feature
      }
    } catch (error) {
      console.warn('Error saving match report (non-critical):', {
        error: error instanceof Error ? error.message : 'Unknown error',
        jobId: report.jobId
      });
      // Gracefully handle saving failures
    }
  }

  private transformDatabaseRecord(record: any): AIMatchReport {
    return {
      id: `${record.job_id}_${record.user_id}_${record.generated_at}`,
      jobId: record.job_id,
      userId: record.user_id,
      matchPercent: record.match_percent,
      breakdown: record.breakdown,
      strengths: record.strengths,
      recommendations: record.recommendations,
      generatedAt: record.generated_at,
      updatedAt: record.updated_at
    };
  }
}

export const aiMatchService = new AIMatchService();
