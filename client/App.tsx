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
          <Route path="/jobs" element={<PlaceholderPage title="Browse Jobs" description="The jobs listing page will include advanced filters, search functionality, and detailed job descriptions. Ask me to implement specific features for this page!" />} />
          <Route path="/companies" element={<PlaceholderPage title="Companies" description="Explore top companies hiring through JobEqual. This section will showcase company profiles, culture insights, and open positions." />} />
          <Route path="/about" element={<PlaceholderPage title="About JobEqual" description="Learn about our mission to match aspirations with opportunities. This page will detail our story, values, and team." />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" description="Get in touch with our team. This page will include contact forms, office locations, and support information." />} />
          <Route path="/login" element={<PlaceholderPage title="Sign In" description="User authentication page with login form, social login options, and password recovery." />} />
          <Route path="/signup" element={<PlaceholderPage title="Get Started" description="User registration page with signup form and onboarding flow for new users." />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
