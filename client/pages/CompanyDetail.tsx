import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { useFavorites } from "../contexts/FavoritesContext";
import {
  MapPin,
  Users,
  Building,
  Calendar,
  Globe,
  Star,
  Heart,
  ExternalLink,
  TrendingUp,
  Award,
  Coffee,
  Briefcase,
  Clock,
  DollarSign,
  Shield,
  Zap,
  ChevronRight,
  ThumbsUp,
  MessageCircle,
  Share2,
  Filter,
  Search,
  ArrowRight,
  CheckCircle,
  Target,
  Sparkles,
  Camera,
  Video,
  FileText,
  Download,
} from "lucide-react";

interface CompanyData {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  founded: number;
  headquarters: string;
  website: string;
  description: string;
  mission: string;
  values: string[];
  benefits: string[];
  culture: {
    workLifeBalance: number;
    diversity: number;
    careerGrowth: number;
    compensation: number;
    management: number;
    overall: number;
  };
  openPositions: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    salary: string;
    postedDate: string;
    applications: number;
    urgent?: boolean;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    review: string;
    pros: string;
    cons: string;
    position: string;
    employmentStatus: string;
    date: string;
    helpful: number;
    anonymous: boolean;
  }>;
  photos: string[];
  stats: {
    totalEmployees: number;
    averageTenure: string;
    diversityScore: number;
    glassdoorRating: number;
    totalReviews: number;
  };
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompany = async () => {
    const response = await fetch(`/api/companies/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.company;
  };

  const { data: company, isLoading, isError, error } = useQuery({
    queryKey: ['company', id],
    queryFn: fetchCompany,
  });

  useEffect(() => {
    if (company) {
      setIsFollowing(isFavorite(company.id));
    }
  }, [company, isFavorite]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-jobequal-text dark:text-white mb-4">
              Company Not Found
            </h1>
            <p className="text-jobequal-text-muted dark:text-gray-400 mb-8">
              The company you're looking for doesn't exist.
            </p>
            <Link
              to="/companies"
              className="bg-jobequal-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors"
            >
              Browse Companies
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleFollow = () => {
    if (isFollowing) {
      removeFromFavorites(company.id);
    } else {
      addToFavorites({
        id: company.id,
        title: company.name,
        company: company.industry,
        location: company.headquarters,
        salary: `${company.stats.totalEmployees} employees`,
        type: "profile",
      });
    }
    setIsFollowing(!isFollowing);
  };

  const filteredReviews = company.reviews.filter((review) => {
    const matchesFilter =
      reviewFilter === "all" ||
      (reviewFilter === "current" &&
        review.employmentStatus === "Current Employee") ||
      (reviewFilter === "former" &&
        review.employmentStatus === "Former Employee");

    const matchesSearch =
      searchTerm === "" ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.position.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: Building },
    { id: "culture", label: "Culture & Values", icon: Heart },
    { id: "jobs", label: "Open Positions", icon: Briefcase },
    { id: "reviews", label: "Reviews", icon: MessageCircle },
    { id: "photos", label: "Photos", icon: Camera },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
        }`}
      />
    ));
  };

  const renderCultureScore = (label: string, score: number) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-jobequal-neutral-dark dark:border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-jobequal-text dark:text-white">
          {label}
        </span>
        <span className="text-sm font-bold text-jobequal-green">{score}/5</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full transition-all duration-300"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{`${company.name} | Company Profile | JobEqual`}</title>
        <meta name="description" content={company.description.substring(0, 160)} />
        <link rel="canonical" href={`https://jobequal.ch/company/${company.id}`} />
        <meta property="og:title" content={`${company.name} | Company Profile`} />
        <meta property="og:description" content={company.description.substring(0, 160)} />
        <meta property="og:url" content={`https://jobequal.ch/company/${company.id}`} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${company.name} | Company Profile`} />
        <meta name="twitter:description" content={company.description.substring(0, 160)} />
      </Helmet>
      <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-xl p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start space-x-6 mb-6 lg:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                {company.logo}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white mb-2">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-jobequal-text-muted dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    {company.industry}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {company.size}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {company.headquarters}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Founded {company.founded}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {renderStars(company.culture.overall)}
                    <span className="ml-2 text-sm font-medium text-jobequal-text dark:text-white">
                      {company.culture.overall}/5 ({company.stats.totalReviews}{" "}
                      reviews)
                    </span>
                  </div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-jobequal-green hover:text-jobequal-green-hover transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleFollow}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isFollowing
                    ? "bg-jobequal-green text-white hover:bg-jobequal-green-hover"
                    : "border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white"
                }`}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`}
                />
                {isFollowing ? "Following" : "Follow Company"}
              </motion.button>
              <button className="flex items-center px-6 py-3 border border-jobequal-neutral-dark dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl font-semibold hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6 text-center">
            <div className="text-2xl font-bold text-jobequal-green mb-1">
              {company.stats.totalEmployees}
            </div>
            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
              Total Employees
            </div>
          </div>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6 text-center">
            <div className="text-2xl font-bold text-jobequal-green mb-1">
              {company.stats.averageTenure}
            </div>
            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
              Avg. Tenure
            </div>
          </div>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6 text-center">
            <div className="text-2xl font-bold text-jobequal-green mb-1">
              {company.stats.diversityScore}%
            </div>
            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
              Diversity Score
            </div>
          </div>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6 text-center">
            <div className="text-2xl font-bold text-jobequal-green mb-1">
              {company.openPositions.length}
            </div>
            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
              Open Positions
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-2 mb-8"
        >
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-jobequal-green text-white shadow-md"
                    : "text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:bg-jobequal-neutral dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Building className="w-6 h-6 mr-3 text-jobequal-green" />
                    About {company.name}
                  </h2>
                  <p className="text-jobequal-text-muted dark:text-gray-400 leading-relaxed mb-6">
                    {company.description}
                  </p>
                  <div className="border-t border-jobequal-neutral-dark dark:border-gray-600 pt-6">
                    <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
                      Mission
                    </h3>
                    <p className="text-jobequal-text-muted dark:text-gray-400 italic">
                      "{company.mission}"
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Sparkles className="w-6 h-6 mr-3 text-jobequal-green" />
                    Benefits & Perks
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {company.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-jobequal-green-light dark:bg-jobequal-green/20 rounded-xl"
                      >
                        <CheckCircle className="w-5 h-5 text-jobequal-green mr-3 flex-shrink-0" />
                        <span className="text-jobequal-text dark:text-white font-medium">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "culture" && (
              <div className="space-y-8">
                {/* Culture Scores */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Heart className="w-6 h-6 mr-3 text-jobequal-green" />
                    Culture Ratings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderCultureScore(
                      "Work-Life Balance",
                      company.culture.workLifeBalance,
                    )}
                    {renderCultureScore(
                      "Diversity & Inclusion",
                      company.culture.diversity,
                    )}
                    {renderCultureScore(
                      "Career Growth",
                      company.culture.careerGrowth,
                    )}
                    {renderCultureScore(
                      "Compensation",
                      company.culture.compensation,
                    )}
                    {renderCultureScore(
                      "Management",
                      company.culture.management,
                    )}
                    {renderCultureScore(
                      "Overall Rating",
                      company.culture.overall,
                    )}
                  </div>
                </div>

                {/* Company Values */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-jobequal-green" />
                    Core Values
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {company.values.map((value, index) => (
                      <div
                        key={index}
                        className="flex items-center p-6 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue/20 rounded-xl border border-jobequal-green/20"
                      >
                        <Award className="w-8 h-8 text-jobequal-green mr-4" />
                        <span className="text-lg font-semibold text-jobequal-text dark:text-white">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0 flex items-center">
                    <Briefcase className="w-6 h-6 mr-3 text-jobequal-green" />
                    Open Positions ({company.openPositions.length})
                  </h2>
                  <Link
                    to="/job-search"
                    className="inline-flex items-center text-jobequal-green hover:text-jobequal-green-hover font-medium"
                  >
                    View all jobs
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {company.openPositions.map((position) => (
                    <motion.div
                      key={position.id}
                      whileHover={{ y: -2 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-jobequal-text dark:text-white mr-3">
                              {position.title}
                            </h3>
                            {position.urgent && (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {position.department}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {position.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {position.type}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Posted{" "}
                              {new Date(
                                position.postedDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-jobequal-green">
                              {position.salary}
                            </span>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {position.applications} applications
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/job/${position.id}`}
                            className="px-4 py-2 border border-jobequal-green text-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/job/${position.id}`}
                            className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0 flex items-center">
                    <MessageCircle className="w-6 h-6 mr-3 text-jobequal-green" />
                    Employee Reviews ({company.stats.totalReviews})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted" />
                      <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      />
                    </div>
                    <select
                      value={reviewFilter}
                      onChange={(e) => setReviewFilter(e.target.value)}
                      className="px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="all">All Reviews</option>
                      <option value="current">Current Employees</option>
                      <option value="former">Former Employees</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center mb-2">
                            {renderStars(review.rating)}
                            <span className="ml-2 font-semibold text-jobequal-text dark:text-white">
                              {review.rating}/5
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-1">
                            {review.title}
                          </h3>
                          <div className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-400">
                            <span>{review.position}</span>
                            <span className="mx-2">•</span>
                            <span>{review.employmentStatus}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button className="flex items-center text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-green transition-colors">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {review.helpful}
                        </button>
                      </div>

                      <p className="text-jobequal-text-muted dark:text-gray-400 mb-4 leading-relaxed">
                        {review.review}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                            Pros
                          </h4>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                            {review.pros}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                            Cons
                          </h4>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                            {review.cons}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "photos" && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-8 flex items-center">
                  <Camera className="w-6 h-6 mr-3 text-jobequal-green" />
                  Office Photos & Culture
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {company.photos.map((photo, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-4xl cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      {photo}
                    </motion.div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <button className="inline-flex items-center px-6 py-3 border border-jobequal-green text-jobequal-green rounded-xl hover:bg-jobequal-green hover:text-white transition-colors">
                    <Camera className="w-4 h-4 mr-2" />
                    View All Photos
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
    </>
  );
}
