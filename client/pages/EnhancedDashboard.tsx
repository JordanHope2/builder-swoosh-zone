import { useState } from "react";
import { Navigation } from "../components/Navigation";
import {
  ResumeScore,
  AchievementBadges,
  ActivityFeed,
} from "../components/RealtimeFeedback";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Briefcase,
  Eye,
  Star,
  Target,
  Zap,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Bookmark,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Profile Views",
    value: "47",
    change: "+12%",
    changeType: "positive" as const,
    icon: Eye,
    description: "This week",
  },
  {
    title: "Job Matches",
    value: "23",
    change: "+5",
    changeType: "positive" as const,
    icon: Target,
    description: "New matches",
  },
  {
    title: "Applications",
    value: "8",
    change: "+3",
    changeType: "positive" as const,
    icon: Briefcase,
    description: "This month",
  },
  {
    title: "Response Rate",
    value: "65%",
    change: "+8%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "Above average",
  },
];

const quickActions = [
  {
    title: "Swipe Discovery",
    description: "Find jobs with our smart matching",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    link: "/swipe",
  },
  {
    title: "Browse Jobs",
    description: "Search through all opportunities",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-500",
    link: "/job-search",
  },
  {
    title: "Update Profile",
    description: "Improve your match score",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    link: "/candidate-profile",
  },
  {
    title: "AI Assistant",
    description: "Get personalized career advice",
    icon: MessageCircle,
    color: "from-purple-500 to-indigo-500",
    link: "#",
  },
];

const recentMatches = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Zurich",
    logo: "🚀",
    location: "Zurich",
    matchScore: 95,
    salary: "CHF 120K - 140K",
    posted: "2 days ago",
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCH",
    logo: "💡",
    location: "Geneva",
    matchScore: 87,
    salary: "CHF 110K - 130K",
    posted: "1 week ago",
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio",
    logo: "🎨",
    location: "Basel",
    matchScore: 73,
    salary: "CHF 85K - 105K",
    posted: "3 days ago",
  },
];

export default function EnhancedDashboard() {
  const [resumeScore] = useState(82);

  const getMatchColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-jobequal-text dark:text-white mb-2">
            Welcome back, Jordan! 👋
          </h1>
          <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
            Here's your career progress overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-jobequal-green" />
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.changeType === "positive"
                      ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                      : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-jobequal-text dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={action.link}
                      className="block p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 group"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-2 group-hover:text-jobequal-green transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                        {action.description}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Matches */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-jobequal-text dark:text-white">
                  Recent Matches
                </h2>
                <Link
                  to="/job-search"
                  className="text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {recentMatches.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-2xl shadow-md">
                          {job.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-bold ${getMatchColor(job.matchScore)}`}
                            >
                              <Zap className="w-3 h-3" />
                              <span>{job.matchScore}% Match</span>
                            </div>
                          </div>
                          <Link
                            to={`/job/${job.id}`}
                            className="block group-hover:text-jobequal-green transition-colors"
                          >
                            <h3 className="font-bold text-lg text-jobequal-text dark:text-white mb-1 leading-tight">
                              {job.title}
                            </h3>
                          </Link>
                          <p className="text-jobequal-text-muted dark:text-gray-300 font-medium mb-2">
                            {job.company}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-jobequal-green" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1 text-jobequal-green" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{job.posted}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="text-jobequal-text-muted hover:text-red-500 transition-all duration-200 hover:scale-110 p-1">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Resume Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ResumeScore score={resumeScore} />
            </motion.div>

            {/* Achievement Badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AchievementBadges />
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <ActivityFeed />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
