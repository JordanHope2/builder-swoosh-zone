import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { GoogleSignIn } from "./GoogleSignIn";

interface EnhancedSignInProps {
  redirectTo?: string;
}

export function EnhancedSignIn({
  redirectTo = "/dashboard",
}: EnhancedSignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mode, setMode] = useState<"signin" | "magic-link">("signin");

  const { signIn, signInWithOtp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signIn(email, password);
      setSuccess("Successfully signed in!");
      // Redirect after successful signin
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await signInWithOtp(email);
      setSuccess("Magic link sent! Check your email to sign in.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send magic link",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">JE</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-jobequal-text">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-jobequal-text-muted">
            Or{" "}
            <Link
              to="/signup"
              className="font-medium text-jobequal-green hover:text-jobequal-green-hover"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-white text-jobequal-text shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setMode("magic-link")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === "magic-link"
                  ? "bg-white text-jobequal-text shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form
            onSubmit={mode === "signin" ? handleSignIn : handleMagicLink}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-jobequal-text mb-2"
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
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-jobequal-text rounded-lg focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-jobequal-green focus:z-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field (only for password mode) */}
            {mode === "signin" && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-jobequal-text mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-jobequal-text rounded-lg focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-jobequal-green focus:z-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-jobequal-green to-jobequal-teal hover:from-jobequal-green-hover hover:to-jobequal-teal-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jobequal-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Send Magic Link"
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <GoogleSignIn redirectTo={redirectTo} />

            {/* Forgot Password Link (only for password mode) */}
            {mode === "signin" && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode("magic-link")}
                  className="text-sm text-jobequal-green hover:text-jobequal-green-hover"
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
