import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@components/Navigation";
import { useFavorites } from "../contexts/FavoritesContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Heart,
  Briefcase,
  User,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { favorites, removeFromFavorites, clearFavorites, getFavoritesByType } =
    useFavorites();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"jobs" | "profiles">("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "company">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const favoriteJobs = getFavoritesByType("job");
  const favoriteProfiles = getFavoritesByType("profile");
  const currentFavorites =
    activeTab === "jobs" ? favoriteJobs : favoriteProfiles;

  const filteredFavorites = currentFavorites
    .filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "date":
          aValue = a.dateAdded.getTime();
          bValue = b.dateAdded.getTime();
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "company":
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handleRemove = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    removeFromFavorites(id);
  };

  const toggleSort = (field: "date" | "title" | "company") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white">
              Your Favorites
            </h1>
          </div>
          <p className="text-lg text-jobequal-text-muted dark:text-gray-300">
            Manage your saved jobs and profiles in one place
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "jobs"
                  ? "bg-jobequal-green text-white shadow-lg"
                  : "text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Jobs ({favoriteJobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("profiles")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "profiles"
                  ? "bg-jobequal-green text-white shadow-lg"
                  : "text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profiles ({favoriteProfiles.length})</span>
            </button>
          </div>
        </motion.div>

        {/* Controls */}
        {currentFavorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                  Sort by:
                </span>
                <button
                  onClick={() => toggleSort("date")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    sortBy === "date"
                      ? "bg-jobequal-green text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                  {sortBy === "date" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => toggleSort("title")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    sortBy === "title"
                      ? "bg-jobequal-green text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white"
                  }`}
                >
                  <span>Title</span>
                  {sortBy === "title" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
                <button
                  onClick={() => toggleSort("company")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    sortBy === "company"
                      ? "bg-jobequal-green text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white"
                  }`}
                >
                  <span>Company</span>
                  {sortBy === "company" &&
                    (sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    ))}
                </button>
              </div>

              {currentFavorites.length > 0 && (
                <button
                  onClick={clearFavorites}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Favorites List */}
        <AnimatePresence>
          {filteredFavorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-jobequal-text dark:text-white mb-2">
                {searchQuery
                  ? "No matching favorites found"
                  : `No ${activeTab} saved yet`}
              </h3>
              <p className="text-jobequal-text-muted dark:text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : `Start browsing and click the heart icon to save ${activeTab} you're interested in`}
              </p>
              {!searchQuery && (
                <Link
                  to={activeTab === "jobs" ? "/job-search" : "/companies"}
                  className="inline-flex items-center space-x-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <span>
                    Browse {activeTab === "jobs" ? "Jobs" : "Profiles"}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {filteredFavorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-2">
                            {favorite.title}
                          </h3>
                          <p className="text-jobequal-green font-semibold text-lg mb-2">
                            {favorite.company}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleRemove(favorite.id, e)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Remove from favorites"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {favorite.location}
                        </div>
                        {favorite.salary && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {favorite.salary}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Saved {formatDate(favorite.dateAdded)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Link
                          to={
                            favorite.type === "job"
                              ? `/job/${favorite.id}`
                              : `/company/${favorite.id}`
                          }
                          className="flex items-center space-x-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => handleRemove(favorite.id, e)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
