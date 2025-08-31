import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Brain,
  Target,
  TrendingUp,
  GraduationCap,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  User,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import { applicationToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";
import {
  AIMatchReport,
  aiMatchService,
  JobProfile,
  CandidateProfile,
} from "../../services/aiMatchService";

interface AIMatchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  userId: string;
  initialMatchPercent: number;
  jobProfile: JobProfile;
  candidateProfile: CandidateProfile;
}

const breakdownCategories = [
  {
    key: "skills",
    label: "Skills Match",
    icon: Target,
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "experience",
    label: "Experience",
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
  },
  {
    key: "education",
    label: "Education",
    icon: GraduationCap,
    color: "from-purple-500 to-purple-600",
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    color: "from-orange-500 to-orange-600",
  },
  {
    key: "salary",
    label: "Salary",
    icon: DollarSign,
    color: "from-teal-500 to-teal-600",
  },
];

function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  className = "",
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 80) return "#10B981"; // green
    if (percent >= 60) return "#F59E0B"; // yellow
    return "#EF4444"; // red
  };

  return (
    <div className={cn("relative", className)}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          style={{ strokeDasharray, strokeDashoffset }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-2xl font-bold text-gray-900"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
}

function CategoryBar({
  category,
  percentage,
  index,
}: {
  category: (typeof breakdownCategories)[0];
  percentage: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
            <category.icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-900">{category.label}</span>
        </div>
        <span className="font-semibold text-gray-700">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${category.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Brain className="w-12 h-12 text-blue-500" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Analyzing Your Match
      </h3>
      <p className="text-gray-600 text-center max-w-sm">
        Our AI is evaluating your profile against this position to provide
        detailed insights...
      </p>
    </div>
  );
}

export function AIMatchReportModal({
  isOpen,
  onClose,
  jobId,
  userId,
  initialMatchPercent,
  jobProfile,
  candidateProfile,
}: AIMatchReportModalProps) {
  const [report, setReport] = useState<AIMatchReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !report) {
      loadMatchReport();
    }
  }, [isOpen]);

  const loadMatchReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const matchReport = await aiMatchService.getOrGenerateMatchReport(
        jobId,
        userId,
        jobProfile,
        candidateProfile,
      );
      setReport(matchReport);
    } catch (err: unknown) {
      setError("Failed to load match analysis. Please try again.");
      console.error("Error loading match report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImproveProfile = () => {
    onClose();
    // Navigate to profile improvement page
    window.location.href = "/profile-settings";
    applicationToast.info(
      "Profile Improvement",
      "Complete your profile to increase your match scores!",
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-full max-h-[90vh] overflow-hidden flex flex-col"
          role="dialog"
          aria-labelledby="match-report-title"
          aria-describedby="match-report-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  id="match-report-title"
                  className="text-xl font-bold text-gray-900"
                >
                  AI Match Analysis
                </h2>
                <p
                  id="match-report-description"
                  className="text-sm text-gray-600"
                >
                  Detailed compatibility breakdown
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close match report"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analysis Unavailable
                </h3>
                <p className="text-gray-600 text-center mb-4">{error}</p>
                <button
                  onClick={loadMatchReport}
                  className="px-6 py-3 min-h-[44px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Retry loading match analysis"
                >
                  Try Again
                </button>
              </div>
            ) : report ? (
              <>
                {/* Overall Match Score */}
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-6"
                  >
                    <CircularProgress
                      percentage={report.matchPercent}
                      size={140}
                      strokeWidth={10}
                      className="mx-auto"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Overall Match Score
                    </h3>
                    <p className="text-gray-600">
                      Based on your profile and job requirements
                    </p>
                  </motion.div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <motion.h4
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                  >
                    <Target className="w-5 h-5 mr-2 text-blue-500" />
                    Category Breakdown
                  </motion.h4>
                  <div className="space-y-4">
                    {breakdownCategories.map((category, index) => (
                      <CategoryBar
                        key={category.key}
                        category={category}
                        percentage={
                          report.breakdown[
                            category.key as keyof typeof report.breakdown
                          ]
                        }
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Your Strengths
                  </h4>
                  <div className="space-y-3">
                    {report.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.6 + index * 0.1, duration: 0.3 }}
                        className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                >
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
                    Improvement Recommendations
                  </h4>
                  <div className="space-y-3">
                    {report.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2 + index * 0.1, duration: 0.3 }}
                        className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{recommendation}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.4, duration: 0.5 }}
                  className="pt-4"
                >
                  <button
                    onClick={handleImproveProfile}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 min-h-[48px] rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    aria-label="Go to profile settings to improve your match score"
                  >
                    <User className="w-5 h-5" />
                    <span>Improve My Profile</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
