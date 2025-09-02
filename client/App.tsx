import "./global.css";

import { Toaster } from "./components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { AuthProvider } from "./contexts/AuthContext";
import { JobsProvider } from "./contexts/JobsContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SharedLayout } from "./components/SharedLayout";
import { EnhancedAIChatbot } from "./components/EnhancedAIChatbot";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import CVUpload from "./pages/CVUpload";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Companies from "./pages/Companies";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SwipeDiscovery from "./pages/SwipeDiscovery";
import Onboarding from "./pages/Onboarding";
import { PlaceholderPage } from "./components/PlaceholderPage";
import CVReviewBooking from "./pages/CVReviewBooking";
import AIScore from "./pages/AIScore";
import OwnerAdminDashboard from "./pages/OwnerAdminDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import SalaryGuide from "./pages/SalaryGuide";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import CompanyDetail from "./pages/CompanyDetail";
import Favorites from "./pages/Favorites";
import CompanyDashboard from "./pages/CompanyDashboard";
import RoleSwitcher from "./pages/RoleSwitcher";
import SubscriptionBilling from "./pages/SubscriptionBilling";
import Messages from "./pages/Messages";
import UploadTest from "./pages/UploadTest";
import SystemStatus from "./pages/SystemStatus";
import Applications from "./pages/Applications";
import CareerTips from "./pages/CareerTips";
import FindCandidates from "./pages/FindCandidates";
import PostJob from "./pages/PostJob";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <JobsProvider>
            <FavoritesProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <SharedLayout>
                    <Routes>
                      {/* Home & jobs */}
                      <Route path="/" element={<Index />} />
                    <Route path="/jobs" element={<JobSearch />} />
                    <Route path="/job-search" element={<JobSearch />} />
                    <Route
                      path="/careers"
                      element={<Navigate to="/job-search" replace />}
                    />
                    <Route path="/job/:id" element={<JobDetails />} />

                    {/* CV */}
                    <Route path="/cv-upload" element={<CVUpload />} />
                    <Route path="/upload-cv" element={<CVUpload />} />

                    {/* Auth — URL canonique = /signin */}
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/reset-password"
                      element={<Navigate to="/forgot-password" replace />}
                    />
                    <Route
                      path="/login"
                      element={<Navigate to="/signin" replace />}
                    />
                    <Route
                      path="/sign-in"
                      element={<Navigate to="/signin" replace />}
                    />

                    {/* Protected Dashboards */}
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/candidate-dashboard" replace />}
                    />
                    <Route
                      path="/candidate-dashboard"
                      element={
                        <ProtectedRoute>
                          <CandidateDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <CandidateProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/candidate-profile"
                      element={
                        <ProtectedRoute>
                          <CandidateProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/recruiter-dashboard"
                      element={
                        <ProtectedRoute allowedRoles={['recruiter', 'pro', 'admin']}>
                          <RecruiterDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/company-dashboard"
                      element={
                        <ProtectedRoute>
                          <CompanyDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Companies */}
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/company/:id" element={<CompanyDetail />} />

                    {/* Static pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/ai-score" element={<AIScore />} />
                    <Route path="/cv-review" element={<CVReviewBooking />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <OwnerAdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <ProfileSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile-settings"
                      element={
                        <ProtectedRoute>
                          <ProfileSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings/security"
                      element={<Navigate to="/settings?tab=security" replace />}
                    />
                    <Route
                      path="/settings/privacy"
                      element={<Navigate to="/settings?tab=privacy" replace />}
                    />
                    <Route
                      path="/settings/notifications"
                      element={
                        <Navigate to="/settings?tab=notifications" replace />
                      }
                    />
                    <Route path="/salary-guide" element={<SalaryGuide />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route
                      path="/terms-of-service"
                      element={<TermsOfService />}
                    />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/system-status" element={<SystemStatus />} />
                    <Route path="/status" element={<SystemStatus />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/career-tips" element={<CareerTips />} />
                    <Route
                      path="/find-candidates"
                      element={<FindCandidates />}
                    />
                    <Route path="/post-job" element={<PostJob />} />
                    <Route
                      path="/favorites"
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/role-switcher" element={<RoleSwitcher />} />
                    <Route
                      path="/applicants"
                      element={
                        <PlaceholderPage
                          title="Applicant Management"
                          description="Review and manage job applicants, schedule interviews, and track hiring progress."
                        />
                      }
                    />
                    <Route
                      path="/swipe"
                      element={
                        <ProtectedRoute>
                          <SwipeDiscovery />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/subscription"
                      element={
                        <ProtectedRoute>
                          <SubscriptionBilling />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/billing"
                      element={
                        <ProtectedRoute>
                          <SubscriptionBilling />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/upload-test"
                      element={
                        <ProtectedRoute>
                          <UploadTest />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all 404 */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </SharedLayout>
                  <EnhancedAIChatbot />
                </BrowserRouter>
              </TooltipProvider>
            </FavoritesProvider>
          </JobsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
