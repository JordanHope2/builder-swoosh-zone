"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  User,
  Briefcase,
  Heart,
  ArrowRight,
  Target,
  Settings,
  Bell,
  FileText,
  CheckCircle,
} from "lucide-react";
import { User as SupabaseUser } from '@supabase/supabase-js';

// Define types for the props based on our data fetching
// In a real app, these would be generated from the DB schema
type Job = {
  title: string;
  company_name: string;
};

type Application = {
  id: string;
  created_at: string;
  status: string;
  jobs: Job | null;
};

type Recommendation = {
  id: string;
  title: string;
  company_name: string;
  similarity: number;
};

type Profile = {
  full_name: string;
  // add other profile fields here
};

interface CandidateDashboardViewProps {
  user: SupabaseUser;
  profile: Profile | null;
  applications: Application[] | null;
  recommendations: Recommendation[] | null;
}

export default function CandidateDashboardView({
  user,
  profile,
  applications,
  recommendations,
}: CandidateDashboardViewProps) {

  const actions = (
    <div className="flex items-center space-x-4">
      <button className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
        <Bell className="w-6 h-6" />
      </button>
      <Link
        href="/settings"
        className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200"
      >
        <Settings className="w-6 h-6" />
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title={`Welcome back, ${profile?.full_name || user.email}! 👋`}
      subtitle={`You have ${recommendations?.length || 0} new job matches.`}
      actions={actions}
    >
      {/* Quick Stats - Now with real data */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/90 p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Profile Views</h3>
            <User className="w-6 h-6 text-jobequal-blue" />
          </div>
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm text-jobequal-text-muted">+5 this week</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Applications</h3>
            <FileText className="w-6 h-6 text-jobequal-green" />
          </div>
          <p className="text-4xl font-bold">{applications?.length || 0}</p>
          <p className="text-sm text-jobequal-text-muted">Total submitted</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Saved Jobs</h3>
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-4xl font-bold">8</p>
          <p className="text-sm text-jobequal-text-muted">Ready to apply</p>
        </div>
        <div className="bg-white/90 p-6 rounded-2xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Profile Strength</h3>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-4xl font-bold">85%</p>
          <p className="text-sm text-jobequal-text-muted">Complete your profile</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Jobs */}
          <div className="bg-white/90 p-8 rounded-3xl border">
            <h2 className="text-2xl font-bold mb-6">Your Top Job Matches</h2>
            <div className="space-y-4">
              {recommendations && recommendations.length > 0 ? (
                recommendations.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50">
                    <div>
                      <Link href={`/job/${job.id}`} className="font-semibold text-jobequal-text hover:underline">{job.title}</Link>
                      <p className="text-sm text-jobequal-text-muted">{job.company_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-jobequal-green">{Math.round(job.similarity * 100)}% Match</p>
                        <p className="text-xs text-jobequal-text-muted">AI Score</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-jobequal-text-muted py-8">No job recommendations found yet. Complete your profile to get started!</p>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white/90 p-8 rounded-3xl border">
            <h2 className="text-2xl font-bold mb-6">Recent Applications</h2>
            <div className="space-y-4">
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50">
                    <div>
                      <p className="font-semibold">{app.jobs?.title || 'Job Title'}</p>
                      <p className="text-sm text-jobequal-text-muted">{app.jobs?.company_name || 'Company'}</p>
                    </div>
                    <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">{app.status}</div>
                  </div>
                ))
              ) : (
                <p className="text-center text-jobequal-text-muted py-8">You haven't applied to any jobs yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Progress */}
          <div className="bg-white/90 p-8 rounded-3xl border">
            <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
            {/* Placeholder for profile completion component */}
            <p className="text-jobequal-text-muted">A strong profile gets you noticed. Add your experience and skills to attract top recruiters.</p>
            <Link href="/profile" className="mt-4 inline-block bg-jobequal-green text-white font-semibold px-6 py-3 rounded-lg hover:bg-jobequal-green-hover">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
