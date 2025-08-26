import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navigation } from "@components/Navigation";
import { EnhancedApplicationForm } from "../components/EnhancedApplicationForm";
import {
  PageTransition,
  AnimatedButton,
} from "../components/ui/enhanced-motion";
import { JobShareButton } from "../components/ui/share-button";
import { AIMatchReportModal } from "../components/ui/ai-match-report";
import { CityEventsModal } from "../components/ui/city-events-modal";
import { applicationToast } from "../hooks/use-toast";
import {
  MapPin,
  Clock,
  Building,
  ArrowLeft,
  Bookmark,
  Share2,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  TrendingUp,
  Globe,
  Award,
  Zap,
  Target,
} from "lucide-react";

// Mock job data - in real app this would come from API
const mockJob = {
  id: "1",
  title: "Senior Software Engineer",
  company: "TechCorp Zurich",
  location: "Zurich, Switzerland",
  salary: "CHF 120,000 - 140,000",
  type: "Full-time",
  remote: true,
  logo: "🚀",
  featured: true,
  posted: "2 days ago",
  deadline: "2024-02-15",
  applicants: 24,
  views: 156,
  matchScore: 95,
  description: `Join our innovative team building next-generation financial technology solutions that serve millions of users worldwide. We're looking for a passionate Senior Software Engineer to help us scale our platform and deliver exceptional user experiences.

As a Senior Software Engineer, you'll work on challenging problems in a collaborative environment where your contributions directly impact the product. You'll have the opportunity to mentor junior developers, architect solutions, and work with cutting-edge technologies.`,

  responsibilities: [
    "Design and develop scalable web applications using React and TypeScript",
    "Collaborate with cross-functional teams to define and implement new features",
    "Mentor junior developers and participate in code reviews",
    "Optimize application performance and ensure high code quality",
    "Participate in architectural decisions and technical planning",
    "Work with product managers to translate business requirements into technical solutions",
  ],

  requirements: [
    "5+ years of experience in software development",
    "Strong proficiency in React, TypeScript, and modern JavaScript",
    "Experience with Node.js and backend development",
    "Knowledge of cloud platforms (AWS, Azure, or GCP)",
    "Experience with agile development methodologies",
    "Excellent communication skills in English and German",
    "Bachelor's degree in Computer Science or related field",
  ],

  niceToHave: [
    "Experience with fintech or financial services",
    "Knowledge of microservices architecture",
    "Experience with Docker and Kubernetes",
    "Previous startup experience",
    "Open source contributions",
  ],

  benefits: [
    "Competitive salary and equity package",
    "Flexible working hours and remote work options",
    "Comprehensive health insurance",
    "25 days paid vacation + Swiss holidays",
    "Professional development budget (CHF 3,000/year)",
    "Modern office in Zurich with all amenities",
    "Team events and company retreats",
    "Pension plan contributions",
  ],

  companyInfo: {
    name: "TechCorp Zurich",
    size: "200-500 employees",
    industry: "Financial Technology",
    founded: "2015",
    website: "https://techcorp.ch",
    description:
      "TechCorp is a leading fintech company revolutionizing how people manage their finances. We combine cutting-edge technology with user-centric design to create products that millions trust with their financial future.",
  },
};

function ApplicationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    portfolio: "",
    availability: "",
  });

  const handleSubmit = async () => {
    try {
      // Here you would typically send the application data to your backend
      const submissionData = {
        ...applicationData,
        jobId: mockJob.id,
        jobTitle: mockJob.title,
        timestamp: new Date().toISOString(),
      };

      console.log("Submitting application:", submissionData);

      // Simulate API call with loading state
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success toast with job title and timestamp
      applicationToast.success(mockJob.title, new Date().toLocaleTimeString());

      // Reset form and close modal
      setApplicationData({ coverLetter: "", portfolio: "", availability: "" });
      onClose();
    } catch (error) {
      // Show error toast if submission fails
      applicationToast.error("Failed to submit application. Please try again.");
      console.error("Application submission error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-jobequal-text">
            Apply for this Position
          </h3>
          <button
            onClick={onClose}
            className="text-jobequal-text-muted hover:text-jobequal-text transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-jobequal-text font-semibold mb-3">
              Cover Letter
            </label>
            <textarea
              value={applicationData.coverLetter}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  coverLetter: e.target.value,
                })
              }
              placeholder="Tell us why you're interested in this role..."
              className="w-full h-32 p-4 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-jobequal-text font-semibold mb-3">
              Portfolio/Website (Optional)
            </label>
            <input
              type="url"
              value={applicationData.portfolio}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  portfolio: e.target.value,
                })
              }
              placeholder="https://your-portfolio.com"
              className="w-full p-4 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-jobequal-text font-semibold mb-3">
              Availability
            </label>
            <select
              value={applicationData.availability}
              onChange={(e) =>
                setApplicationData({
                  ...applicationData,
                  availability: e.target.value,
                })
              }
              className="w-full p-4 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
            >
              <option value="">Select availability</option>
              <option value="immediate">Immediate</option>
              <option value="2weeks">2 weeks notice</option>
              <option value="1month">1 month notice</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-jobequal-green-light text-jobequal-green-dark py-4 rounded-xl font-semibold hover:bg-jobequal-neutral transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isAIMatchModalOpen, setIsAIMatchModalOpen] = useState(false);
  const [isCityEventsModalOpen, setIsCityEventsModalOpen] = useState(false);

  // In real app, fetch job data based on id
  const job = mockJob;

  // Generate profiles for AI analysis
  const generateJobProfile = () => ({
    title: job.title,
    company: job.company,
    description: job.description,
    requirements: job.responsibilities,
    location: job.location,
    salaryRange: { min: 120000, max: 140000 },
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  });

  const generateCandidateProfile = () => ({
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    experience: {
      years: 5,
      positions: [
        {
          title: "Senior Software Engineer",
          company: "Tech Solutions AG",
          duration: "2021-Present",
          technologies: ["React", "TypeScript", "AWS"],
        },
      ],
    },
    education: {
      degree: "Master of Science",
      field: "Computer Science",
      institution: "ETH Zurich",
    },
    location: "Zurich, Switzerland",
    salaryExpectation: { min: 110000, max: 130000 },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <Link
          to="/job-search"
          className="inline-flex items-center space-x-2 text-jobequal-text-muted hover:text-jobequal-green transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Job Search</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* AI Match Score - Prominent Banner */}
            <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-3xl p-6 mb-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Zap className="w-8 h-8 text-white" />
                <span className="text-4xl font-bold text-white">
                  {job.matchScore}%
                </span>
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Excellent AI Match!
              </h2>
              <p className="text-white/90">
                This job aligns perfectly with your skills and experience
              </p>
            </div>

            {/* Job Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark mb-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl flex items-center justify-center text-4xl shadow-lg">
                    {job.logo}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      {job.featured && (
                        <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>Featured</span>
                        </div>
                      )}
                      {job.remote && (
                        <div className="bg-jobequal-blue text-white text-sm font-semibold px-4 py-2 rounded-full">
                          Remote Available
                        </div>
                      )}
                    </div>
                    <h1 className="text-4xl font-bold text-jobequal-text mb-3 leading-tight">
                      {job.title}
                    </h1>
                    <p className="text-2xl text-jobequal-text-muted font-medium">
                      {job.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <JobShareButton
                    job={{ id: job.id, title: job.title, company: job.company }}
                  />
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-xl border border-jobequal-neutral-dark transition-all duration-200 ${
                      isBookmarked
                        ? "bg-red-50 text-red-500"
                        : "text-jobequal-text-muted hover:text-red-500"
                    }`}
                  >
                    <Bookmark
                      className={`w-6 h-6 ${isBookmarked ? "fill-current" : ""}`}
                    />
                  </button>
                  <button className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <button
                  onClick={() => setIsCityEventsModalOpen(true)}
                  className="flex items-center space-x-3 text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
                >
                  <MapPin className="w-5 h-5 text-jobequal-green group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-sm text-jobequal-text-muted">
                      Location
                    </div>
                    <div className="font-semibold text-jobequal-text group-hover:text-jobequal-green group-hover:underline">
                      {job.location}
                    </div>
                  </div>
                </button>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-jobequal-blue-dark" />
                  <div>
                    <div className="text-sm text-jobequal-text-muted">Type</div>
                    <div className="font-semibold text-jobequal-text">
                      {job.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-jobequal-green" />
                  <div>
                    <div className="text-sm text-jobequal-text-muted">
                      Salary
                    </div>
                    <div className="font-semibold text-jobequal-green">
                      {job.salary}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-jobequal-text-muted" />
                  <div>
                    <div className="text-sm text-jobequal-text-muted">
                      Posted
                    </div>
                    <div className="font-semibold text-jobequal-text">
                      {job.posted}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsAIMatchModalOpen(true)}
                  className="flex items-center space-x-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 p-2 rounded-lg transition-all group"
                >
                  <Zap className="w-5 h-5 text-blue-500 group-hover:scale-110 group-hover:animate-pulse transition-transform" />
                  <div>
                    <div className="text-sm text-jobequal-text-muted">
                      AI Match
                    </div>
                    <div className="font-bold text-blue-600 group-hover:text-purple-600">
                      {job.matchScore}%
                    </div>
                  </div>
                </button>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setIsApplicationModalOpen(true)}
                className="w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Apply for this Position
              </button>
            </div>

            {/* Job Description */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark mb-8">
              <h2 className="text-3xl font-bold text-jobequal-text mb-6">
                About this Role
              </h2>
              <div className="prose prose-lg max-w-none text-jobequal-text-muted leading-relaxed">
                {job.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark mb-8">
              <h2 className="text-3xl font-bold text-jobequal-text mb-6">
                Key Responsibilities
              </h2>
              <ul className="space-y-4">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-jobequal-green mt-0.5 flex-shrink-0" />
                    <span className="text-jobequal-text-muted leading-relaxed">
                      {responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark mb-8">
              <h2 className="text-3xl font-bold text-jobequal-text mb-6">
                Requirements
              </h2>
              <ul className="space-y-4 mb-8">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-jobequal-blue-dark mt-0.5 flex-shrink-0" />
                    <span className="text-jobequal-text-muted leading-relaxed">
                      {requirement}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold text-jobequal-text mb-4">
                Nice to Have
              </h3>
              <ul className="space-y-3">
                {job.niceToHave.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-jobequal-green mt-0.5 flex-shrink-0" />
                    <span className="text-jobequal-text-muted leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark">
              <h2 className="text-3xl font-bold text-jobequal-text mb-6">
                Benefits & Perks
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-jobequal-green mt-0.5 flex-shrink-0" />
                    <span className="text-jobequal-text-muted leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Company Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark mb-8 sticky top-24">
              <h3 className="text-2xl font-bold text-jobequal-text mb-6">
                About {job.companyInfo.name}
              </h3>

              <div className="space-y-6">
                <p className="text-jobequal-text-muted leading-relaxed">
                  {job.companyInfo.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-jobequal-text-muted">
                      Company Size
                    </span>
                    <span className="font-semibold text-jobequal-text">
                      {job.companyInfo.size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-jobequal-text-muted">Industry</span>
                    <span className="font-semibold text-jobequal-text">
                      {job.companyInfo.industry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-jobequal-text-muted">Founded</span>
                    <span className="font-semibold text-jobequal-text">
                      {job.companyInfo.founded}
                    </span>
                  </div>
                </div>

                <a
                  href={job.companyInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-jobequal-green-light text-jobequal-green-dark py-3 rounded-xl font-semibold hover:bg-jobequal-green hover:text-white transition-all duration-200"
                >
                  <Globe className="w-5 h-5" />
                  <span>Visit Website</span>
                </a>
              </div>
            </div>

            {/* Job Stats */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark">
              <h3 className="text-2xl font-bold text-jobequal-text mb-6">
                Job Statistics
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-jobequal-green" />
                    <span className="text-jobequal-text-muted">Applicants</span>
                  </div>
                  <span className="font-bold text-2xl text-jobequal-green">
                    {job.applicants}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-jobequal-blue-dark" />
                    <span className="text-jobequal-text-muted">Views</span>
                  </div>
                  <span className="font-bold text-2xl text-jobequal-blue-dark">
                    {job.views}
                  </span>
                </div>

                <div className="pt-4 border-t border-jobequal-neutral-dark">
                  <div className="flex items-center justify-between">
                    <span className="text-jobequal-text-muted">
                      Application Deadline
                    </span>
                    <span className="font-semibold text-jobequal-text">
                      {job.deadline}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
      />

      {/* AI Match Report Modal */}
      <AIMatchReportModal
        isOpen={isAIMatchModalOpen}
        onClose={() => setIsAIMatchModalOpen(false)}
        jobId={job.id}
        userId="guest-user"
        initialMatchPercent={job.matchScore}
        jobProfile={generateJobProfile()}
        candidateProfile={generateCandidateProfile()}
      />

      {/* City Events Modal */}
      <CityEventsModal
        isOpen={isCityEventsModalOpen}
        onClose={() => setIsCityEventsModalOpen(false)}
        cityName={job.location.split(",")[0].trim()}
      />
    </main>
  );
}
