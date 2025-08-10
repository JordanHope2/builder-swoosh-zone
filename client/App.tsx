import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { EnhancedAIChatbot } from "./components/EnhancedAIChatbot";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import CVUpload from "./pages/CVUpload";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Companies from "./pages/Companies";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SwipeDiscovery from "./pages/SwipeDiscovery";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import Onboarding from "./pages/Onboarding";
import { PlaceholderPage } from "./components/PlaceholderPage";
import CVReviewBooking from "./pages/CVReviewBooking";
import AIScore from "./pages/AIScore";
import AdminPanel from "./pages/AdminPanel";
import ProfileSettings from "./pages/ProfileSettings";
import SalaryGuide from "./pages/SalaryGuide";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";
import Pricing from "./pages/Pricing";
import CompanyDetail from "./pages/CompanyDetail";
import Favorites from "./pages/Favorites";
import CompanyDashboard from "./pages/CompanyDashboard";
import EnhancedRecruiterDashboard from "./pages/EnhancedRecruiterDashboard";
import OwnerAdminDashboard from "./pages/OwnerAdminDashboard";
import RoleSwitcher from "./pages/RoleSwitcher";
import SubscriptionBilling from "./pages/SubscriptionBilling";
import Messages from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Home & jobs */}
                <Route path="/" element={<Index />} />
                <Route path="/jobs" element={<JobSearch />} />
                <Route path="/job-search" element={<JobSearch />} />
                <Route path="/careers" element={<Navigate to="/job-search" replace />} />
                <Route path="/job/:id" element={<JobDetails />} />

                {/* CV */}
                <Route path="/cv-upload" element={<CVUpload />} />
                <Route path="/upload-cv" element={<CVUpload />} />

                {/* Auth — URL canonique = /signin */}
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<Navigate to="/signin" replace />} />
                <Route path="/sign-in" element={<Navigate to="/signin" replace />} />

                {/* Dashboards */}
                <Route path="/dashboard" element={<EnhancedDashboard />} />
                <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
                <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
                <Route path="/profile" element={<CandidateProfile />} />
                <Route path="/candidate-profile" element={<CandidateProfile />} />
                <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
                <Route path="/company-dashboard" element={<CompanyDashboard />} />
                <Route path="/enhanced-recruiter-dashboard" element={<EnhancedRecruiterDashboard />} />
                <Route path="/owner-admin-dashboard" element={<OwnerAdminDashboard />} />

                {/* Companies */}
                <Route path="/companies" element={<Companies />} />
                <Route path="/company/:id" element={<CompanyDetail />} />

                {/* Static pages */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/ai-score" element={<AIScore />} />
                <Route path="/cv-review" element={<CVReviewBooking />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/settings" element={<ProfileSettings />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/salary-guide" element={<SalaryGuide />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/favorites" element={<Favorites />} />

                {/* Misc */}
                <Route
                  path="/post-job"
                  element={
                    <PlaceholderPage
                      title="Post a Job"
                      description="Create and publish job listings to find the best candidates for your company."
                    />
                  }
                />
                <Route
                  path="/applicants"
                  element={
                    <PlaceholderPage
                      title="Applicant Management"
                      description="Review and manage job applicants, schedule interviews, and track hiring progress."
                    />
                  }
                />
                <Route path="/swipe" element={<SwipeDiscovery />} />
                <Route path="/subscription" element={<SubscriptionBilling />} />
                <Route path="/billing" element={<SubscriptionBilling />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat" element={<Messages />} />

                {/* Catch-all 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <EnhancedAIChatbot />
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
