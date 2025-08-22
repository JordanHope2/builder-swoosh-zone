import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  Users,
  Briefcase,
  TrendingUp,
  Eye,
  Plus,
  MoreVertical,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Helper function to make authenticated API requests
const fetchFromApi = async (endpoint: string, token: string | undefined) => {
  if (!token) throw new Error("No auth token provided.");
  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch data.");
  return res.json();
};

// --- Sub-components ---

const DashboardStats = ({ stats }: { stats: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
  >
    <StatCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} />
    <StatCard title="Total Applicants" value={stats.totalApplicants} icon={Users} />
    {/* Add more stats as the API provides them */}
  </motion.div>
);

const StatCard = ({ title, value, icon: Icon }: { title: string, value: number, icon: React.ElementType }) => (
  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
    <Icon className="w-8 h-8 text-blue-600 mb-4" />
    <div className="text-3xl font-bold text-jobequal-text dark:text-white mb-1">{value}</div>
    <div className="text-sm text-jobequal-text-muted dark:text-gray-400">{title}</div>
  </div>
);

const HiringPipeline = ({ pipeline }: { pipeline: Record<string, number> }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-8"
  >
    <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6">Hiring Pipeline</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Object.entries(pipeline).map(([status, count]) => (
        <div key={status} className="text-center">
          <div className="bg-blue-500 rounded-xl flex items-center justify-center h-24 mb-3 relative overflow-hidden">
            <div className="text-3xl font-bold text-white">{count}</div>
          </div>
          <h4 className="font-semibold text-jobequal-text dark:text-white text-sm capitalize">{status}</h4>
        </div>
      ))}
    </div>
  </motion.div>
);

const ActiveJobsList = ({ jobs }: { jobs: any[] }) => (
  <div className="lg:col-span-2">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-jobequal-text dark:text-white">Active Job Postings</h3>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">{job.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-jobequal-green">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="font-medium">{job.applicantCount} applicants</span>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);


// --- Main Component ---

export default function RecruiterDashboard() {
  const { session } = useAuth();
  const token = session?.access_token;

  const { data, isLoading, error } = useQuery({
    queryKey: ["recruiterDashboard"],
    queryFn: () => fetchFromApi("/api/dashboard/recruiter", token),
    enabled: !!token,
  });

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin" /></div>;
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-500 flex items-center justify-center space-x-2">
          <AlertCircle />
          <span>Error loading dashboard data. Please try again later.</span>
        </div>
      );
    }

    if (!data) {
        return <div className="text-center py-10 text-jobequal-text-muted">No dashboard data available.</div>;
    }

    return (
      <>
        <DashboardStats stats={data.stats} />
        <HiringPipeline pipeline={data.pipeline} />
        <div className="grid lg:grid-cols-3 gap-8">
          <ActiveJobsList jobs={data.jobs} />
          {/* Placeholder for other components like Candidate Details or Quick Actions */}
        </div>
      </>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">Recruiter Dashboard</h1>
            <p className="text-jobequal-text-muted dark:text-gray-300">
              Manage your job postings and track candidate pipeline
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
            </button>
          </div>
        </motion.div>

        {renderContent()}

      </div>
    </main>
  );
}
