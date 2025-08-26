import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@components/Navigation";
import { PageHeader, SectionHeader } from "../components/ui/page-header";
import { ProtectedRoute } from "../components/ProtectedRoute";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Star,
  Eye,
  MessageSquare,
  BookmarkPlus,
  Users,
  TrendingUp,
  Award,
  Languages,
  Clock,
  DollarSign,
  ChevronDown,
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
  ExternalLink,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  experience: number;
  education: {
    degree: string;
    institution: string;
    year: number;
  };
  skills: string[];
  languages: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  availability:
    | "immediate"
    | "within-month"
    | "within-3-months"
    | "not-looking";
  remote: boolean;
  workPermit: boolean;
  profileStrength: number;
  matchScore: number;
  lastActive: string;
  premium: boolean;
  verified: boolean;
  summary: string;
  contact: {
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alexandra Chen",
    title: "Senior Frontend Developer",
    location: "Zurich, Switzerland",
    avatar: "👩‍💻",
    experience: 6,
    education: {
      degree: "MSc Computer Science",
      institution: "ETH Zurich",
      year: 2018,
    },
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL", "Next.js"],
    languages: ["English (Native)", "German (C1)", "Mandarin (Native)"],
    salaryRange: { min: 120000, max: 150000, currency: "CHF" },
    availability: "within-month",
    remote: true,
    workPermit: true,
    profileStrength: 95,
    matchScore: 92,
    lastActive: "2 hours ago",
    premium: true,
    verified: true,
    summary:
      "Passionate frontend developer with 6+ years building scalable React applications. Led team of 5 developers at previous role, specializing in performance optimization and user experience.",
    contact: {
      email: "alexandra.chen@email.com",
      linkedin: "https://linkedin.com/in/alexandrachen",
      github: "https://github.com/alexchen",
    },
  },
  {
    id: "2",
    name: "Marcus Weber",
    title: "Product Manager",
    location: "Geneva, Switzerland",
    avatar: "👨‍💼",
    experience: 8,
    education: {
      degree: "MBA",
      institution: "INSEAD",
      year: 2016,
    },
    skills: [
      "Product Strategy",
      "Agile",
      "Data Analysis",
      "A/B Testing",
      "Roadmapping",
    ],
    languages: ["German (Native)", "English (C2)", "French (C1)"],
    salaryRange: { min: 130000, max: 160000, currency: "CHF" },
    availability: "within-3-months",
    remote: false,
    workPermit: true,
    profileStrength: 88,
    matchScore: 85,
    lastActive: "1 day ago",
    premium: false,
    verified: true,
    summary:
      "Strategic product manager with 8 years experience launching B2B SaaS products. Increased user engagement by 40% and revenue by $2M in previous role.",
    contact: {
      email: "marcus.weber@email.com",
      phone: "+41 76 123 45 67",
      linkedin: "https://linkedin.com/in/marcusweber",
    },
  },
  {
    id: "3",
    name: "Sofia Rossi",
    title: "UX/UI Designer",
    location: "Basel, Switzerland",
    avatar: "👩‍🎨",
    experience: 4,
    education: {
      degree: "BA Design",
      institution: "FHNW Academy of Art and Design",
      year: 2020,
    },
    skills: [
      "Figma",
      "Sketch",
      "Prototyping",
      "User Research",
      "Design Systems",
    ],
    languages: ["Italian (Native)", "German (B2)", "English (C1)"],
    salaryRange: { min: 85000, max: 110000, currency: "CHF" },
    availability: "immediate",
    remote: true,
    workPermit: true,
    profileStrength: 91,
    matchScore: 78,
    lastActive: "3 hours ago",
    premium: true,
    verified: false,
    summary:
      "Creative UX designer passionate about human-centered design. Redesigned mobile app that increased user satisfaction by 35% and reduced support tickets by 50%.",
    contact: {
      email: "sofia.rossi@email.com",
      linkedin: "https://linkedin.com/in/sofiarossi",
    },
  },
];

const skillCategories = [
  "All Skills",
  "Frontend Development",
  "Backend Development",
  "Product Management",
  "Design",
  "Data Science",
  "DevOps",
  "Marketing",
  "Sales",
];

const locations = [
  "All Locations",
  "Zurich",
  "Geneva",
  "Basel",
  "Bern",
  "Lausanne",
  "Remote",
];

const experienceLevels = [
  "All Levels",
  "0-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
];

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  const handleContact = () => {
    setIsViewed(true);
    // In real app, this would track the contact event
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center text-2xl shadow-md">
              {candidate.avatar}
            </div>
            {candidate.verified && (
              <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-lg text-jobequal-text">
                {candidate.name}
              </h3>
              {candidate.premium && (
                <Star className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <p className="text-jobequal-green font-semibold mb-1">
              {candidate.title}
            </p>
            <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>{candidate.experience} years</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Active {candidate.lastActive}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              candidate.matchScore >= 90
                ? "bg-green-100 text-green-700"
                : candidate.matchScore >= 75
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{candidate.matchScore}% match</span>
            </div>
          </div>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? "text-jobequal-green bg-jobequal-green-light"
                : "text-gray-400 hover:text-jobequal-green"
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-jobequal-text-muted mb-4 leading-relaxed line-clamp-2">
        {candidate.summary}
      </p>

      {/* Education */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <GraduationCap className="w-4 h-4 text-jobequal-blue" />
          <span className="font-medium">{candidate.education.degree}</span>
          <span className="text-jobequal-text-muted">
            • {candidate.education.institution}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-jobequal-green-light text-jobequal-green text-xs font-medium rounded-lg"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Availability & Salary */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              candidate.availability === "immediate"
                ? "bg-green-100 text-green-700"
                : candidate.availability === "within-month"
                  ? "bg-blue-100 text-blue-700"
                  : candidate.availability === "within-3-months"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span className="text-xs font-medium">
              {candidate.availability === "immediate"
                ? "Available now"
                : candidate.availability === "within-month"
                  ? "Within month"
                  : candidate.availability === "within-3-months"
                    ? "Within 3 months"
                    : "Not looking"}
            </span>
          </div>
          {candidate.remote && (
            <div className="flex items-center space-x-1 text-jobequal-teal">
              <Globe className="w-3 h-3" />
              <span className="text-xs font-medium">Remote OK</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-jobequal-green font-semibold">
          <DollarSign className="w-4 h-4" />
          <span>
            {candidate.salaryRange.currency}{" "}
            {candidate.salaryRange.min.toLocaleString()}-
            {candidate.salaryRange.max.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() =>
            window.open(`mailto:${candidate.contact.email}`, "_blank")
          }
          className="flex-1 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-2 px-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact</span>
        </button>
        <Link
          to={`/candidate/${candidate.id}`}
          className="px-4 py-2 border border-jobequal-green text-jobequal-green rounded-xl font-semibold hover:bg-jobequal-green hover:text-white transition-all duration-200 flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Profile</span>
        </Link>
      </div>
    </motion.div>
  );
}

function FindCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [experienceFilter, setExperienceFilter] = useState("All Levels");
  const [candidates] = useState<Candidate[]>(mockCandidates);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesSkill =
      skillFilter === "All Skills" ||
      candidate.skills.some((skill) =>
        skillFilter
          .toLowerCase()
          .split(" ")
          .every((word) => skill.toLowerCase().includes(word)),
      );

    const matchesLocation =
      locationFilter === "All Locations" ||
      candidate.location.includes(locationFilter) ||
      (locationFilter === "Remote" && candidate.remote);

    const matchesExperience =
      experienceFilter === "All Levels" ||
      (experienceFilter === "0-2 years" && candidate.experience <= 2) ||
      (experienceFilter === "3-5 years" &&
        candidate.experience >= 3 &&
        candidate.experience <= 5) ||
      (experienceFilter === "6-10 years" &&
        candidate.experience >= 6 &&
        candidate.experience <= 10) ||
      (experienceFilter === "10+ years" && candidate.experience > 10);

    return (
      matchesSearch && matchesSkill && matchesLocation && matchesExperience
    );
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Talent Acquisition"
            title="Find Your Next Star Employee"
            description="Access Switzerland's top talent pool. Connect with pre-screened candidates ready to join your team and drive your business forward."
          >
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Users className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm font-medium text-jobequal-text">
                  {candidates.length}+ Active Candidates
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <CheckCircle className="w-4 h-4 text-jobequal-blue" />
                <span className="text-sm font-medium text-jobequal-text">
                  Verified Profiles
                </span>
              </div>
            </div>
          </PageHeader>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, title, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white appearance-none"
                >
                  {skillCategories.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white appearance-none"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white appearance-none"
                >
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-jobequal-text">
            {filteredCandidates.length} Candidate
            {filteredCandidates.length !== 1 ? "s" : ""} Found
          </h2>
          <div className="text-sm text-jobequal-text-muted">
            Sorted by best match
          </div>
        </div>

        {filteredCandidates.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredCandidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CandidateCard candidate={candidate} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-jobequal-text mb-2">
              No candidates found
            </h3>
            <p className="text-jobequal-text-muted mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSkillFilter("All Skills");
                setLocationFilter("All Locations");
                setExperienceFilter("All Levels");
              }}
              className="px-6 py-3 bg-jobequal-green text-white rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-3xl p-8 lg:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Post Your Job?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get access to our full candidate database and advanced search
              features
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/post-job"
                className="inline-flex items-center space-x-2 bg-white text-jobequal-green px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <Briefcase className="w-5 h-5" />
                <span>Post a Job</span>
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-jobequal-green transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                <span>View Pricing</span>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

export default function FindCandidates() {
  return (
    <ProtectedRoute>
      <FindCandidatesPage />
    </ProtectedRoute>
  );
}
