import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart, 
  X, 
  RotateCcw,
  CheckCircle,
  Target,
  MapPin,
  DollarSign,
  Star,
  ChevronUp,
  ChevronDown,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobFromApi {
  id: string;
  title: string;
  location: {
    display_name: string;
  };
  company: {
    display_name: string;
  };
  description: string;
  redirect_url: string;
  contract_time?: string;
  salary_is_predicted: string;
}

// Simplified job interface to match what we get from the API
interface SwipeJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  redirect_url: string;
  type?: string;
}

export function EnhancedSwipeJobDiscovery() {
  const [jobs, setJobs] = useState<SwipeJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<{ job: SwipeJob; action: 'like' | 'pass' }[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const controls = useAnimation();
  const { addToFavorites } = useFavorites();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/scrape?limit=20'); // Fetch 20 jobs for swiping
        if (!response.ok) {
          throw new Error('Failed to fetch jobs for swiping');
        }
        const data = await response.json();

        // Map the API data to our simplified SwipeJob interface
        const formattedJobs: SwipeJob[] = (data.results || []).map((job: JobFromApi) => ({
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          redirect_url: job.redirect_url,
          type: job.contract_time ? job.contract_time.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A',
        }));

        setJobs(formattedJobs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  const currentJob = jobs[currentJobIndex];
  const hasMoreJobs = currentJobIndex < jobs.length - 1;

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (!currentJob) return;

    setSwipeDirection(direction);
    
    await controls.start({
      x: direction === 'right' ? 1000 : -1000,
      rotate: direction === 'right' ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.3 }
    });

    const action = direction === 'right' ? 'like' : 'pass';
    setSwipedJobs(prev => [...prev, { job: currentJob, action }]);

    if (direction === 'right') {
      addToFavorites({
        id: currentJob.id,
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        salary: 'N/A', // Salary not available from this API in a structured way
        type: 'job'
      });
    }

    if (hasMoreJobs) {
      setCurrentJobIndex(prev => prev + 1);
      setShowDetails(false); // Reset details view for the next card
      await controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      });
    } else {
        setCurrentJobIndex(prev => prev + 1); // Go one past the end to trigger the 'finished' screen
    }

    setSwipeDirection(null);
  }, [currentJob, hasMoreJobs, controls, addToFavorites]);

  const handleDragEnd = useCallback(
    (event: any, info: PanInfo) => {
      const threshold = 150;
      const velocity = Math.abs(info.velocity.x);
      
      if (Math.abs(info.offset.x) > threshold || velocity > 500) {
        handleSwipe(info.offset.x > 0 ? 'right' : 'left');
      } else {
        controls.start({ x: 0, rotate: 0 });
      }
    },
    [handleSwipe, controls]
  );

  const handleUndo = useCallback(() => {
    if (swipedJobs.length === 0) return;
    
    setSwipedJobs(prev => prev.slice(0, -1));
    setCurrentJobIndex(prev => Math.max(0, prev - 1));
    controls.set({ x: 0, rotate: 0, opacity: 1 });
  }, [swipedJobs, controls]);

  if (loading) {
    return <div className="text-center py-16">Loading jobs to swipe...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;
  }

  if (!currentJob && swipedJobs.length > 0) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg max-w-md mx-auto"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4">
            {t('swipe_job.great_job_exploring')}
          </h3>
          <p className="text-jobequal-text-muted dark:text-gray-400 mb-6">
            {t('swipe_job.reviewed_all_positions')}
          </p>
          <div className="space-y-3">
            <Link
              to="/favorites"
              className="block w-full bg-jobequal-green hover:bg-jobequal-green-hover text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              {t('swipe_job.view_saved_jobs')} ({swipedJobs.filter(s => s.action === 'like').length})
            </Link>
            <Link
              to="/job-search"
              className="block w-full border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              {t('swipe_job.advanced_search')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentJob) return <div className="text-center py-16">No jobs to display.</div>;

  return (
    <div className="relative">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
            {t('swipe_job.job_of').replace('{current}', String(currentJobIndex + 1)).replace('{total}', String(jobs.length))}
          </span>
          <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
            {t('swipe_job.complete').replace('{percent}', String(Math.round(((currentJobIndex + 1) / jobs.length) * 100)))}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentJobIndex + 1) / jobs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Swipe Container */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Background Card */}
        {hasMoreJobs && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg opacity-50 scale-95" />
        )}

        {/* Main Card */}
        <motion.div
          className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileDrag={{ scale: 1.02 }}
        >
          {/* Swipe Indicators */}
          <AnimatePresence>
            {swipeDirection === 'right' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg z-10"
              >
                <Heart className="w-6 h-6 inline mr-2" />
                {t('swipe_job.apply')}
              </motion.div>
            )}
            {swipeDirection === 'left' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg z-10"
              >
                <X className="w-6 h-6 inline mr-2" />
                {t('swipe_job.pass')}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-lg flex items-center justify-center relative">
                  <span className="text-white font-bold text-xs">J</span>
                </div>
                <span className="text-sm font-medium text-jobequal-green">JobEqual</span>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-md">
                <Briefcase/>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-1 line-clamp-2">
                  {currentJob.title}
                </h2>
                <p className="text-jobequal-green font-semibold text-lg">{currentJob.company}</p>
                <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400 mt-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentJob.location}
                  </div>
                   {currentJob.type && <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {currentJob.type}
                  </div>}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">{t('swipe_job.job_description')}</h3>
                <p className="text-sm text-jobequal-text-muted dark:text-gray-400 leading-relaxed">
                  {currentJob.description}
                </p>
              </div>
            </div>
             <a
                href={currentJob.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center mt-4 px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover"
              >
                View Full Job
              </a>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-6 mt-8">
        <motion.button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-full flex items-center justify-center transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-8 h-8 text-red-500" />
        </motion.button>

        {swipedJobs.length > 0 && (
          <motion.button
            onClick={handleUndo}
            className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
        )}

        <motion.button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-full flex items-center justify-center transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-8 h-8 text-green-500" />
        </motion.button>
      </div>
    </div>
  );
}
