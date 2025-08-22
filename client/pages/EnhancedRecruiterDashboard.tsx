import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Users,
  Briefcase,
  TrendingUp,
  Eye,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  MessageCircle,
  Send,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Share,
  Settings,
  Bell,
  Phone,
  Video,
  FileText,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  Zap,
  Building,
  Globe,
  Camera,
  Mail,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  PlayCircle,
  Pause,
  StopCircle,
  Archive,
  Copy,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  status:
    | "new"
    | "reviewed"
    | "screened"
    | "interviewed"
    | "offered"
    | "hired"
    | "rejected";
  appliedDate: string;
  salary: string;
  availability: string;
  resume: string;
  coverLetter?: string;
  portfolio?: string;
  linkedin?: string;
  rating?: number;
  notes?: string;
  interviews: Array<{
    date: string;
    type: "phone" | "video" | "onsite";
    interviewer: string;
    status: "scheduled" | "completed" | "cancelled";
    feedback?: string;
    rating?: number;
  }>;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "active" | "paused" | "closed" | "draft";
  applicants: number;
  views: number;
  posted: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applications: Candidate[];
  priority: "low" | "medium" | "high" | "urgent";
  responseRate: number;
  timeToFill?: number;
}

interface RecruiterMetrics {
  totalJobs: number;
  activeJobs: number;
  totalApplicants: number;
  hiredThisMonth: number;
  averageTimeToHire: number;
  responseRate: number;
  qualityScore: number;
  interviews: {
    scheduled: number;
    completed: number;
    pending: number;
  };
  pipeline: {
    [key: string]: number;
  };
  trends: {
    applications: Array<{ date: string; count: number }>;
    hires: Array<{ date: string; count: number }>;
    views: Array<{ date: string; count: number }>;
  };
}

const mockMetrics: RecruiterMetrics = {
  totalJobs: 12,
  activeJobs: 8,
  totalApplicants: 287,
  hiredThisMonth: 5,
  averageTimeToHire: 18,
  responseRate: 92,
  qualityScore: 4.3,
  interviews: {
    scheduled: 12,
    completed: 28,
    pending: 4,
  },
  pipeline: {
    new: 45,
    reviewed: 23,
    screened: 18,
    interviewed: 12,
    offered: 6,
    hired: 5,
    rejected: 89,
  },
  trends: {
    applications: [
      { date: "2024-01-01", count: 45 },
      { date: "2024-01-08", count: 52 },
      { date: "2024-01-15", count: 38 },
      { date: "2024-01-22", count: 67 },
    ],
    hires: [
      { date: "2024-01-01", count: 2 },
      { date: "2024-01-08", count: 1 },
      { date: "2024-01-15", count: 3 },
      { date: "2024-01-22", count: 2 },
    ],
    views: [
      { date: "2024-01-01", count: 234 },
      { date: "2024-01-08", count: 298 },
      { date: "2024-01-15", count: 187 },
      { date: "2024-01-22", count: 345 },
    ],
  },
};

const mockJobPostings: JobPosting[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "Zurich",
    type: "Full-time",
    status: "active",
    applicants: 47,
    views: 324,
    posted: "2024-01-15",
    deadline: "2024-02-15",
    salary: "CHF 120,000 - 140,000",
    description: "We are looking for a senior software engineer...",
    requirements: ["React", "TypeScript", "5+ years experience"],
    benefits: ["Health Insurance", "Remote Work", "Stock Options"],
    priority: "high",
    responseRate: 94,
    timeToFill: 21,
    applications: [
      {
        id: "1",
        name: "Jordan Hope",
        avatar: "👨‍💻",
        title: "Senior Software Engineer",
        location: "Zurich",
        experience: "5 years",
        skills: ["React", "Node.js", "TypeScript"],
        matchScore: 95,
        status: "interviewed",
        appliedDate: "2024-01-16",
        salary: "CHF 130,000",
        availability: "Immediately",
        resume: "jordan-hope-resume.pdf",
        linkedin: "linkedin.com/in/jordanhope",
        rating: 4.8,
        interviews: [
          {
            date: "2024-01-18",
            type: "video",
            interviewer: "Sarah Kim",
            status: "completed",
            feedback: "Excellent technical skills, good cultural fit",
            rating: 4.5,
          },
        ],
      },
      {
        id: "2",
        name: "Sarah Chen",
        avatar: "👩‍💻",
        title: "Full Stack Developer",
        location: "Geneva",
        experience: "4 years",
        skills: ["Vue.js", "Python", "AWS"],
        matchScore: 87,
        status: "reviewed",
        appliedDate: "2024-01-17",
        salary: "CHF 125,000",
        availability: "2 weeks notice",
        resume: "sarah-chen-resume.pdf",
        portfolio: "sarahchen.dev",
        interviews: [],
      },
    ],
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Basel",
    type: "Full-time",
    status: "active",
    applicants: 28,
    views: 156,
    posted: "2024-01-10",
    deadline: "2024-02-10",
    salary: "CHF 110,000 - 130,000",
    description: "Seeking an experienced product manager...",
    requirements: ["Product Management", "3+ years experience", "Agile"],
    benefits: ["Health Insurance", "Flexible Hours", "Learning Budget"],
    priority: "medium",
    responseRate: 88,
    applications: [],
  },
];

export default function EnhancedRecruiterDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(
    mockJobPostings[0],
  );
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("7d");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "jobs", label: "Job Posts", icon: Briefcase },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "interviews", label: "Interviews", icon: Video },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "screened":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
      case "interviewed":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200";
      case "offered":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200";
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 dark:bg-green-900/30";
    if (score >= 80) return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
    if (score >= 70)
      return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredJobs = mockJobPostings.filter((job) => {
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const allCandidates = mockJobPostings.flatMap((job) => job.applications);
  const filteredCandidates = allCandidates.filter((candidate) => {
    const matchesFilter =
      filterStatus === "all" || candidate.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white mb-2">
                Enhanced Recruiter Dashboard
              </h1>
              <p className="text-jobequal-text-muted dark:text-gray-400">
                Advanced recruiting tools and analytics at your fingertips
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-jobequal-neutral-dark dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  3
                </span>
              </button>
              <button className="flex items-center px-6 py-2 bg-jobequal-green text-white rounded-xl hover:bg-jobequal-green-hover transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-8"
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Active Jobs
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.activeJobs}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +15%
                </p>
              </div>
              <div className="w-12 h-12 bg-jobequal-green/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-jobequal-green" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Applicants
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.totalApplicants}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +22%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Hired
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.hiredThisMonth}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +2 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Avg. Time
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.averageTimeToHire}d
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  -3d faster
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Response Rate
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.responseRate}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +5%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Quality Score
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.qualityScore}/5
                </p>
                <div className="flex items-center mt-1">
                  {renderStars(mockMetrics.qualityScore)}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-2 mb-8"
        >
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-jobequal-green text-white shadow-md"
                    : "text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:bg-jobequal-neutral dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Pipeline Overview */}
                <div className="lg:col-span-2">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                      <Target className="w-6 h-6 mr-3 text-jobequal-green" />
                      Hiring Pipeline
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(mockMetrics.pipeline).map(
                        ([stage, count], index) => (
                          <div key={stage} className="text-center">
                            <div
                              className={`w-full h-20 rounded-xl flex items-center justify-center mb-3 relative overflow-hidden ${
                                index === 0
                                  ? "bg-blue-500"
                                  : index === 1
                                    ? "bg-yellow-500"
                                    : index === 2
                                      ? "bg-purple-500"
                                      : index === 3
                                        ? "bg-indigo-500"
                                        : index === 4
                                          ? "bg-orange-500"
                                          : index === 5
                                            ? "bg-green-500"
                                            : "bg-red-500"
                              }`}
                            >
                              <div className="text-2xl font-bold text-white">
                                {count}
                              </div>
                            </div>
                            <h4 className="font-semibold text-jobequal-text dark:text-white text-sm mb-1 capitalize">
                              {stage}
                            </h4>
                            <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                              {Math.round(
                                (count / mockMetrics.totalApplicants) * 100,
                              )}
                              %
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                      <Activity className="w-6 h-6 mr-3 text-jobequal-green" />
                      Recent Activity
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-4 bg-jobequal-green/5 rounded-xl">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-jobequal-text dark:text-white font-medium">
                            Candidate hired
                          </p>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                            Jordan Hope hired for Senior Software Engineer
                          </p>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            2 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-jobequal-text dark:text-white font-medium">
                            Interview scheduled
                          </p>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                            Video interview with Sarah Chen for Product Manager
                          </p>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            1 day ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-jobequal-text dark:text-white font-medium">
                            New job posted
                          </p>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                            UX Designer position published
                          </p>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            3 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Upcoming Interviews */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-jobequal-green" />
                      Upcoming Interviews
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-jobequal-green/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-jobequal-text dark:text-white text-sm">
                            Sarah Chen
                          </span>
                          <span className="text-xs text-jobequal-green font-medium">
                            Today 2:00 PM
                          </span>
                        </div>
                        <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                          Product Manager - Video Interview
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button className="px-2 py-1 bg-jobequal-green text-white rounded text-xs">
                            Join
                          </button>
                          <button className="px-2 py-1 border border-jobequal-green text-jobequal-green rounded text-xs">
                            Reschedule
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-jobequal-text dark:text-white text-sm">
                            Michael Johnson
                          </span>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Tomorrow 10:00 AM
                          </span>
                        </div>
                        <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                          DevOps Engineer - Phone Interview
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                            Prepare
                          </button>
                          <button className="px-2 py-1 border border-blue-600 text-blue-600 rounded text-xs">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                      Performance
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">
                            Interview-to-Hire Rate
                          </span>
                          <span className="text-sm font-bold text-jobequal-green">
                            68%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full"
                            style={{ width: "68%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">
                            Offer Acceptance
                          </span>
                          <span className="text-sm font-bold text-jobequal-green">
                            85%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">
                            Source Quality
                          </span>
                          <span className="text-sm font-bold text-jobequal-green">
                            4.3/5
                          </span>
                        </div>
                        <div className="flex">{renderStars(4.3)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center p-3 bg-jobequal-green/10 hover:bg-jobequal-green/20 rounded-xl transition-colors">
                        <Plus className="w-5 h-5 mr-3 text-jobequal-green" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Post New Job
                        </span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                        <Download className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Export Report
                        </span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                        <MessageCircle className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Bulk Message
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0">
                    Job Posts ({mockJobPostings.length})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="all">All Jobs</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button className="flex items-center px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      New Job
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-jobequal-text dark:text-white mr-3">
                              {job.title}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}
                            >
                              {job.status}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize border ${getPriorityColor(job.priority)}`}
                            >
                              {job.priority}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.department}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.type}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Posted {new Date(job.posted).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6">
                            <span className="text-lg font-bold text-jobequal-green">
                              {job.salary}
                            </span>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {job.applicants} applications
                            </span>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {job.views} views
                            </span>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {job.responseRate}% response rate
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-red-500 dark:text-gray-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "candidates" && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0">
                    Candidates ({allCandidates.length})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted" />
                      <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="all">All Candidates</option>
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="screened">Screened</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="offered">Offered</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-jobequal-green text-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start space-x-4 flex-1 mb-4 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-xl">
                            {candidate.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mr-3">
                                {candidate.name}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(candidate.status)}`}
                              >
                                {candidate.status}
                              </span>
                              <div className="ml-3 flex items-center">
                                <Target className="w-4 h-4 text-jobequal-green mr-1" />
                                <span className="text-sm font-medium text-jobequal-green">
                                  {candidate.matchScore}% Match
                                </span>
                              </div>
                            </div>
                            <p className="text-jobequal-text-muted dark:text-gray-400 mb-2">
                              {candidate.title}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {candidate.location}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {candidate.experience}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {candidate.salary}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Applied{" "}
                                {new Date(
                                  candidate.appliedDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills
                                .slice(0, 4)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green rounded-full text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {candidate.skills.length > 4 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                  +{candidate.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-jobequal-green border border-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors">
                            View Profile
                          </button>
                          <button className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors">
                            Contact
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "interviews" && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Video className="w-6 h-6 mr-3 text-jobequal-green" />
                    Interview Management
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {mockMetrics.interviews.scheduled}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Scheduled
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {mockMetrics.interviews.completed}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Completed
                        </div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {mockMetrics.interviews.pending}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Pending
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {mockJobPostings.flatMap((job) =>
                        job.applications.flatMap((candidate) =>
                          candidate.interviews.map((interview) => (
                            <div
                              key={`${candidate.id}-${interview.date}`}
                              className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-lg">
                                    {candidate.avatar}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-jobequal-text dark:text-white">
                                      {candidate.name}
                                    </h4>
                                    <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                      {job.title}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}
                                >
                                  {interview.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-jobequal-text-muted dark:text-gray-400">
                                    Date & Time:
                                  </span>
                                  <p className="font-medium text-jobequal-text dark:text-white">
                                    {new Date(interview.date).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-jobequal-text-muted dark:text-gray-400">
                                    Type:
                                  </span>
                                  <p className="font-medium text-jobequal-text dark:text-white capitalize">
                                    {interview.type}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-jobequal-text-muted dark:text-gray-400">
                                    Interviewer:
                                  </span>
                                  <p className="font-medium text-jobequal-text dark:text-white">
                                    {interview.interviewer}
                                  </p>
                                </div>
                                {interview.rating && (
                                  <div>
                                    <span className="text-jobequal-text-muted dark:text-gray-400">
                                      Rating:
                                    </span>
                                    <div className="flex items-center">
                                      {renderStars(interview.rating)}
                                      <span className="ml-1 text-sm font-medium text-jobequal-text dark:text-white">
                                        {interview.rating}/5
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              {interview.feedback && (
                                <div className="mt-4 p-3 bg-jobequal-green/5 rounded-lg">
                                  <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                                    Feedback:
                                  </span>
                                  <p className="text-sm text-jobequal-text dark:text-white mt-1">
                                    {interview.feedback}
                                  </p>
                                </div>
                              )}
                              <div className="flex gap-2 mt-4">
                                {interview.status === "scheduled" && (
                                  <>
                                    <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                                      Join Interview
                                    </button>
                                    <button className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                      Reschedule
                                    </button>
                                  </>
                                )}
                                {interview.status === "completed" && (
                                  <button className="px-3 py-1 border border-jobequal-green text-jobequal-green rounded text-sm hover:bg-jobequal-green hover:text-white transition-colors">
                                    View Details
                                  </button>
                                )}
                              </div>
                            </div>
                          )),
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                      Schedule Interview
                    </h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center p-3 bg-jobequal-green/10 hover:bg-jobequal-green/20 rounded-xl transition-colors">
                        <Video className="w-5 h-5 mr-3 text-jobequal-green" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Video Interview
                        </span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                        <Phone className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Phone Interview
                        </span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                        <Building className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          On-site Interview
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                      Interview Tools
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center p-2 text-left hover:bg-jobequal-neutral dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <FileText className="w-4 h-4 mr-3 text-jobequal-green" />
                        <span className="text-jobequal-text dark:text-white text-sm">
                          Question Templates
                        </span>
                      </button>
                      <button className="w-full flex items-center p-2 text-left hover:bg-jobequal-neutral dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Target className="w-4 h-4 mr-3 text-blue-600" />
                        <span className="text-jobequal-text dark:text-white text-sm">
                          Scoring Rubrics
                        </span>
                      </button>
                      <button className="w-full flex items-center p-2 text-left hover:bg-jobequal-neutral dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Camera className="w-4 h-4 mr-3 text-purple-600" />
                        <span className="text-jobequal-text dark:text-white text-sm">
                          Recording Settings
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-jobequal-green" />
                    Hiring Trends
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-jobequal-green/5 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">
                        Time to Fill
                      </span>
                      <span className="text-xl font-bold text-jobequal-green">
                        {mockMetrics.averageTimeToHire} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">
                        Cost per Hire
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        CHF 2,340
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">
                        Source Effectiveness
                      </span>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        78%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <PieChart className="w-6 h-6 mr-3 text-jobequal-green" />
                    Source Performance
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        JobEqual Platform
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-jobequal-green h-2 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          65%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        Referrals
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "25%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          25%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        Direct Applications
                      </span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: "10%" }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          10%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-jobequal-green" />
                    Recruiter Preferences
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                        Email Notifications
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
                          />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">
                            New applications
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
                          />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">
                            Interview reminders
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
                          />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">
                            Weekly reports
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                        Auto-Response Settings
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
                          />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">
                            Send acknowledgment emails
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
                          />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">
                            Auto-schedule screening calls
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-jobequal-green" />
                    Integration Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-jobequal-text dark:text-white">
                            Google Calendar
                          </h4>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            Sync interview schedules
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Connected
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                          <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-jobequal-text dark:text-white">
                            Zoom
                          </h4>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            Video interviews
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Connected
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-jobequal-text dark:text-white">
                            Slack
                          </h4>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            Team notifications
                          </p>
                        </div>
                      </div>
                      <button className="px-3 py-1 border border-jobequal-green text-jobequal-green rounded-full text-xs font-medium hover:bg-jobequal-green hover:text-white transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-2xl">
                    {selectedCandidate.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white">
                      {selectedCandidate.name}
                    </h2>
                    <p className="text-jobequal-text-muted dark:text-gray-400">
                      {selectedCandidate.title}
                    </p>
                    <div className="flex items-center mt-2">
                      <Target className="w-4 h-4 text-jobequal-green mr-1" />
                      <span className="text-sm font-medium text-jobequal-green">
                        {selectedCandidate.matchScore}% Match
                      </span>
                      {selectedCandidate.rating && (
                        <div className="flex items-center ml-4">
                          {renderStars(selectedCandidate.rating)}
                          <span className="ml-1 text-sm text-jobequal-text dark:text-white">
                            {selectedCandidate.rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-jobequal-text-muted dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-jobequal-text-muted dark:text-gray-400">
                      Location:
                    </span>
                    <p className="font-medium text-jobequal-text dark:text-white">
                      {selectedCandidate.location}
                    </p>
                  </div>
                  <div>
                    <span className="text-jobequal-text-muted dark:text-gray-400">
                      Experience:
                    </span>
                    <p className="font-medium text-jobequal-text dark:text-white">
                      {selectedCandidate.experience}
                    </p>
                  </div>
                  <div>
                    <span className="text-jobequal-text-muted dark:text-gray-400">
                      Salary Expectation:
                    </span>
                    <p className="font-medium text-jobequal-text dark:text-white">
                      {selectedCandidate.salary}
                    </p>
                  </div>
                  <div>
                    <span className="text-jobequal-text-muted dark:text-gray-400">
                      Availability:
                    </span>
                    <p className="font-medium text-jobequal-text dark:text-white">
                      {selectedCandidate.availability}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-jobequal-text dark:text-white mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCandidate.interviews.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-jobequal-text dark:text-white mb-3">
                      Interview History
                    </h3>
                    <div className="space-y-3">
                      {selectedCandidate.interviews.map((interview, index) => (
                        <div
                          key={index}
                          className="p-4 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-jobequal-text dark:text-white">
                              {new Date(interview.date).toLocaleDateString()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}
                            >
                              {interview.status}
                            </span>
                          </div>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-2">
                            {interview.type} with {interview.interviewer}
                          </p>
                          {interview.feedback && (
                            <p className="text-sm text-jobequal-text dark:text-white">
                              {interview.feedback}
                            </p>
                          )}
                          {interview.rating && (
                            <div className="flex items-center mt-2">
                              {renderStars(interview.rating)}
                              <span className="ml-1 text-sm text-jobequal-text dark:text-white">
                                {interview.rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6 border-t border-jobequal-neutral-dark dark:border-gray-600">
                  <button className="flex-1 bg-jobequal-green text-white py-3 px-4 rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors">
                    Schedule Interview
                  </button>
                  <button className="flex-1 border border-jobequal-green text-jobequal-green py-3 px-4 rounded-xl font-semibold hover:bg-jobequal-green hover:text-white transition-colors">
                    Send Message
                  </button>
                  <button className="px-4 py-3 border border-jobequal-neutral-dark dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
