import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  UserCheck,
  Shield,
  Briefcase,
  MessageSquare,
  ArrowRight,
  Crown,
} from "lucide-react";
import { Navigation } from "../components/Navigation";

interface UserRole {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
  route: string;
  badge?: string;
}

const roles: UserRole[] = [
  {
    id: "candidate",
    title: "Job Candidate",
    description:
      "Browse jobs, track applications, and manage your career journey",
    features: [
      "Job matching",
      "Application tracking",
      "Resume builder",
      "AI career advice",
    ],
    icon: UserCheck,
    color: "from-blue-500 to-cyan-500",
    route: "/dashboard",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    description:
      "Find talent, manage candidates, and streamline your hiring process",
    features: [
      "Candidate sourcing",
      "Interview scheduling",
      "Pipeline management",
      "Analytics",
    ],
    icon: Users,
    color: "from-purple-500 to-indigo-500",
    route: "/enhanced-recruiter-dashboard",
  },
  {
    id: "company",
    title: "Company Owner",
    description:
      "Manage job postings, track hiring metrics, and oversee your team",
    features: [
      "Job posting",
      "Application management",
      "Team collaboration",
      "Subscription billing",
    ],
    icon: Building2,
    color: "from-green-500 to-emerald-500",
    route: "/company-dashboard",
  },
  {
    id: "admin",
    title: "Platform Owner",
    description:
      "Monitor platform health, manage users, and access system analytics",
    features: [
      "System monitoring",
      "User management",
      "Revenue tracking",
      "Security audits",
    ],
    icon: Shield,
    color: "from-red-500 to-rose-500",
    route: "/owner-admin-dashboard",
    badge: "ADMIN",
  },
];

export default function RoleSwitcher() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role.id);

    // Add a small delay for visual feedback
    setTimeout(() => {
      navigate(role.route);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-12 h-12 text-jobequal-green mr-3" />
            <h1 className="text-4xl sm:text-5xl font-bold text-jobequal-text dark:text-white">
              Role Switcher
            </h1>
          </div>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            Choose your role to explore different dashboards and features.
            Perfect for testing and demonstrating all platform capabilities.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? "transform scale-105" : ""
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <div
                  className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isSelected
                      ? "border-jobequal-green shadow-2xl"
                      : "border-jobequal-neutral-dark dark:border-gray-600 hover:border-jobequal-green-light"
                  }`}
                >
                  {/* Badge */}
                  {role.badge && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {role.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mb-4 mx-auto ${
                      isSelected ? "animate-pulse" : ""
                    }`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-jobequal-text dark:text-white text-center mb-3">
                    {role.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-jobequal-text-muted dark:text-gray-400 text-center mb-4 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {role.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-xs text-jobequal-text-muted dark:text-gray-400"
                      >
                        <div className="w-1.5 h-1.5 bg-jobequal-green rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <div
                    className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-jobequal-green text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white hover:bg-jobequal-green hover:text-white"
                    }`}
                  >
                    <span>
                      {isSelected ? "Accessing..." : "Enter Dashboard"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Access Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
        >
          <div className="text-center mb-6">
            <MessageSquare className="w-8 h-8 text-jobequal-green mx-auto mb-3" />
            <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-2">
              Additional Features
            </h3>
            <p className="text-jobequal-text-muted dark:text-gray-400">
              Explore other platform features available across all roles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Job Search", icon: Briefcase, route: "/job-search" },
              { name: "Swipe Discovery", icon: Users, route: "/swipe" },
              { name: "Companies", icon: Building2, route: "/companies" },
              { name: "AI Chatbot", icon: MessageSquare, route: "/" },
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.button
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(feature.route)}
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-jobequal-green hover:text-white transition-all duration-200"
                >
                  <FeatureIcon className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">{feature.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
