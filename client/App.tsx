import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import CVUpload from "./pages/CVUpload";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { PlaceholderPage } from "./components/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/cv-upload" element={<CVUpload />} />
          <Route path="/upload-cv" element={<CVUpload />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/companies" element={<PlaceholderPage title="Companies" description="Explore top companies hiring through JobEqual. This section will showcase company profiles, culture insights, and open positions." />} />
          <Route path="/about" element={<PlaceholderPage title="About JobEqual" description="Learn about our mission to match aspirations with opportunities. This page will detail our story, values, and team." />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" description="Get in touch with our team. This page will include contact forms, office locations, and support information." />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" description="Your personalized dashboard with job recommendations, applications, and profile management." />} />
          <Route path="/profile" element={<PlaceholderPage title="My Profile" description="Manage your profile, update your CV, and track your job applications." />} />
          <Route path="/recruiter-dashboard" element={<PlaceholderPage title="Recruiter Dashboard" description="Manage your job postings, review candidates, and track hiring progress." />} />
          <Route path="/post-job" element={<PlaceholderPage title="Post a Job" description="Create and publish job listings to find the best candidates for your company." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
