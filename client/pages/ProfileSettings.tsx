import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Eye,
  Lock,
  Globe,
  Palette,
  Download,
  Upload,
  Trash2,
  Settings,
  Save,
  X,
  Check,
  Camera,
  Edit,
  Plus,
  Minus,
  AlertTriangle,
  Info,
  Star,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

interface UserProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    jobAlerts: boolean;
    profileVisibility: "public" | "private" | "contacts";
    language: string;
    timezone: string;
    theme: "light" | "dark" | "system";
  };
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: boolean;
    allowProfileViews: boolean;
  };
  professional: {
    title: string;
    experience: string;
    salary: {
      min: number;
      max: number;
      currency: string;
    };
    availability: string;
    remote: boolean;
    skills: string[];
    languages: string[];
  };
  social: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
}

const mockProfile: UserProfile = {
  personalInfo: {
    firstName: "Jordan",
    lastName: "Hope",
    email: "jordan.hope@email.com",
    phone: "+41 76 123 45 67",
    location: "Zurich, Switzerland",
    bio: "Passionate software engineer with 5+ years of experience building scalable web applications. Love working with React, Node.js, and cloud technologies.",
    avatar: "👨‍💻",
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    profileVisibility: "public",
    language: "en",
    timezone: "Europe/Zurich",
    theme: "system",
  },
  privacy: {
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: true,
    allowProfileViews: true,
  },
  professional: {
    title: "Senior Software Engineer",
    experience: "5+ years",
    salary: {
      min: 120000,
      max: 140000,
      currency: "CHF",
    },
    availability: "Immediately",
    remote: true,
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
    languages: ["English (Native)", "German (B2)", "French (A2)"],
  },
  social: {
    linkedin: "https://linkedin.com/in/jordanhope",
    github: "https://github.com/jordanhope",
    twitter: "@jordanhope",
    website: "https://jordanhope.dev",
  },
};

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const { t } = useLanguage();

  const updateProfile = (path: string, value: any) => {
    setProfile((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      setHasChanges(true);
      return updated;
    });
  };

  const addSkill = () => {
    if (
      newSkill.trim() &&
      !profile.professional.skills.includes(newSkill.trim())
    ) {
      updateProfile("professional.skills", [
        ...profile.professional.skills,
        newSkill.trim(),
      ]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    updateProfile(
      "professional.skills",
      profile.professional.skills.filter((s) => s !== skill),
    );
  };

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !profile.professional.languages.includes(newLanguage.trim())
    ) {
      updateProfile("professional.languages", [
        ...profile.professional.languages,
        newLanguage.trim(),
      ]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (language: string) => {
    updateProfile(
      "professional.languages",
      profile.professional.languages.filter((l) => l !== language),
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    setHasChanges(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "account", label: "Account", icon: Lock },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">
              {t("profile.title")}
            </h1>
            <p className="text-jobequal-text-muted dark:text-gray-300">
              {t("profile.subtitle")}
            </p>
          </div>

          <AnimatePresence>
            {hasChanges && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={saveChanges}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>{t("profile.saving")}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{t("profile.save_changes")}</span>
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg overflow-hidden"
            >
              <nav className="p-2">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green border-l-4 border-jobequal-green"
                        : "text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                      Personal Information
                    </h2>

                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl flex items-center justify-center text-4xl shadow-lg">
                          {profile.personalInfo.avatar}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-jobequal-green hover:bg-jobequal-green-hover text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white">
                          {profile.personalInfo.firstName}{" "}
                          {profile.personalInfo.lastName}
                        </h3>
                        <p className="text-jobequal-text-muted dark:text-gray-400">
                          {profile.professional.title}
                        </p>
                        <button className="text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium mt-1 transition-colors">
                          Change photo
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profile.personalInfo.firstName}
                          onChange={(e) =>
                            updateProfile(
                              "personalInfo.firstName",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profile.personalInfo.lastName}
                          onChange={(e) =>
                            updateProfile(
                              "personalInfo.lastName",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profile.personalInfo.email}
                          onChange={(e) =>
                            updateProfile("personalInfo.email", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.personalInfo.phone}
                          onChange={(e) =>
                            updateProfile("personalInfo.phone", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profile.personalInfo.location}
                          onChange={(e) =>
                            updateProfile(
                              "personalInfo.location",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profile.personalInfo.bio}
                          onChange={(e) =>
                            updateProfile("personalInfo.bio", e.target.value)
                          }
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                        Social Links
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          {
                            key: "linkedin",
                            label: "LinkedIn",
                            icon: Linkedin,
                            placeholder: "https://linkedin.com/in/username",
                          },
                          {
                            key: "github",
                            label: "GitHub",
                            icon: Github,
                            placeholder: "https://github.com/username",
                          },
                          {
                            key: "twitter",
                            label: "Twitter",
                            icon: Twitter,
                            placeholder: "@username",
                          },
                          {
                            key: "website",
                            label: "Website",
                            icon: LinkIcon,
                            placeholder: "https://yourwebsite.com",
                          },
                        ].map((social) => (
                          <div
                            key={social.key}
                            className="flex items-center space-x-3"
                          >
                            <social.icon className="w-5 h-5 text-jobequal-text-muted dark:text-gray-400" />
                            <input
                              type="text"
                              value={
                                profile.social[
                                  social.key as keyof typeof profile.social
                                ]
                              }
                              onChange={(e) =>
                                updateProfile(
                                  `social.${social.key}`,
                                  e.target.value,
                                )
                              }
                              placeholder={social.placeholder}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "professional" && (
                  <motion.div
                    key="professional"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                      Professional Information
                    </h2>

                    <div className="space-y-6">
                      {/* Basic Professional Info */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                            Job Title
                          </label>
                          <input
                            type="text"
                            value={profile.professional.title}
                            onChange={(e) =>
                              updateProfile(
                                "professional.title",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                            Experience Level
                          </label>
                          <select
                            value={profile.professional.experience}
                            onChange={(e) =>
                              updateProfile(
                                "professional.experience",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          >
                            <option value="0-1 years">0-1 years</option>
                            <option value="2-3 years">2-3 years</option>
                            <option value="4-5 years">4-5 years</option>
                            <option value="5+ years">5+ years</option>
                            <option value="10+ years">10+ years</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                            Availability
                          </label>
                          <select
                            value={profile.professional.availability}
                            onChange={(e) =>
                              updateProfile(
                                "professional.availability",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          >
                            <option value="Immediately">Immediately</option>
                            <option value="2 weeks notice">
                              2 weeks notice
                            </option>
                            <option value="1 month notice">
                              1 month notice
                            </option>
                            <option value="3 months notice">
                              3 months notice
                            </option>
                            <option value="Just exploring">
                              Just exploring
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={profile.professional.remote}
                              onChange={(e) =>
                                updateProfile(
                                  "professional.remote",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 text-jobequal-green border-gray-300 dark:border-gray-600 rounded focus:ring-jobequal-green"
                            />
                            <span className="text-sm font-medium text-jobequal-text dark:text-white">
                              Open to remote work
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Desired Salary Range
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            type="number"
                            value={profile.professional.salary.min}
                            onChange={(e) =>
                              updateProfile(
                                "professional.salary.min",
                                parseInt(e.target.value),
                              )
                            }
                            placeholder="Min"
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          />
                          <input
                            type="number"
                            value={profile.professional.salary.max}
                            onChange={(e) =>
                              updateProfile(
                                "professional.salary.max",
                                parseInt(e.target.value),
                              )
                            }
                            placeholder="Max"
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          />
                          <select
                            value={profile.professional.salary.currency}
                            onChange={(e) =>
                              updateProfile(
                                "professional.salary.currency",
                                e.target.value,
                              )
                            }
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          >
                            <option value="CHF">CHF</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profile.professional.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green"
                            >
                              {skill}
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addSkill()}
                            placeholder="Add a skill..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          />
                          <button
                            onClick={addSkill}
                            className="px-4 py-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                          Languages
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profile.professional.languages.map(
                            (language, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                              >
                                {language}
                                <button
                                  onClick={() => removeLanguage(language)}
                                  className="ml-2 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ),
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && addLanguage()
                            }
                            placeholder="e.g., English (Native), German (B2)"
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                          />
                          <button
                            onClick={addLanguage}
                            className="px-4 py-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "preferences" && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                      Preferences
                    </h2>

                    <div className="space-y-8">
                      {/* Notifications */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Notifications
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              key: "emailNotifications",
                              label: "Email notifications",
                              description: "Receive updates via email",
                            },
                            {
                              key: "pushNotifications",
                              label: "Push notifications",
                              description: "Browser and mobile notifications",
                            },
                            {
                              key: "jobAlerts",
                              label: "Job alerts",
                              description: "Get notified about new job matches",
                            },
                          ].map((pref) => (
                            <div
                              key={pref.key}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                            >
                              <div>
                                <div className="font-medium text-jobequal-text dark:text-white">
                                  {pref.label}
                                </div>
                                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                  {pref.description}
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    profile.preferences[
                                      pref.key as keyof typeof profile.preferences
                                    ] as boolean
                                  }
                                  onChange={(e) =>
                                    updateProfile(
                                      `preferences.${pref.key}`,
                                      e.target.checked,
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-jobequal-green/25 dark:peer-focus:ring-jobequal-green/25 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-jobequal-green"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Language & Region */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Language & Region
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                              Language
                            </label>
                            <select
                              value={profile.preferences.language}
                              onChange={(e) =>
                                updateProfile(
                                  "preferences.language",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                            >
                              <option value="en">English</option>
                              <option value="de">Deutsch</option>
                              <option value="fr">Français</option>
                              <option value="it">Italiano</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                              Timezone
                            </label>
                            <select
                              value={profile.preferences.timezone}
                              onChange={(e) =>
                                updateProfile(
                                  "preferences.timezone",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                            >
                              <option value="Europe/Zurich">
                                Europe/Zurich
                              </option>
                              <option value="Europe/London">
                                Europe/London
                              </option>
                              <option value="Europe/Paris">Europe/Paris</option>
                              <option value="America/New_York">
                                America/New_York
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Theme */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Appearance
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                            Theme
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { value: "light", label: "Light" },
                              { value: "dark", label: "Dark" },
                              { value: "system", label: "System" },
                            ].map((theme) => (
                              <label
                                key={theme.value}
                                className="cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="theme"
                                  value={theme.value}
                                  checked={
                                    profile.preferences.theme === theme.value
                                  }
                                  onChange={(e) =>
                                    updateProfile(
                                      "preferences.theme",
                                      e.target.value,
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl peer-checked:border-jobequal-green peer-checked:bg-jobequal-green-light dark:peer-checked:bg-jobequal-green/20 transition-colors text-center">
                                  <div className="font-medium text-jobequal-text dark:text-white">
                                    {theme.label}
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "privacy" && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                      Privacy Settings
                    </h2>

                    <div className="space-y-6">
                      {/* Profile Visibility */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Profile Visibility
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              value: "public",
                              label: "Public",
                              description:
                                "Visible to all users and search engines",
                            },
                            {
                              value: "private",
                              label: "Private",
                              description: "Only visible to you",
                            },
                            {
                              value: "contacts",
                              label: "Contacts only",
                              description: "Visible to your connections only",
                            },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="cursor-pointer"
                            >
                              <div
                                className={`p-4 border-2 rounded-xl transition-colors ${
                                  profile.preferences.profileVisibility ===
                                  option.value
                                    ? "border-jobequal-green bg-jobequal-green-light dark:bg-jobequal-green/20"
                                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name="profileVisibility"
                                    value={option.value}
                                    checked={
                                      profile.preferences.profileVisibility ===
                                      option.value
                                    }
                                    onChange={(e) =>
                                      updateProfile(
                                        "preferences.profileVisibility",
                                        e.target.value,
                                      )
                                    }
                                    className="w-4 h-4 text-jobequal-green border-gray-300 dark:border-gray-600 focus:ring-jobequal-green"
                                  />
                                  <div>
                                    <div className="font-medium text-jobequal-text dark:text-white">
                                      {option.label}
                                    </div>
                                    <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                      {option.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          {[
                            {
                              key: "showEmail",
                              label: "Show email address",
                              description: "Allow others to see your email",
                            },
                            {
                              key: "showPhone",
                              label: "Show phone number",
                              description: "Allow others to see your phone",
                            },
                            {
                              key: "showLocation",
                              label: "Show location",
                              description: "Display your current location",
                            },
                            {
                              key: "allowMessages",
                              label: "Allow messages",
                              description: "Let recruiters send you messages",
                            },
                            {
                              key: "allowProfileViews",
                              label: "Allow profile views",
                              description: "Let others view your profile",
                            },
                          ].map((setting) => (
                            <div
                              key={setting.key}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                            >
                              <div>
                                <div className="font-medium text-jobequal-text dark:text-white">
                                  {setting.label}
                                </div>
                                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                  {setting.description}
                                </div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={
                                    profile.privacy[
                                      setting.key as keyof typeof profile.privacy
                                    ]
                                  }
                                  onChange={(e) =>
                                    updateProfile(
                                      `privacy.${setting.key}`,
                                      e.target.checked,
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-jobequal-green/25 dark:peer-focus:ring-jobequal-green/25 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-jobequal-green"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "account" && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-8"
                  >
                    <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                      Account Settings
                    </h2>

                    <div className="space-y-8">
                      {/* Security */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Security
                        </h3>
                        <div className="space-y-4">
                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Lock className="w-5 h-5 text-jobequal-green" />
                              <div className="text-left">
                                <div className="font-medium text-jobequal-text dark:text-white">
                                  Change Password
                                </div>
                                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                  Update your account password
                                </div>
                              </div>
                            </div>
                            <Edit className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                          </button>

                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Shield className="w-5 h-5 text-blue-500" />
                              <div className="text-left">
                                <div className="font-medium text-jobequal-text dark:text-white">
                                  Two-Factor Authentication
                                </div>
                                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                  Add an extra layer of security
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-green-600 font-medium">
                              Enabled
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Data Management */}
                      <div>
                        <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                          Data Management
                        </h3>
                        <div className="space-y-4">
                          <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                              <Download className="w-5 h-5 text-blue-500" />
                              <div className="text-left">
                                <div className="font-medium text-jobequal-text dark:text-white">
                                  Download Your Data
                                </div>
                                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                                  Export your profile and activity data
                                </div>
                              </div>
                            </div>
                            <Download className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div>
                        <h3 className="text-lg font-semibold text-red-600 mb-4">
                          Danger Zone
                        </h3>
                        <div className="border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                          <div className="flex items-start space-x-3 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-red-600 dark:text-red-400">
                                Delete Account
                              </h4>
                              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                                Once you delete your account, there is no going
                                back. Please be certain.
                              </p>
                            </div>
                          </div>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
