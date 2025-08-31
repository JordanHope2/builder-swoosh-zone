import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Star,
  Plus,
  X,
  Mountain,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  { id: 1, title: "Welcome", description: "Personal Information" },
  { id: 2, title: "Location", description: "Where do you work?" },
  { id: 3, title: "Experience", description: "Your background" },
  { id: 4, title: "Skills", description: "What are you good at?" },
  { id: 5, title: "Goals", description: "What are you looking for?" },
  { id: 6, title: "Complete", description: "All set!" },
];

const experienceLevels = [
  { id: "entry", title: "Entry Level", description: "0-2 years", icon: "🌱" },
  { id: "mid", title: "Mid Level", description: "3-6 years", icon: "🌿" },
  {
    id: "senior",
    title: "Senior Level",
    description: "7-12 years",
    icon: "🌳",
  },
  { id: "executive", title: "Executive", description: "12+ years", icon: "🏔️" },
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Marketing",
  "Design",
  "Sales",
  "Education",
  "Consulting",
  "Manufacturing",
  "Legal",
  "Real Estate",
  "Other",
];

const skillCategories = {
  technical: [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "SQL",
    "AWS",
    "Docker",
    "Git",
  ],
  design: [
    "Figma",
    "Adobe Creative Suite",
    "UI/UX Design",
    "Prototyping",
    "User Research",
  ],
  marketing: [
    "Digital Marketing",
    "SEO",
    "Social Media",
    "Content Creation",
    "Analytics",
  ],
  business: [
    "Project Management",
    "Strategic Planning",
    "Business Analysis",
    "Leadership",
  ],
};

const jobTypes = [
  { id: "full-time", title: "Full-time", icon: "🏢" },
  { id: "part-time", title: "Part-time", icon: "⏰" },
  { id: "freelance", title: "Freelance", icon: "💼" },
  { id: "remote", title: "Remote Only", icon: "🌍" },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Welcome
    title: "",
    bio: "",

    // Step 2: Location
    location: "",
    willingToRelocate: false,

    // Step 3: Experience
    experienceLevel: "",
    industry: "",
    currentPosition: "",

    // Step 4: Skills
    skills: [] as string[],

    // Step 5: Goals
    desiredJobTypes: [] as string[],
    salaryRange: "",
    availability: "",
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      handleInputChange("skills", [...formData.skills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    handleInputChange(
      "skills",
      formData.skills.filter((s) => s !== skill),
    );
  };

  const toggleJobType = (type: string) => {
    const current = formData.desiredJobTypes;
    if (current.includes(type)) {
      handleInputChange(
        "desiredJobTypes",
        current.filter((t) => t !== type),
      );
    } else {
      handleInputChange("desiredJobTypes", [...current, type]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
                Welcome to JobEqual!
              </h2>
              <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
                Let's create your professional profile with Swiss precision
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Professional Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your career goals..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
                Where are you based?
              </h2>
              <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
                This helps us show you relevant opportunities
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Current Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                >
                  <option value="">Select your location</option>
                  <option value="zurich">Zurich</option>
                  <option value="geneva">Geneva</option>
                  <option value="basel">Basel</option>
                  <option value="bern">Bern</option>
                  <option value="lausanne">Lausanne</option>
                  <option value="lucerne">Lucerne</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="relocate"
                type="checkbox"
                checked={formData.willingToRelocate}
                onChange={(e) =>
                  handleInputChange("willingToRelocate", e.target.checked)
                }
                className="h-4 w-4 text-jobequal-green focus:ring-jobequal-green border-gray-300 dark:border-gray-600 rounded"
              />
              <label
                htmlFor="relocate"
                className="ml-3 text-jobequal-text-muted dark:text-gray-300"
              >
                I'm willing to relocate for the right opportunity
              </label>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💼</div>
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
                Tell us about your experience
              </h2>
              <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
                This helps us match you with appropriate roles
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-4">
                Experience Level
              </label>
              <div className="grid grid-cols-2 gap-4">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() =>
                      handleInputChange("experienceLevel", level.id)
                    }
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      formData.experienceLevel === level.id
                        ? "border-jobequal-green bg-jobequal-green-light dark:bg-jobequal-green/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-jobequal-green"
                    }`}
                  >
                    <div className="text-2xl mb-2">{level.icon}</div>
                    <div className="font-semibold text-jobequal-text dark:text-white">
                      {level.title}
                    </div>
                    <div className="text-sm text-jobequal-text-muted dark:text-gray-300">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              >
                <option value="">Select your industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Current Position (Optional)
              </label>
              <input
                type="text"
                value={formData.currentPosition}
                onChange={(e) =>
                  handleInputChange("currentPosition", e.target.value)
                }
                placeholder="e.g., Software Engineer at TechCorp"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
                What are your key skills?
              </h2>
              <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
                Select skills that represent your expertise
              </p>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-jobequal-text dark:text-white mb-3">
                  Selected Skills ({formData.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-jobequal-green text-white"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Categories */}
            <div className="space-y-6">
              {Object.entries(skillCategories).map(([category, skills]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-jobequal-text dark:text-white mb-3 capitalize">
                    {category} Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        disabled={formData.skills.includes(skill)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          formData.skills.includes(skill)
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-jobequal-text dark:text-white hover:border-jobequal-green hover:bg-jobequal-green-light dark:hover:bg-jobequal-green/10"
                        }`}
                      >
                        {formData.skills.includes(skill) ? (
                          <Check className="w-4 h-4 inline mr-1" />
                        ) : (
                          <Plus className="w-4 h-4 inline mr-1" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
                What are you looking for?
              </h2>
              <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
                Tell us about your career goals and preferences
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-4">
                Job Types (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {jobTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleJobType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      formData.desiredJobTypes.includes(type.id)
                        ? "border-jobequal-green bg-jobequal-green-light dark:bg-jobequal-green/10"
                        : "border-gray-200 dark:border-gray-700 hover:border-jobequal-green"
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-jobequal-text dark:text-white">
                      {type.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Desired Salary Range (CHF)
              </label>
              <select
                value={formData.salaryRange}
                onChange={(e) =>
                  handleInputChange("salaryRange", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              >
                <option value="">Select salary range</option>
                <option value="60000-80000">60,000 - 80,000</option>
                <option value="80000-100000">80,000 - 100,000</option>
                <option value="100000-120000">100,000 - 120,000</option>
                <option value="120000-150000">120,000 - 150,000</option>
                <option value="150000+">150,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) =>
                  handleInputChange("availability", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              >
                <option value="">When can you start?</option>
                <option value="immediately">Immediately</option>
                <option value="2weeks">2 weeks notice</option>
                <option value="1month">1 month notice</option>
                <option value="3months">3 months notice</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
              className="w-24 h-24 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-jobequal-text dark:text-white mb-4">
              Welcome to JobEqual! 🎉
            </h2>
            <p className="text-xl text-jobequal-text-muted dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Your profile is complete! We're already analyzing opportunities
              that match your skills and goals.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <Zap className="w-8 h-8 text-jobequal-green mx-auto mb-3" />
                <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  AI Matching
                </h4>
                <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                  Our AI is finding your perfect job matches
                </p>
              </div>
              <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <Mountain className="w-8 h-8 text-jobequal-green mx-auto mb-3" />
                <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  Swiss Quality
                </h4>
                <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                  Premium opportunities from top companies
                </p>
              </div>
              <div className="p-6 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <Star className="w-8 h-8 text-jobequal-green mx-auto mb-3" />
                <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  Personalized
                </h4>
                <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                  Recommendations tailored to your goals
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <div>
                <Link
                  to="/swipe"
                  className="text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
                >
                  Or start swiping jobs →
                </Link>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 group mb-8"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <span className="text-2xl font-bold text-jobequal-text dark:text-white tracking-tight">
              JobEqual
            </span>
          </Link>

          {/* Progress Bar */}
          {currentStep < steps.length && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  Step {currentStep} of {steps.length - 1}
                </span>
                <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
                  {Math.round((currentStep / (steps.length - 1)) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          {/* Navigation */}
          {currentStep < steps.length && (
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-jobequal-text-muted dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <button
                onClick={nextStep}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {currentStep === steps.length - 1
                  ? "Complete Setup"
                  : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
