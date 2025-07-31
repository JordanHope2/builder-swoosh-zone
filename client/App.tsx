import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AIChatbot } from "./components/AIChatbot";
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
import { PlaceholderPage } from "./components/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/careers" element={<Navigate to="/job-search" replace />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/cv-upload" element={<CVUpload />} />
          <Route path="/upload-cv" element={<CVUpload />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<EnhancedDashboard />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/candidate-profile" element={<CandidateProfile />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post-job" element={<PlaceholderPage title="Post a Job" description="Create and publish job listings to find the best candidates for your company." />} />
          <Route path="/applicants" element={<PlaceholderPage title="Applicant Management" description="Review and manage job applicants, schedule interviews, and track hiring progress." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/swipe" element={<SwipeDiscovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
