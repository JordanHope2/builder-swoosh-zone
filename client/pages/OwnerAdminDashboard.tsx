import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  BarChart3,
  Users,
  Building,
  TrendingUp,
  DollarSign,
  Eye,
  Activity,
  Shield,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  MapPin,
  Calendar,
  Star,
  Award,
  Target,
  Zap,
  PieChart,
  LineChart,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  Image,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Share2,
  Copy,
  Archive,
  Lock,
  Unlock,
  Key,
  UserPlus,
  Crown,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  DashboardContainer,
  StatsCard,
  SectionHeader,
  ActionButton,
  DashboardCard,
  LoadingSpinner,
  fadeInUp,
  slideInLeft,
} from "../components/ui/unified-dashboard";
import SecurityUtils from "../lib/security";

interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  activeCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  monthlyRevenue: number;
  subscriptionRevenue: number;
  avgSessionDuration: string;
  conversionRate: number;
  churnRate: number;
  nps: number;
  platformHealth: number;
  systemUptime: number;
  avgResponseTime: number;
}

interface UserStats {
  candidates: number;
  recruiters: number;
  companies: number;
  admins: number;
  newSignups: number;
  activeToday: number;
  premiumUsers: number;
}

interface SystemHealth {
  server: {
    status: "healthy" | "warning" | "critical";
    cpu: number;
    memory: number;
    disk: number;
    uptime: string;
  };
  database: {
    status: "healthy" | "warning" | "critical";
    connections: number;
    queryTime: number;
    size: string;
  };
  api: {
    status: "healthy" | "warning" | "critical";
    responseTime: number;
    requests: number;
    errors: number;
  };
}

interface CompanyData {
  id: string;
  name: string;
  plan: "basic" | "premium" | "enterprise";
  users: number;
  jobPosts: number;
  applications: number;
  revenue: number;
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
}

interface RecentActivity {
  id: string;
  type:
    | "user_signup"
    | "company_signup"
    | "job_posted"
    | "application"
    | "payment"
    | "issue";
  title: string;
  description: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "success";
  user?: string;
  metadata?: any;
}

const mockMetrics: PlatformMetrics = {
  totalUsers: 45680,
  activeUsers: 23450,
  totalCompanies: 1240,
  activeCompanies: 890,
  totalJobs: 5680,
  activeJobs: 3240,
  totalApplications: 125340,
  monthlyRevenue: 485000,
  subscriptionRevenue: 425000,
  avgSessionDuration: "24m 32s",
  conversionRate: 12.4,
  churnRate: 3.2,
  nps: 72,
  platformHealth: 98.5,
  systemUptime: 99.9,
  avgResponseTime: 145,
};

const mockUserStats: UserStats = {
  candidates: 38420,
  recruiters: 5890,
  companies: 1240,
  admins: 45,
  newSignups: 287,
  activeToday: 8450,
  premiumUsers: 12340,
};

const mockSystemHealth: SystemHealth = {
  server: {
    status: "healthy",
    cpu: 45,
    memory: 67,
    disk: 32,
    uptime: "27d 14h 23m",
  },
  database: {
    status: "healthy",
    connections: 245,
    queryTime: 12,
    size: "2.4 TB",
  },
  api: {
    status: "healthy",
    responseTime: 145,
    requests: 45890,
    errors: 23,
  },
};

const mockCompanies: CompanyData[] = [
  {
    id: "1",
    name: "TechCorp Zurich",
    plan: "enterprise",
    users: 25,
    jobPosts: 12,
    applications: 456,
    revenue: 2400,
    status: "active",
    joinDate: "2023-01-15",
    lastActive: "2024-01-16",
  },
  {
    id: "2",
    name: "SwissFinance Solutions",
    plan: "premium",
    users: 15,
    jobPosts: 8,
    applications: 234,
    revenue: 1200,
    status: "active",
    joinDate: "2023-03-22",
    lastActive: "2024-01-16",
  },
  {
    id: "3",
    name: "StartupCH",
    plan: "basic",
    users: 5,
    jobPosts: 3,
    applications: 89,
    revenue: 300,
    status: "inactive",
    joinDate: "2023-08-10",
    lastActive: "2024-01-10",
  },
];

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "company_signup",
    title: "New Enterprise Customer",
    description: "InnovateCH signed up for Enterprise plan",
    timestamp: "2024-01-16T10:30:00Z",
    severity: "success",
    user: "InnovateCH",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    description: "CHF 2,400 payment from TechCorp Zurich",
    timestamp: "2024-01-16T09:15:00Z",
    severity: "success",
    user: "TechCorp Zurich",
  },
  {
    id: "3",
    type: "issue",
    title: "API Rate Limit Warning",
    description: "Company ID 1245 exceeded API rate limits",
    timestamp: "2024-01-16T08:45:00Z",
    severity: "warning",
  },
];

export default function OwnerAdminDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const tabs = [
    { id: "overview", label: "Platform Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "companies", label: "Companies", icon: Building },
    { id: "revenue", label: "Revenue & Analytics", icon: DollarSign },
    { id: "system", label: "System Health", icon: Server },
    { id: "security", label: "Security & Logs", icon: Shield },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "healthy":
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "warning":
      case "inactive":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "error":
      case "critical":
      case "suspended":
        return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "text-purple-600 bg-purple-100 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400";
      case "premium":
        return "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "basic":
        return "text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(amount);
  };

  const filteredCompanies = mockCompanies.filter((company) => {
    const matchesSearch =
      searchTerm === "" ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || company.status === filterStatus;
    return matchesSearch && matchesFilter;
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
              <div className="flex items-center mb-2">
                <Crown className="w-8 h-8 text-yellow-500 mr-3" />
                <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white">
                  Owner Dashboard
                </h1>
              </div>
              <p className="text-jobequal-text-muted dark:text-gray-400">
                Complete platform management and analytics
              </p>
            </div>

            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-jobequal-neutral-dark dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-jobequal-neutral-dark dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  2
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Platform Metrics */}
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
                  Total Users
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +12.5%
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
                  Companies
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.totalCompanies.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +8.3%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Active Jobs
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.activeJobs.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +15.2%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {formatCurrency(mockMetrics.monthlyRevenue)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +22.1%
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Platform Health
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.platformHealth}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  All systems operational
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  NPS Score
                </p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {mockMetrics.nps}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +5 points
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-500" />
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
                {/* User Distribution */}
                <div className="lg:col-span-2">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                      <PieChart className="w-6 h-6 mr-3 text-jobequal-green" />
                      User Distribution
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">
                            {Math.round(
                              (mockUserStats.candidates /
                                mockMetrics.totalUsers) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <h3 className="font-semibold text-jobequal-text dark:text-white">
                          Candidates
                        </h3>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {mockUserStats.candidates.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">
                            {Math.round(
                              (mockUserStats.recruiters /
                                mockMetrics.totalUsers) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <h3 className="font-semibold text-jobequal-text dark:text-white">
                          Recruiters
                        </h3>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {mockUserStats.recruiters.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">
                            {Math.round(
                              (mockUserStats.companies /
                                mockMetrics.totalUsers) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <h3 className="font-semibold text-jobequal-text dark:text-white">
                          Companies
                        </h3>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {mockUserStats.companies.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">
                            {Math.round(
                              (mockUserStats.premiumUsers /
                                mockMetrics.totalUsers) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <h3 className="font-semibold text-jobequal-text dark:text-white">
                          Premium
                        </h3>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {mockUserStats.premiumUsers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                      <Activity className="w-6 h-6 mr-3 text-jobequal-green" />
                      Recent Platform Activity
                    </h2>
                    <div className="space-y-4">
                      {mockRecentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-4 p-4 bg-jobequal-green/5 rounded-xl"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.severity === "success"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : activity.severity === "warning"
                                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                                  : activity.severity === "error"
                                    ? "bg-red-100 dark:bg-red-900/30"
                                    : "bg-blue-100 dark:bg-blue-900/30"
                            }`}
                          >
                            {activity.type === "company_signup" && (
                              <Building className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                            {activity.type === "payment" && (
                              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                            )}
                            {activity.type === "issue" && (
                              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                            )}
                            {activity.type === "user_signup" && (
                              <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-jobequal-text dark:text-white font-medium">
                              {activity.title}
                            </p>
                            <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {activity.description}
                            </p>
                            <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* System Health Summary */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4 flex items-center">
                      <Server className="w-5 h-5 mr-2 text-jobequal-green" />
                      System Health
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-jobequal-text dark:text-white">
                          Server
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Healthy
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-jobequal-text dark:text-white">
                          Database
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Healthy
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-jobequal-text dark:text-white">
                          API
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Healthy
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-jobequal-neutral-dark dark:border-gray-600">
                        <div className="flex justify-between text-sm">
                          <span className="text-jobequal-text-muted dark:text-gray-400">
                            Uptime
                          </span>
                          <span className="font-medium text-jobequal-text dark:text-white">
                            {mockMetrics.systemUptime}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                      Today's Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          New Signups
                        </span>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          {mockUserStats.newSignups}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Active Users
                        </span>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          {mockUserStats.activeToday.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Response Time
                        </span>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          {mockMetrics.avgResponseTime}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Conversion Rate
                        </span>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          {mockMetrics.conversionRate}%
                        </span>
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
                        <Download className="w-5 h-5 mr-3 text-jobequal-green" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Export Platform Report
                        </span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                        <UserPlus className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Create Admin User
                        </span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                        <Settings className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          Platform Settings
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "companies" && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0">
                    Company Management ({mockCompanies.length})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted" />
                      <input
                        type="text"
                        placeholder="Search companies..."
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
                      <option value="all">All Companies</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-jobequal-green text-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-jobequal-text dark:text-white mr-3">
                              {company.name}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(company.status)}`}
                            >
                              {company.status}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize border ${getPlanColor(company.plan)}`}
                            >
                              {company.plan}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {company.users} users
                            </span>
                            <span className="flex items-center">
                              <BarChart3 className="w-4 h-4 mr-1" />
                              {company.jobPosts} jobs
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {company.applications} applications
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Joined{" "}
                              {new Date(company.joinDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Last active{" "}
                              {new Date(
                                company.lastActive,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-jobequal-green">
                              {formatCurrency(company.revenue)} / month
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-jobequal-text-muted hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-red-500 dark:text-gray-400 transition-colors">
                            <Lock className="w-4 h-4" />
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

            {activeTab === "system" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Server className="w-6 h-6 mr-3 text-jobequal-green" />
                    System Resources
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          CPU Usage
                        </span>
                        <span className="text-sm font-bold text-jobequal-green">
                          {mockSystemHealth.server.cpu}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mockSystemHealth.server.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          Memory Usage
                        </span>
                        <span className="text-sm font-bold text-jobequal-green">
                          {mockSystemHealth.server.memory}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${mockSystemHealth.server.memory}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          Disk Usage
                        </span>
                        <span className="text-sm font-bold text-jobequal-green">
                          {mockSystemHealth.server.disk}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mockSystemHealth.server.disk}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-jobequal-neutral-dark dark:border-gray-600">
                      <div className="flex justify-between text-sm">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          Uptime
                        </span>
                        <span className="font-medium text-jobequal-text dark:text-white">
                          {mockSystemHealth.server.uptime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Database className="w-6 h-6 mr-3 text-jobequal-green" />
                    Database & API
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {mockSystemHealth.database.connections}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          DB Connections
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {mockSystemHealth.database.queryTime}ms
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Avg Query Time
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {mockSystemHealth.api.requests.toLocaleString()}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          API Requests/24h
                        </div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {mockSystemHealth.api.responseTime}ms
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Response Time
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-jobequal-neutral-dark dark:border-gray-600">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          Database Size
                        </span>
                        <span className="font-medium text-jobequal-text dark:text-white">
                          {mockSystemHealth.database.size}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-jobequal-text-muted dark:text-gray-400">
                          API Errors (24h)
                        </span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {mockSystemHealth.api.errors}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "revenue" && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-3 text-jobequal-green" />
                    Revenue Overview
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-jobequal-green/5 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">
                        Monthly Recurring Revenue
                      </span>
                      <span className="text-xl font-bold text-jobequal-green">
                        {formatCurrency(mockMetrics.subscriptionRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">
                        Total Monthly Revenue
                      </span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(mockMetrics.monthlyRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">
                        Average Revenue Per User
                      </span>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(
                          mockMetrics.monthlyRevenue / mockMetrics.totalUsers,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-jobequal-green" />
                    Growth Metrics
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        Monthly Growth Rate
                      </span>
                      <div className="flex items-center">
                        <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          +22.1%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        User Acquisition Cost
                      </span>
                      <span className="text-sm font-medium text-jobequal-text dark:text-white">
                        {formatCurrency(45)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        Customer Lifetime Value
                      </span>
                      <span className="text-sm font-medium text-jobequal-text dark:text-white">
                        {formatCurrency(1240)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">
                        Churn Rate
                      </span>
                      <div className="flex items-center">
                        <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {mockMetrics.churnRate}%
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
                    Platform Configuration
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        value="JobEqual"
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                        Platform URL
                      </label>
                      <input
                        type="text"
                        value="https://jobequal.ch"
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                        Default Language
                      </label>
                      <select className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent">
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="it">Italian</option>
                        <option value="rm">Romansh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                        Maintenance Mode
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
                        />
                        <span className="text-sm text-jobequal-text dark:text-white">
                          Enable maintenance mode
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Crown className="w-6 h-6 mr-3 text-jobequal-green" />
                    Owner Controls
                  </h2>
                  <div className="space-y-4">
                    <button className="w-full flex items-center p-4 bg-jobequal-green/10 hover:bg-jobequal-green/20 rounded-xl transition-colors">
                      <Download className="w-5 h-5 mr-3 text-jobequal-green" />
                      <div className="text-left">
                        <div className="font-medium text-jobequal-text dark:text-white">
                          Export All Data
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Download complete platform backup
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center p-4 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                      <UserPlus className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                      <div className="text-left">
                        <div className="font-medium text-jobequal-text dark:text-white">
                          Create Super Admin
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Add new administrator account
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-xl transition-colors">
                      <AlertTriangle className="w-5 h-5 mr-3 text-yellow-600 dark:text-yellow-400" />
                      <div className="text-left">
                        <div className="font-medium text-jobequal-text dark:text-white">
                          System Maintenance
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Schedule maintenance window
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center p-4 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                      <Shield className="w-5 h-5 mr-3 text-red-600 dark:text-red-400" />
                      <div className="text-left">
                        <div className="font-medium text-jobequal-text dark:text-white">
                          Security Audit
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          Run comprehensive security check
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
