import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "../components/Navigation";
import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Building,
  Star,
  Award,
  Clock,
  DollarSign,
  Target,
  Zap,
  Globe,
  Mail,
  Phone,
  MoreVertical,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: "candidate" | "recruiter" | "admin";
  status: "active" | "inactive" | "suspended";
  joinDate: string;
  lastActive: string;
  location: string;
  jobsPosted?: number;
  applications?: number;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalJobs: number;
  totalApplications: number;
  revenue: number;
  growth: number;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jordan Hope",
    email: "jordan@example.com",
    avatar: "👨‍💻",
    type: "candidate",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    location: "Zurich",
    applications: 8,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@techcorp.ch",
    avatar: "👩‍💼",
    type: "recruiter",
    status: "active",
    joinDate: "2024-02-10",
    lastActive: "1 day ago",
    location: "Geneva",
    jobsPosted: 12,
  },
  {
    id: "3",
    name: "Marcus Weber",
    email: "marcus@example.com",
    avatar: "👨‍💼",
    type: "candidate",
    status: "inactive",
    joinDate: "2024-03-05",
    lastActive: "1 week ago",
    location: "Basel",
    applications: 3,
  },
];

const systemMetrics: SystemMetrics = {
  totalUsers: 2847,
  activeUsers: 1923,
  totalJobs: 456,
  totalApplications: 8921,
  revenue: 125000,
  growth: 18.5,
};

const recentActivity = [
  {
    id: "1",
    type: "user_signup",
    user: "New candidate registered",
    time: "5 min ago",
    icon: UserCheck,
  },
  {
    id: "2",
    type: "job_posted",
    user: "TechCorp posted Senior Engineer role",
    time: "15 min ago",
    icon: Briefcase,
  },
  {
    id: "3",
    type: "application",
    user: "3 new applications received",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: "4",
    type: "payment",
    user: "Premium subscription activated",
    time: "2 hours ago",
    icon: Star,
  },
  {
    id: "5",
    type: "report",
    user: "Inappropriate content reported",
    time: "3 hours ago",
    icon: AlertTriangle,
  },
];

const chartData = {
  userGrowth: [
    { month: "Jan", users: 1240 },
    { month: "Feb", users: 1580 },
    { month: "Mar", users: 1920 },
    { month: "Apr", users: 2340 },
    { month: "May", users: 2847 },
  ],
  jobCategories: [
    { category: "Technology", count: 156, percentage: 34 },
    { category: "Finance", count: 89, percentage: 20 },
    { category: "Healthcare", count: 67, percentage: 15 },
    { category: "Marketing", count: 45, percentage: 10 },
    { category: "Other", count: 99, percentage: 21 },
  ],
};

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userFilter, setUserFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "recruiter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "candidate":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesFilter = userFilter === "all" || user.type === userFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-3xl font-bold text-jobequal-text dark:text-white">
                Admin Panel
              </h1>
            </div>
            <p className="text-jobequal-text-muted dark:text-gray-300">
              System overview and user management
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white rounded-xl transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* System Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Users",
              value: systemMetrics.totalUsers.toLocaleString(),
              change: "+12%",
              icon: Users,
              color: "text-blue-600",
            },
            {
              title: "Active Users",
              value: systemMetrics.activeUsers.toLocaleString(),
              change: "+8%",
              icon: UserCheck,
              color: "text-green-600",
            },
            {
              title: "Total Jobs",
              value: systemMetrics.totalJobs.toLocaleString(),
              change: "+15%",
              icon: Briefcase,
              color: "text-purple-600",
            },
            {
              title: "Applications",
              value: systemMetrics.totalApplications.toLocaleString(),
              change: "+23%",
              icon: Target,
              color: "text-orange-600",
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  {metric.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-jobequal-text dark:text-white mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                {metric.title}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "User Management", icon: Users },
              { id: "jobs", label: "Job Management", icon: Briefcase },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-jobequal-green text-jobequal-green"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                  <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-jobequal-green-light dark:bg-jobequal-green/20 rounded-xl flex items-center justify-center">
                          <activity.icon className="w-5 h-5 text-jobequal-green" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-jobequal-text dark:text-white">
                            {activity.user}
                          </p>
                          <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="space-y-6">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                  <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                    System Health
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Server Status",
                        status: "Operational",
                        color: "text-green-600",
                      },
                      {
                        name: "Database",
                        status: "Healthy",
                        color: "text-green-600",
                      },
                      {
                        name: "API Response",
                        status: "98ms avg",
                        color: "text-blue-600",
                      },
                      {
                        name: "Uptime",
                        status: "99.9%",
                        color: "text-green-600",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {item.name}
                        </span>
                        <span className={`text-sm font-medium ${item.color}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                  <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        67%
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        User Engagement
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        4.8
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Platform Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* User Filters */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      />
                    </div>
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="candidate">Candidates</option>
                      <option value="recruiter">Recruiters</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                  <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                    Showing {filteredUsers.length} of {mockUsers.length} users
                  </div>
                </div>
              </div>

              {/* User List */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-lg mr-4">
                                {user.avatar}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-jobequal-text dark:text-white">
                                  {user.name}
                                </div>
                                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserTypeColor(user.type)}`}
                            >
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-jobequal-text-muted dark:text-gray-400">
                            {user.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-jobequal-text-muted dark:text-gray-400">
                            {user.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-jobequal-green hover:text-jobequal-green-hover">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* User Growth Chart */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6">
                  User Growth
                </h3>
                <div className="space-y-4">
                  {chartData.userGrowth.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-jobequal-text dark:text-white">
                        {data.month}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-jobequal-green h-2 rounded-full"
                            style={{ width: `${(data.users / 3000) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white w-16 text-right">
                          {data.users.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Categories */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6">
                  Job Categories
                </h3>
                <div className="space-y-4">
                  {chartData.jobCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">
                          {category.category}
                        </span>
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {category.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
