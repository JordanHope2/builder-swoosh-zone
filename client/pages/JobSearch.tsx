import { useState, useEffect } from "react";
import { Navigation } from "@components/Navigation";
import {
  MapPin,
  Clock,
  Building,
  Search,
  Filter,
  ChevronDown,
  Bookmark,
  Star,
  TrendingUp,
  Target,
  Zap,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useJobSearch, useAppData } from "../hooks/useAppData";
import { useFavorites } from "../contexts/FavoritesContext";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  logo: string;
  featured?: boolean;
  remote?: boolean;
  posted: string;
  matchScore: number;
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Zurich",
    location: "Zurich",
    salary: "CHF 120,000 - 140,000",
    type: "Full-time",
    description:
      "Join our innovative team building next-generation financial technology solutions.",
    requirements: ["React", "TypeScript", "Node.js", "5+ years experience"],
    logo: "🚀",
    featured: true,
    posted: "2 days ago",
    matchScore: 95,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCH",
    location: "Geneva",
    salary: "CHF 110,000 - 130,000",
    type: "Full-time",
    description: "Lead product strategy for our growing fintech platform.",
    requirements: [
      "Product Management",
      "Agile",
      "Data Analysis",
      "3+ years experience",
    ],
    logo: "💡",
    posted: "1 week ago",
    matchScore: 73,
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio Basel",
    location: "Basel",
    salary: "CHF 85,000 - 105,000",
    type: "Full-time",
    description:
      "Create beautiful and intuitive user experiences for B2B applications.",
    requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
    logo: "🎨",
    remote: true,
    posted: "3 days ago",
    matchScore: 67,
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudTech AG",
    location: "Remote",
    salary: "CHF 95,000 - 115,000",
    type: "Full-time",
    description: "Build and maintain scalable cloud infrastructure.",
    requirements: ["AWS", "Kubernetes", "Docker", "CI/CD"],
    logo: "☁️",
    remote: true,
    posted: "5 days ago",
    matchScore: 88,
  },
  {
    id: "5",
    title: "Data Scientist",
    company: "DataDriven Bern",
    location: "Bern",
    salary: "CHF 100,000 - 120,000",
    type: "Full-time",
    description:
      "Analyze complex datasets to drive business insights and growth.",
    requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
    logo: "📊",
    featured: true,
    posted: "1 day ago",
    matchScore: 91,
  },
  {
    id: "6",
    title: "Marketing Director",
    company: "GrowthCo",
    location: "Lausanne",
    salary: "CHF 130,000 - 150,000",
    type: "Full-time",
    description: "Lead marketing strategy and team for B2B SaaS company.",
    requirements: [
      "Marketing Strategy",
      "Team Leadership",
      "B2B Experience",
      "7+ years",
    ],
    logo: "📈",
    posted: "4 days ago",
    matchScore: 54,
  },
];

function JobCard({ job }: { job: Job }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const isBookmarked = isFavorite(job.id);

  const handleBookmark = () => {
    if (isBookmarked) {
      removeFromFavorites(job.id);
    } else {
      addToFavorites({
        id: job.id,
        title: job.title,
        company: job.company || "",
        location: job.location || "",
        salary: job.salary || "",
        type: "job",
      });
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85)
      return "text-jobequal-green bg-jobequal-green-light border-jobequal-green";
    if (score >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    if (score >= 55) return "text-orange-600 bg-orange-100 border-orange-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group">
      {/* Mobile-first layout with responsive design */}
      <div className="space-y-4">
        {/* Header with logo, bookmark, and match score */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-md flex-shrink-0">
              {job.logo}
            </div>
            <div className="flex-1 min-w-0">
              {/* AI Match Score - Prominent on mobile */}
              <div
                className={`inline-flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border mb-2 ${getMatchColor(job.matchScore)}`}
              >
                <Zap className="w-3 h-3" />
                <span className="whitespace-nowrap">
                  {job.matchScore}% AI Match
                </span>
              </div>

              <Link
                to={`/job/${job.id}`}
                className="block group-hover:text-jobequal-green transition-colors"
              >
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl text-jobequal-text mb-1 sm:mb-2 leading-tight line-clamp-2">
                  {job.title}
                </h3>
              </Link>
              <p className="text-jobequal-text-muted font-medium text-sm sm:text-base lg:text-lg mb-2">
                {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={`transition-all duration-200 hover:scale-110 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-50 active:bg-gray-100 ${isBookmarked ? "text-red-500" : "text-jobequal-text-muted hover:text-red-500"}`}
            aria-label={
              isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
            }
            aria-pressed={isBookmarked}
          >
            <Bookmark
              className={`w-5 h-5 sm:w-6 sm:h-6 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {job.featured && (
            <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Featured</span>
            </div>
          )}
          {job.remote && (
            <div className="bg-jobequal-blue text-white text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
              Remote
            </div>
          )}
        </div>

        {/* Description - Hidden on very small screens */}
        <p className="text-jobequal-text-muted leading-relaxed text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
          {job.description}
        </p>

        {/* Skills tags */}
        <div className="flex flex-wrap gap-2">
          {job.requirements
            .slice(0, window.innerWidth < 640 ? 2 : 3)
            .map((req, index) => (
              <span
                key={index}
                className="bg-jobequal-green-light text-jobequal-green-dark px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
              >
                {req}
              </span>
            ))}
          {job.requirements.length > (window.innerWidth < 640 ? 2 : 3) && (
            <span className="text-jobequal-text-muted text-xs sm:text-sm">
              +{job.requirements.length - (window.innerWidth < 640 ? 2 : 3)}{" "}
              more
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-jobequal-neutral-dark mt-4">
        {/* Mobile-stacked layout */}
        <div className="space-y-3 sm:space-y-4">
          {/* Job details - responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
            <div className="flex items-center text-jobequal-text-muted text-sm">
              <MapPin className="w-4 h-4 mr-2 text-jobequal-green flex-shrink-0" />
              <span className="font-medium truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-jobequal-text-muted text-sm">
              <Clock className="w-4 h-4 mr-2 text-jobequal-blue-dark flex-shrink-0" />
              <span className="font-medium">{job.type}</span>
            </div>
            <div className="flex items-center text-jobequal-green font-bold text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-jobequal-text-muted">
              {job.posted}
            </span>
            <Link
              to={`/job/${job.id}`}
              className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl font-medium hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    remote: false,
  });

  const locations = ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Remote"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Executive",
  ];
  const salaryRanges = [
    "CHF 60,000 - 80,000",
    "CHF 80,000 - 100,000",
    "CHF 100,000 - 120,000",
    "CHF 120,000+",
  ];

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 lg:w-6 lg:h-6 text-jobequal-green" />
          <h3 className="text-xl lg:text-2xl font-bold text-jobequal-text">
            Filters
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-jobequal-text-muted hover:text-jobequal-text p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-6 lg:space-y-8">
        {/* Location Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-3 lg:mb-4 text-sm lg:text-base">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            className="w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm lg:text-base"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-3 lg:mb-4 text-sm lg:text-base">
            Job Type
          </label>
          <select
            value={filters.jobType}
            onChange={(e) =>
              setFilters({ ...filters, jobType: e.target.value })
            }
            className="w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm lg:text-base"
          >
            <option value="">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-3 lg:mb-4 text-sm lg:text-base">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
            className="w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm lg:text-base"
          >
            <option value="">All Levels</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-3 lg:mb-4 text-sm lg:text-base">
            Salary Range
          </label>
          <select
            value={filters.salary}
            onChange={(e) => setFilters({ ...filters, salary: e.target.value })}
            className="w-full p-3 lg:p-4 rounded-lg lg:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm lg:text-base"
          >
            <option value="">All Ranges</option>
            {salaryRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Remote Work */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.remote}
              onChange={(e) =>
                setFilters({ ...filters, remote: e.target.checked })
              }
              className="w-4 h-4 lg:w-5 lg:h-5 text-jobequal-green border-jobequal-neutral-dark rounded focus:ring-jobequal-green"
            />
            <span className="text-jobequal-text font-semibold text-sm lg:text-base">
              Remote Work Available
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() =>
            setFilters({
              location: "",
              jobType: "",
              experience: "",
              salary: "",
              remote: false,
            })
          }
          className="w-full bg-jobequal-green-light text-jobequal-green-dark py-3 rounded-lg lg:rounded-xl font-semibold hover:bg-jobequal-green hover:text-white transition-all duration-200 text-sm lg:text-base"
        >
          Clear All Filters
        </button>
      </div>
    </>
  );

  // Desktop version
  if (!isOpen) {
    return (
      <div className="hidden lg:block bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark sticky top-24">
        <FilterContent />
      </div>
    );
  }

  // Mobile modal version
  return (
    <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
        <FilterContent />
      </div>
    </div>
  );
}

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use real data from contexts
  const jobSearch = useJobSearch();
  const { auth } = useAppData();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Use real jobs data instead of mock data
  const jobs = jobSearch.results;
  const isLoading = jobSearch.isLoading;

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-jobequal-text mb-4 sm:mb-6 leading-tight">
            Find Your Dream Job
          </h1>
          <p className="text-lg sm:text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
            Discover opportunities that match your skills and aspirations across
            Switzerland
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-jobequal-neutral-dark mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-jobequal-text-muted" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg sm:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm sm:text-base lg:text-lg"
              />
            </div>
            <button className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base">
              Search
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-3 min-h-[44px] rounded-xl border border-jobequal-neutral-dark hover:shadow-md transition-all duration-200 active:bg-gray-50"
              aria-label="Open job filters"
            >
              <Filter className="w-4 h-4 text-jobequal-green" />
              <span className="font-medium text-jobequal-text">Filters</span>
            </button>
          </div>

          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-jobequal-text mb-2">
                  {mockJobs.length} Jobs Found
                </h2>
                <p className="text-jobequal-text-muted text-sm sm:text-base">
                  Showing the best matches for your search
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-jobequal-text-muted font-medium text-sm sm:text-base">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm sm:text-base"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Posted</option>
                  <option value="salary">Salary</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-4 sm:space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-jobequal-text-muted">
                    Loading jobs...
                  </div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-jobequal-text-muted mb-4">
                    No jobs found matching your criteria.
                  </div>
                  <button
                    onClick={() => jobSearch.clearFilters()}
                    className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={{
                      ...job,
                      company: job.companies?.name || "Unknown Company",
                      logo: job.companies?.logo_url || "🏢",
                      salary:
                        job.salary_min && job.salary_max
                          ? `CHF ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                          : "Salary not specified",
                      posted: new Date(job.created_at).toLocaleDateString(),
                      matchScore: 85, // TODO: Implement AI matching
                      requirements: [], // TODO: Parse from job description or add to schema
                      featured: false, // TODO: Add featured field to schema
                      remote: job.type?.includes("remote") || false,
                    }}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 sm:mt-12">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:bg-jobequal-green hover:text-white transition-all duration-200 text-sm sm:text-base">
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      page === 1
                        ? "bg-jobequal-green text-white"
                        : "text-jobequal-text-muted hover:bg-jobequal-green hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:bg-jobequal-green hover:text-white transition-all duration-200 text-sm sm:text-base">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
