import { useAuth } from '../contexts/AuthContext';
import { useJobs } from '../contexts/JobsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';

// Combined hook for easy access to all app data
export function useAppData() {
  const auth = useAuth();
  const jobs = useJobs();
  const favorites = useFavorites();
  const language = useLanguage();

  return {
    auth,
    jobs,
    favorites,
    language,
    // Computed values
    isAuthenticated: !!auth.user,
    isLoading: auth.loading || jobs.loading,
    hasJobs: jobs.jobs.length > 0,
    favoriteJobsCount: favorites.favorites.filter(f => f.type === 'job').length,
  };
}

// Hook for authenticated actions
export function useAuthenticatedActions() {
  const { auth, jobs } = useAppData();

  const requireAuth = (action: () => void | Promise<void>, redirectTo = '/signin') => {
    if (!auth.user) {
      window.location.href = redirectTo;
      return;
    }
    return action();
  };

  const applyToJob = async (jobId: string, applicationData?: any) => {
    return requireAuth(async () => {
      await jobs.applyToJob(jobId, applicationData || {});
    });
  };

  const updateProfile = async (data: any) => {
    return requireAuth(async () => {
      await auth.updateProfile(data);
    });
  };

  return {
    requireAuth,
    applyToJob,
    updateProfile,
  };
}

// Hook for job search and filtering
export function useJobSearch() {
  const { jobs } = useAppData();

  const searchByTitle = (title: string) => {
    jobs.setFilters({ ...jobs.filters, title });
  };

  const searchByLocation = (location: string) => {
    jobs.setFilters({ ...jobs.filters, location });
  };

  const filterBySalary = (min?: number, max?: number) => {
    jobs.setFilters({ ...jobs.filters, salaryMin: min, salaryMax: max });
  };

  const filterByType = (type: string) => {
    jobs.setFilters({ ...jobs.filters, type });
  };

  const clearFilters = () => {
    jobs.setFilters({});
  };

  return {
    searchByTitle,
    searchByLocation,
    filterBySalary,
    filterByType,
    clearFilters,
    currentFilters: jobs.filters,
    results: jobs.jobs,
    isLoading: jobs.loading,
    error: jobs.error,
  };
}
