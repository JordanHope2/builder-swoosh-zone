import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/supabase';

export interface ApplicationData {
  jobId: string;
  candidateId: string;
  coverLetter?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  availabilityDate?: string;
  customAnswers?: Record<string, string>;
}

export interface EmailNotificationData {
  recipientEmail: string;
  recipientName: string;
  templateType: 'application_submitted' | 'application_received' | 'application_status_update';
  templateData: Record<string, any>;
}

class ApplicationService {
  async submitApplication(applicationData: ApplicationData): Promise<{ success: boolean; applicationId?: string; error?: string }> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('User must be authenticated to submit applications');
      }

      // Get job details
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .select(`
          *,
          companies:company_id (
            id,
            name,
            email,
            logo_url
          )
        `)
        .eq('id', applicationData.jobId)
        .single();

      if (jobError || !job) {
        throw new Error('Job not found');
      }

      // Check if user already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', applicationData.jobId)
        .eq('candidate_id', user.id)
        .single();

      if (existingApplication) {
        throw new Error('You have already applied to this job');
      }

      // Get user profile for email notifications
      const { data: candidateProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Submit application
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .insert({
          job_id: applicationData.jobId,
          candidate_id: user.id,
          cover_letter: applicationData.coverLetter,
          portfolio_url: applicationData.portfolioUrl,
          expected_salary: applicationData.expectedSalary,
          availability_date: applicationData.availabilityDate,
          custom_answers: applicationData.customAnswers,
          status: 'pending',
          applied_at: new Date().toISOString()
        })
        .select()
        .single();

      if (applicationError) {
        throw new Error('Failed to submit application');
      }

      // Send email notifications
      await this.sendApplicationEmails({
        job,
        candidate: candidateProfile,
        application,
        companyEmail: job.companies?.email
      });

      // Create notification for candidate
      await this.createNotification({
        userId: user.id,
        type: 'success',
        title: 'Application Submitted Successfully',
        message: `Your application for ${job.title} at ${job.companies?.name} has been submitted.`,
        data: {
          jobId: job.id,
          applicationId: application.id
        }
      });

      // Create notification for company (if they have a user account)
      if (job.companies?.email) {
        const { data: companyUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', job.companies.email)
          .single();

        if (companyUser) {
          await this.createNotification({
            userId: companyUser.id,
            type: 'info',
            title: 'New Job Application',
            message: `${candidateProfile?.full_name || 'A candidate'} has applied for ${job.title}`,
            data: {
              jobId: job.id,
              applicationId: application.id,
              candidateId: user.id
            }
          });
        }
      }

      return {
        success: true,
        applicationId: application.id
      };

    } catch (error) {
      console.error('Application submission error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit application'
      };
    }
  }

  private async sendApplicationEmails({ job, candidate, application, companyEmail }: any) {
    try {
      // Send confirmation email to candidate
      if (candidate?.email) {
        await this.sendEmail({
          recipientEmail: candidate.email,
          recipientName: candidate.full_name || 'Candidate',
          templateType: 'application_submitted',
          templateData: {
            candidateName: candidate.full_name || 'Candidate',
            jobTitle: job.title,
            companyName: job.companies?.name || 'Company',
            applicationId: application.id,
            dashboardUrl: `${window.location.origin}/dashboard`,
            jobUrl: `${window.location.origin}/job/${job.id}`
          }
        });
      }

      // Send notification email to company
      if (companyEmail) {
        await this.sendEmail({
          recipientEmail: companyEmail,
          recipientName: job.companies?.name || 'Hiring Manager',
          templateType: 'application_received',
          templateData: {
            companyName: job.companies?.name || 'Company',
            candidateName: candidate?.full_name || 'A candidate',
            jobTitle: job.title,
            applicationId: application.id,
            candidateEmail: candidate?.email,
            coverLetter: application.cover_letter,
            portfolioUrl: application.portfolio_url,
            expectedSalary: application.expected_salary,
            availabilityDate: application.availability_date,
            reviewUrl: `${window.location.origin}/recruiter-dashboard?application=${application.id}`
          }
        });
      }
    } catch (error) {
      console.error('Failed to send application emails:', error);
      // Don't throw here as the application was successfully submitted
    }
  }

  private async sendEmail(emailData: EmailNotificationData) {
    try {
      // Use a serverless function or email service
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Email sending error:', error);
      // Fallback to local notification if email fails
      this.showLocalNotification('Email notification failed, but application was submitted successfully');
    }
  }

  private async createNotification({ userId, type, title, message, data }: {
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    data?: any;
  }) {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data,
          read: false,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }

  private showLocalNotification(message: string) {
    // Show browser notification if permissions granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('JobEqual', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }

  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status,
          status_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select(`
          *,
          jobs:job_id (
            title,
            companies:company_id (name)
          ),
          profiles:candidate_id (email, full_name)
        `)
        .single();

      if (error) throw error;

      // Send status update email to candidate
      if (data.profiles?.email) {
        await this.sendEmail({
          recipientEmail: data.profiles.email,
          recipientName: data.profiles.full_name || 'Candidate',
          templateType: 'application_status_update',
          templateData: {
            candidateName: data.profiles.full_name || 'Candidate',
            jobTitle: data.jobs?.title,
            companyName: data.jobs?.companies?.name,
            status: status,
            notes: notes,
            dashboardUrl: `${window.location.origin}/dashboard`
          }
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to update application status:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update status' };
    }
  }

  async getApplications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs:job_id (
            *,
            companies:company_id (*)
          )
        `)
        .eq('candidate_id', userId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return { success: true, applications: data };
    } catch (error) {
      console.error('Failed to get applications:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get applications' };
    }
  }
}

export const applicationService = new ApplicationService();
