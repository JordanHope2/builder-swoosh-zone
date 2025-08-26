import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@components/Navigation";
import { PageHeader } from "../components/ui/page-header";
import { CompanyShareButton } from "../components/ui/share-button";
import {
  Building,
  MapPin,
  Users,
  TrendingUp,
  Award,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Star,
  Briefcase,
  Globe,
  Heart,
  CheckCircle,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  canton: string;
  description: string;
  website: string;
  openJobs: number;
  rating: number;
  reviewCount: number;
  benefits: string[];
  techStack: string[];
  remotePolicy: "onsite" | "hybrid" | "remote" | "flexible";
  verified: boolean;
  featured: boolean;
  founded: number;
  funding: string;
  growthStage: "startup" | "scaleup" | "enterprise";
}

const companies: Company[] = [
  {
    id: "1",
    name: "TechCorp Zurich",
    logo: "🏢",
    industry: "Financial Technology",
    size: "200-500",
    location: "Zurich",
    canton: "Zurich",
    description:
      "Leading fintech company revolutionizing digital banking solutions across Europe.",
    website: "https://techcorp.ch",
    openJobs: 12,
    rating: 4.8,
    reviewCount: 156,
    benefits: [
      "Health Insurance",
      "Flexible Hours",
      "Remote Work",
      "Learning Budget",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "AWS"],
    remotePolicy: "hybrid",
    verified: true,
    featured: true,
    founded: 2015,
    funding: "Series B",
    growthStage: "scaleup",
  },
  {
    id: "2",
    name: "Swiss Innovations",
    logo: "🔬",
    industry: "Biotechnology",
    size: "50-200",
    location: "Basel",
    canton: "Basel-Stadt",
    description:
      "Pioneering biotech research and development for next-generation therapeutics.",
    website: "https://swissinnovations.com",
    openJobs: 8,
    rating: 4.6,
    reviewCount: 89,
    benefits: [
      "Research Budget",
      "Conference Travel",
      "Health Insurance",
      "Stock Options",
    ],
    techStack: ["Python", "R", "Docker", "Kubernetes"],
    remotePolicy: "onsite",
    verified: true,
    featured: false,
    founded: 2018,
    funding: "Series A",
    growthStage: "startup",
  },
  {
    id: "3",
    name: "Alpine Digital",
    logo: "⛰️",
    industry: "Software Development",
    size: "10-50",
    location: "Geneva",
    canton: "Geneva",
    description:
      "Boutique software consultancy specializing in enterprise digital transformation.",
    website: "https://alpinedigital.ch",
    openJobs: 5,
    rating: 4.9,
    reviewCount: 34,
    benefits: [
      "Unlimited PTO",
      "Remote Work",
      "Profit Sharing",
      "Training Budget",
    ],
    techStack: ["TypeScript", "React", "Next.js", "Supabase"],
    remotePolicy: "remote",
    verified: true,
    featured: true,
    founded: 2020,
    funding: "Bootstrapped",
    growthStage: "startup",
  },
  {
    id: "4",
    name: "SwissBank Digital",
    logo: "🏦",
    industry: "Banking",
    size: "1000+",
    location: "Bern",
    canton: "Bern",
    description:
      "Traditional Swiss bank embracing digital transformation and innovative banking solutions.",
    website: "https://swissbank.ch",
    openJobs: 25,
    rating: 4.2,
    reviewCount: 312,
    benefits: [
      "Pension Plan",
      "Health Insurance",
      "Bonuses",
      "Career Development",
    ],
    techStack: ["Java", "Spring", "Oracle", "Jenkins"],
    remotePolicy: "flexible",
    verified: true,
    featured: false,
    founded: 1856,
    funding: "Public",
    growthStage: "enterprise",
  },
  {
    id: "5",
    name: "Crypto Valley Labs",
    logo: "₿",
    industry: "Blockchain",
    size: "20-50",
    location: "Zug",
    canton: "Zug",
    description:
      "Blockchain and cryptocurrency research lab developing next-gen DeFi protocols.",
    website: "https://cryptovalleylabs.com",
    openJobs: 7,
    rating: 4.7,
    reviewCount: 45,
    benefits: ["Crypto Salary", "Remote Work", "Equity", "Conference Budget"],
    techStack: ["Solidity", "Rust", "Web3", "IPFS"],
    remotePolicy: "remote",
    verified: true,
    featured: true,
    founded: 2019,
    funding: "Token Sale",
    growthStage: "startup",
  },
  {
    id: "6",
    name: "MedTech Innovations",
    logo: "🏥",
    industry: "Medical Technology",
    size: "100-200",
    location: "Lausanne",
    canton: "Vaud",
    description:
      "Medical device company developing AI-powered diagnostic and treatment solutions.",
    website: "https://medtechinnovations.ch",
    openJobs: 15,
    rating: 4.5,
    reviewCount: 78,
    benefits: [
      "Research Time",
      "Health Insurance",
      "Patent Bonuses",
      "Continuing Education",
    ],
    techStack: ["Python", "TensorFlow", "C++", "Azure"],
    remotePolicy: "hybrid",
    verified: true,
    featured: false,
    founded: 2017,
    funding: "Series A",
    growthStage: "scaleup",
  },
];

const industries = [
  "All Industries",
  "Financial Technology",
  "Biotechnology",
  "Software Development",
  "Banking",
  "Blockchain",
  "Medical Technology",
];
const companySizes = [
  "All Sizes",
  "1-10",
  "10-50",
  "50-200",
  "200-500",
  "500-1000",
  "1000+",
];
const cantons = [
  "All Cantons",
  "Zurich",
  "Geneva",
  "Basel-Stadt",
  "Bern",
  "Vaud",
  "Zug",
];
const remotePolicies = [
  "All Policies",
  "onsite",
  "hybrid",
  "remote",
  "flexible",
];
const sortOptions = ["relevance", "newest", "size", "rating", "jobs"];

function CompanyCard({ company, index }: { company: Company; index: number }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-jobequal-green/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {company.logo}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-jobequal-text group-hover:text-jobequal-green transition-colors">
                {company.name}
              </h3>
              {company.verified && (
                <CheckCircle className="w-5 h-5 text-jobequal-green" />
              )}
              {company.featured && <Star className="w-5 h-5 text-yellow-500" />}
            </div>
            <p className="text-jobequal-text-muted font-medium">
              {company.industry}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <CompanyShareButton
            company={{ id: company.id, name: company.name }}
          />
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors ${
              isLiked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
            }`}
            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isLiked}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-jobequal-text-muted mb-6 leading-relaxed">
        {company.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-jobequal-green" />
          <span className="text-sm text-jobequal-text-muted">
            {company.location}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-jobequal-blue" />
          <span className="text-sm text-jobequal-text-muted">
            {company.size} employees
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-jobequal-teal" />
          <span className="text-sm text-jobequal-text-muted">
            {company.openJobs} open jobs
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-jobequal-text-muted">
            {company.rating} ({company.reviewCount})
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {company.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-jobequal-green-light text-jobequal-green text-xs font-medium rounded-lg"
            >
              {tech}
            </span>
          ))}
          {company.techStack.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
              +{company.techStack.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Remote Policy */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            company.remotePolicy === "remote"
              ? "bg-green-100 text-green-800"
              : company.remotePolicy === "hybrid"
                ? "bg-blue-100 text-blue-800"
                : company.remotePolicy === "flexible"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          <Globe className="w-3 h-3 mr-1" />
          {company.remotePolicy.charAt(0).toUpperCase() +
            company.remotePolicy.slice(1)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Link
          to={`/company/${company.id}`}
          className="flex-1 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-semibold text-center hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 transform hover:scale-105"
        >
          View Company
        </Link>
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 border border-jobequal-neutral-dark rounded-xl text-jobequal-text-muted hover:text-jobequal-green hover:border-jobequal-green transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </motion.div>
  );
}

function FilterSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:ring-offset-2 rounded-lg"
        aria-expanded={isOpen}
        aria-controls="filter-content"
        aria-label={isOpen ? "Hide filters" : "Show filters"}
      >
        <div className="flex items-center space-x-3">
          <SlidersHorizontal className="w-5 h-5 text-jobequal-green" />
          <span className="font-semibold text-jobequal-text">Filters</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-jobequal-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="filter-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            role="region"
            aria-label="Filter options"
          >
            <div>
              <label className="block text-sm font-medium text-jobequal-text mb-2">
                Industry
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent">
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jobequal-text mb-2">
                Company Size
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent">
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jobequal-text mb-2">
                Canton
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent">
                {cantons.map((canton) => (
                  <option key={canton} value={canton}>
                    {canton}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jobequal-text mb-2">
                Remote Policy
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent">
                {remotePolicies.map((policy) => (
                  <option key={policy} value={policy}>
                    {policy}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");

  const filteredCompanies = useMemo(() => {
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Company Directory"
            title="Discover Switzerland's Top Employers"
            description="Connect with innovative companies across Switzerland. From startups to enterprises, find your next career opportunity with leading Swiss employers."
          >
            <div className="flex items-center justify-center space-x-3 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <CheckCircle className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm font-medium text-jobequal-text">
                  Designed in Switzerland
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Building className="w-4 h-4 text-jobequal-blue" />
                <span className="text-sm font-medium text-jobequal-text">
                  {companies.length}+ Companies
                </span>
              </div>
            </div>
          </PageHeader>
        </div>
      </section>

      {/* Search and Controls */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white shadow-sm"
              />
            </div>

            {/* View Mode and Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white rounded-xl border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-jobequal-green text-white"
                      : "text-jobequal-text-muted"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-jobequal-green text-white"
                      : "text-jobequal-text-muted"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    Sort by {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FilterSection />
        </div>
      </section>

      {/* Companies Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-jobequal-text-muted">
              Showing {filteredCompanies.length} companies
            </p>
          </div>

          <div
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            <AnimatePresence>
              {filteredCompanies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {filteredCompanies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Building className="w-16 h-16 text-jobequal-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-jobequal-text mb-2">
                No companies found
              </h3>
              <p className="text-jobequal-text-muted">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
