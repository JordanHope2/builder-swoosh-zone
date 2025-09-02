import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter, SortAsc, SortDesc } from "lucide-react";
import { cn } from "../../lib/utils";
import SecurityUtils from "../../lib/security";

interface SearchFilters {
  [key: string]: string | number | boolean;
}

interface SecureSearchProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  onFilter?: (filters: SearchFilters) => void;
  filters?: Array<{
    key: string;
    label: string;
    type: "select" | "range" | "checkbox";
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
  }>;
  sortOptions?: Array<{ value: string; label: string }>;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  className?: string;
  debounceMs?: number;
}

export const SecureSearch: React.FC<SecureSearchProps> = ({
  placeholder = "Search...",
  onSearch,
  onFilter,
  filters = [],
  sortOptions = [],
  onSort,
  className,
  debounceMs = 300,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        const sanitizedTerm = SecurityUtils.sanitizeText(term);
        if (SecurityUtils.validateStringLength(sanitizedTerm, 0, 100)) {
          onSearch(sanitizedTerm);
        }
      }, debounceMs),
    [onSearch, debounceMs],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleFilterChange = (key: string, value: any) => {
    const sanitizedValue =
      typeof value === "string" ? SecurityUtils.sanitizeText(value) : value;
    const newFilters = { ...activeFilters, [key]: sanitizedValue };
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilter?.({});
  };

  const handleSort = (field: string) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(activeFilters).filter(
      (value) => value !== "" && value !== null && value !== undefined,
    ).length;
  }, [activeFilters]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-10 py-3 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          placeholder={placeholder}
          maxLength={100}
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Filter Toggle */}
          {filters.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200",
                isFilterOpen
                  ? "bg-jobequal-green text-white border-jobequal-green"
                  : "bg-white dark:bg-gray-800 text-jobequal-text dark:text-white border-jobequal-neutral-dark dark:border-gray-600 hover:border-jobequal-green",
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          )}

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Clear all
            </motion.button>
          )}
        </div>

        {/* Sort Options */}
        {sortOptions.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <div className="flex items-center space-x-1">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSort(option.value)}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    sortField === option.value
                      ? "bg-jobequal-green text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700",
                  )}
                >
                  <span>{option.label}</span>
                  {sortField === option.value &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="w-3 h-3" />
                    ) : (
                      <SortDesc className="w-3 h-3" />
                    ))}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-2">
                  <label className="text-sm font-medium text-jobequal-text dark:text-white">
                    {filter.label}
                  </label>

                  {filter.type === "select" && (
                    <select
                      value={(activeFilters[filter.key] as string) || ""}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:outline-none focus:ring-2 focus:ring-jobequal-green"
                    >
                      <option value="">All</option>
                      {filter.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === "checkbox" && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={
                          (activeFilters[filter.key] as boolean) || false
                        }
                        onChange={(e) =>
                          handleFilterChange(filter.key, e.target.checked)
                        }
                        className="rounded border-jobequal-neutral-dark text-jobequal-green focus:ring-jobequal-green"
                      />
                      <span className="text-sm text-jobequal-text dark:text-white">
                        {filter.label}
                      </span>
                    </label>
                  )}

                  {filter.type === "range" && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={filter.min || 0}
                        max={filter.max || 100}
                        value={
                          (activeFilters[filter.key] as number) ||
                          filter.min ||
                          0
                        }
                        onChange={(e) =>
                          handleFilterChange(
                            filter.key,
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Value: {activeFilters[filter.key] || filter.min || 0}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export default SecureSearch;
