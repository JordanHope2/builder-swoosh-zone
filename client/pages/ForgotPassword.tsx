import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, Sparkles, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "../components/ThemeProvider";
import { applicationToast } from "../hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      applicationToast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      applicationToast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would call supabase.auth.resetPasswordForEmail(email)
      console.log("Password reset requested for:", email);

      setIsSubmitted(true);
      applicationToast.success(
        "Reset link sent!",
        "Check your email for further instructions.",
      );
    } catch (err: unknown) {
      applicationToast.error("Failed to send reset email. Please try again.");
      console.error("Password reset error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
              Check Your Email
            </h2>
            <p className="text-jobequal-text-muted dark:text-gray-300 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-8">
              Don't see the email? Check your spam folder or try again with a
              different email address.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Link
              to="/signin"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-jobequal-text dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
            >
              Try a different email
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-6"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
                <span className="text-3xl font-bold text-jobequal-text dark:text-white tracking-tight">
                  JobEqual
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">
                Reset your password
              </h2>
              <p className="text-jobequal-text-muted dark:text-gray-300">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-jobequal-text dark:text-white mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-white bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jobequal-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Sending reset link...
                </div>
              ) : (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>Send reset link</span>
                </div>
              )}
            </button>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                to="/signin"
                className="inline-flex items-center space-x-2 font-medium text-jobequal-green hover:text-jobequal-green-hover transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </motion.form>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-jobequal-green/10 via-jobequal-teal/10 to-jobequal-blue/10 dark:from-jobequal-green/5 dark:via-jobequal-teal/5 dark:to-jobequal-blue/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-jobequal-green rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-jobequal-teal rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-jobequal-green mr-3 animate-pulse" />
              <span className="text-jobequal-text-muted dark:text-gray-400 font-medium tracking-wide uppercase">
                Secure & Trusted
              </span>
            </div>
            <h3 className="text-4xl font-bold text-jobequal-text dark:text-white mb-4 leading-tight">
              Your Account
              <br />
              <span className="bg-gradient-to-r from-jobequal-green to-jobequal-teal bg-clip-text text-transparent">
                Is Safe With Us
              </span>
            </h3>
            <p className="text-lg text-jobequal-text-muted dark:text-gray-300 leading-relaxed">
              We use industry-standard security measures to protect your account
              and ensure your data privacy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start space-x-4"
          >
            <div className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-jobequal-green" />
            </div>
            <div>
              <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Swiss-Level Security
              </h4>
              <p className="text-jobequal-text-muted dark:text-gray-300">
                Your password reset is handled with the same security standards
                used by Swiss financial institutions.
              </p>
            </div>
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
