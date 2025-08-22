import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Users,
  Briefcase,
  CheckCircle,
  X,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeProvider";
import { signUpWithEmail } from "../lib/supabase";
import { useToast } from "../hooks/use-toast";

const userTypes = [
  {
    id: "candidate",
    title: "Job Seeker",
    description: "Find your dream job",
    icon: User,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Find top talent",
    icon: Users,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "company",
    title: "Company",
    description: "Post jobs & hire",
    icon: Briefcase,
    gradient: "from-green-500 to-emerald-500",
  },
];

const passwordRequirements = [
  { id: "length", text: "At least 8 characters", regex: /.{8,}/ },
  { id: "uppercase", text: "One uppercase letter", regex: /[A-Z]/ },
  { id: "lowercase", text: "One lowercase letter", regex: /[a-z]/ },
  { id: "number", text: "One number", regex: /\d/ },
  {
    id: "special",
    text: "One special character",
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password, {
        full_name: `${formData.firstName} ${formData.lastName}`,
        username: formData.firstName, // Using firstName as a simple username for now
        // TODO: Add user_type to profiles table and pass it here
      });

      toast({
        title: "Account created!",
        description:
          "Please check your email to verify your account and complete registration.",
        variant: "default",
      });
      // Don't redirect immediately, wait for email confirmation.
      // Or redirect to a "please check your email" page.
      // For now, we just show the toast and reset the loading state.
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getPasswordStrength = () => {
    const passed = passwordRequirements.filter((req) =>
      req.regex.test(formData.password),
    );
    return passed.length;
  };

  const isPasswordValid = () =>
    getPasswordStrength() === passwordRequirements.length;
  const doPasswordsMatch = () =>
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const canProceedToStep2 = () => userType !== "";
  const canSubmit = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      isPasswordValid() &&
      doPasswordsMatch() &&
      formData.agreeToTerms &&
      (userType !== "company" || formData.company)
    );
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center space-x-3 group mb-8"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-3xl font-bold text-jobequal-text dark:text-white tracking-tight">
                JobEqual
              </span>
            </Link>

            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-jobequal-green mr-3 animate-pulse" />
              <span className="text-jobequal-text-muted dark:text-gray-400 font-medium tracking-wide uppercase">
                Swiss Quality Registration
              </span>
            </div>

            <h1 className="text-4xl font-bold text-jobequal-text dark:text-white mb-4">
              Join the Future of
              <br />
              <span className="bg-gradient-to-r from-jobequal-green to-jobequal-teal bg-clip-text text-transparent">
                Career Matching
              </span>
            </h1>
            <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto">
              Choose your path and start your journey with Switzerland's premier
              job platform
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUserType(type.id)}
                className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  userType === type.id
                    ? "border-jobequal-green bg-jobequal-green-light dark:bg-jobequal-green/10 shadow-lg"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-jobequal-green hover:shadow-md"
                }`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${type.gradient} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-jobequal-text dark:text-white text-center mb-2">
                  {type.title}
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-300 text-center">
                  {type.description}
                </p>

                {userType === type.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-jobequal-green rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedToStep2()}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jobequal-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Continue</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-jobequal-text-muted dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-jobequal-green hover:text-jobequal-green-hover transition-colors"
              >
                Sign in →
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center text-jobequal-green hover:text-jobequal-green-hover mb-6 transition-colors"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to selection
            </button>

            <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">
              Create your account
            </h2>
            <p className="text-jobequal-text-muted dark:text-gray-300">
              As a {userTypes.find((t) => t.id === userType)?.title}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                  First name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                  Last name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Company Field (for recruiters/companies) */}
            {(userType === "recruiter" || userType === "company") && (
              <div>
                <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                  Company name
                </label>
                <input
                  name="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Company name"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  {passwordRequirements.map((req) => {
                    const isValid = req.regex.test(formData.password);
                    return (
                      <div key={req.id} className="flex items-center text-sm">
                        {isValid ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <span
                          className={
                            isValid
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200 ${
                    formData.confirmPassword && !doPasswordsMatch()
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !doPasswordsMatch() && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Passwords don't match
                </p>
              )}
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-jobequal-green focus:ring-jobequal-green border-gray-300 dark:border-gray-600 rounded mt-1"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-3 block text-sm text-jobequal-text-muted dark:text-gray-300"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-jobequal-green hover:text-jobequal-green-hover"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-jobequal-green hover:text-jobequal-green-hover"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="agreeToMarketing"
                  name="agreeToMarketing"
                  type="checkbox"
                  checked={formData.agreeToMarketing}
                  onChange={handleChange}
                  className="h-4 w-4 text-jobequal-green focus:ring-jobequal-green border-gray-300 dark:border-gray-600 rounded mt-1"
                />
                <label
                  htmlFor="agreeToMarketing"
                  className="ml-3 block text-sm text-jobequal-text-muted dark:text-gray-300"
                >
                  Send me job alerts and career tips (optional)
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!canSubmit() || isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-white bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jobequal-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Create account</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-jobequal-green/10 via-jobequal-teal/10 to-jobequal-blue/10 dark:from-jobequal-green/5 dark:via-jobequal-teal/5 dark:to-jobequal-blue/5 items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-jobequal-green rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-jobequal-teal rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-4xl font-bold text-jobequal-text dark:text-white mb-6">
              Welcome to the
              <br />
              <span className="bg-gradient-to-r from-jobequal-green to-jobequal-teal bg-clip-text text-transparent">
                Swiss Standard
              </span>
            </h3>
            <p className="text-lg text-jobequal-text-muted dark:text-gray-300 mb-8 leading-relaxed">
              Experience premium job matching with Swiss precision, security,
              and quality.
            </p>
            <div className="text-6xl mb-4">🏔️</div>
            <p className="text-sm text-jobequal-text-muted dark:text-gray-400 italic">
              "Quality is not an act, it is a habit" - Swiss Philosophy
            </p>
          </motion.div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
