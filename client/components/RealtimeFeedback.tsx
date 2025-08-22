import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  Star,
  Trophy,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Eye,
  ThumbsUp,
  Crown,
  Gem,
  Shield,
  Rocket,
} from "lucide-react";

// Resume Score Component
export function ResumeScore({
  score,
  onScoreChange,
}: {
  score: number;
  onScoreChange?: (score: number) => void;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [improvements, setImprovements] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  useEffect(() => {
    // Simulate real-time improvements suggestions
    const suggestions = [
      "Add more technical skills",
      "Include quantified achievements",
      "Improve summary section",
      "Add relevant certifications",
      "Include project descriptions",
    ];

    if (score < 70) {
      setImprovements(suggestions.slice(0, 3));
    } else if (score < 85) {
      setImprovements(suggestions.slice(0, 2));
    } else {
      setImprovements(suggestions.slice(0, 1));
    }
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-green-500 to-emerald-500";
    if (score >= 70) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90)
      return { level: "Exceptional", icon: Crown, color: "text-yellow-500" };
    if (score >= 85)
      return { level: "Excellent", icon: Trophy, color: "text-green-500" };
    if (score >= 70)
      return { level: "Good", icon: Star, color: "text-blue-500" };
    if (score >= 55)
      return { level: "Fair", icon: Target, color: "text-orange-500" };
    return { level: "Needs Work", icon: AlertCircle, color: "text-red-500" };
  };

  const { level, icon: LevelIcon, color } = getScoreLevel(score);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <LevelIcon className={`w-6 h-6 mr-2 ${color}`} />
          <h3 className="text-xl font-bold text-jobequal-text dark:text-white">
            Resume Score
          </h3>
        </div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100, 100"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.path
              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
              fill="none"
              strokeWidth="2"
              strokeDasharray={`${animatedScore}, 100`}
              strokeLinecap="round"
              className={`bg-gradient-to-r ${getScoreColor(score)}`}
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${animatedScore}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
              stroke="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  stopColor={
                    score >= 85
                      ? "#10b981"
                      : score >= 70
                        ? "#f59e0b"
                        : "#ef4444"
                  }
                />
                <stop
                  offset="100%"
                  stopColor={
                    score >= 85
                      ? "#059669"
                      : score >= 70
                        ? "#d97706"
                        : "#dc2626"
                  }
                />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-3xl font-bold text-jobequal-text dark:text-white"
              >
                {Math.round(animatedScore)}
              </motion.div>
              <div className={`text-sm font-medium ${color}`}>{level}</div>
            </div>
          </div>
        </div>

        {/* Improvements */}
        <div className="space-y-2">
          <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
            Quick Improvements:
          </h4>
          {improvements.map((improvement, index) => (
            <motion.div
              key={improvement}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-300"
            >
              <Zap className="w-4 h-4 mr-2 text-jobequal-green" />
              <span>{improvement}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Achievement Badge Component
interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  earned: boolean;
  progress?: number;
  requirement?: string;
}

const achievements: Badge[] = [
  {
    id: "first_application",
    title: "First Step",
    description: "Applied to your first job",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    earned: true,
  },
  {
    id: "profile_complete",
    title: "Complete Profile",
    description: "Filled out 100% of your profile",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-500",
    earned: true,
  },
  {
    id: "top_candidate",
    title: "Top 5% Candidate",
    description: "Your profile ranks in the top 5%",
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    earned: false,
    progress: 78,
    requirement: "22% more to reach top 5%",
  },
  {
    id: "networking_pro",
    title: "Networking Pro",
    description: "Connected with 10+ professionals",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    earned: false,
    progress: 60,
    requirement: "4 more connections needed",
  },
];

export function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
      <div className="flex items-center mb-6">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        <h3 className="text-xl font-bold text-jobequal-text dark:text-white">
          Your Achievements
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {achievements.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBadge(badge)}
            className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              badge.earned
                ? "bg-gradient-to-br " + badge.color + " text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <div className="text-center">
              <badge.icon className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>

              {!badge.earned && badge.progress && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                    <motion.div
                      className="bg-jobequal-green h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${badge.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-xs mt-1">{badge.progress}%</span>
                </div>
              )}
            </div>

            {badge.earned && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    selectedBadge.earned
                      ? "bg-gradient-to-br " + selectedBadge.color
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <selectedBadge.icon
                    className={`w-8 h-8 ${selectedBadge.earned ? "text-white" : "text-gray-400"}`}
                  />
                </div>
                <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-2">
                  {selectedBadge.title}
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-300 mb-4">
                  {selectedBadge.description}
                </p>

                {!selectedBadge.earned && selectedBadge.requirement && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      <Target className="w-4 h-4 inline mr-1" />
                      {selectedBadge.requirement}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Activity Feed Component
interface Activity {
  id: string;
  type: "application" | "profile_view" | "skill_match" | "interview";
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ComponentType<any>;
  color: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "application",
    title: "Application Sent",
    description: "Applied to Senior Software Engineer at TechCorp",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    icon: Rocket,
    color: "text-blue-500",
  },
  {
    id: "2",
    type: "profile_view",
    title: "Profile Viewed",
    description: "Your profile was viewed by InnovateCH",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    icon: Eye,
    color: "text-green-500",
  },
  {
    id: "3",
    type: "skill_match",
    title: "New Skill Match",
    description: "Found 3 new jobs matching your React skills",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    icon: Zap,
    color: "text-yellow-500",
  },
];

export function ActivityFeed() {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
      <div className="flex items-center mb-6">
        <Clock className="w-6 h-6 mr-2 text-jobequal-green" />
        <h3 className="text-xl font-bold text-jobequal-text dark:text-white">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div
              className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${activity.color}`}
            >
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-jobequal-text dark:text-white text-sm">
                {activity.title}
              </h4>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-300 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors">
        View All Activity →
      </button>
    </div>
  );
}
