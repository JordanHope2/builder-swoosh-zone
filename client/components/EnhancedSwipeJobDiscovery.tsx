import React, { useState, useRef, useCallback } from 'react';
import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../contexts/FavoritesContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart, 
  X, 
  Bookmark, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Zap,
  RotateCcw,
  Star,
  Building,
  Users,
  ChevronUp,
  ChevronDown,
  Send,
  FileText,
  ExternalLink,
  Sparkles,
  Award,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SwipeJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  matchScore: number;
  featured?: boolean;
  companySize: string;
  benefits: string[];
  whyMatch: string[];
  applicationDeadline?: string;
  postedDate: string;
}

const mockSwipeJobs: SwipeJob[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Zurich',
    logo: '🚀',
    location: 'Zurich',
    salary: 'CHF 120,000 - 140,000',
    type: 'Full-time',
    description: 'Join our innovative team building next-generation financial technology solutions using React, TypeScript, and cloud technologies.',
    requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
    matchScore: 95,
    featured: true,
    companySize: '200-500 employees',
    benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Learning Budget'],
    whyMatch: ['Perfect tech stack match', 'Seniority level matches', 'Location preference', 'Salary expectations met'],
    applicationDeadline: '2024-02-15',
    postedDate: '2024-01-10'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCH',
    logo: '💡',
    location: 'Geneva',
    salary: 'CHF 110,000 - 130,000',
    type: 'Full-time',
    description: 'Lead product strategy for our growing fintech platform, working with cross-functional teams to deliver exceptional user experiences.',
    requirements: ['Product Management', 'Agile', 'Data Analysis', '3+ years experience'],
    matchScore: 87,
    companySize: '50-200 employees',
    benefits: ['Flexible Hours', 'Health Insurance', 'Training Budget', 'Team Events'],
    whyMatch: ['Leadership experience match', 'Industry expertise', 'Growth potential', 'Team collaboration skills'],
    postedDate: '2024-01-12'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio Basel',
    logo: '🎨',
    location: 'Basel (Remote)',
    salary: 'CHF 85,000 - 105,000',
    type: 'Full-time',
    description: 'Create beautiful and intuitive user experiences for B2B applications, working with a talented design team.',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    matchScore: 73,
    companySize: '20-50 employees',
    benefits: ['Remote Work', 'Creative Freedom', 'Latest Tools', 'Design Conferences'],
    whyMatch: ['Design tool expertise', 'Remote work preference', 'Creative projects', 'Portfolio alignment'],
    applicationDeadline: '2024-02-20',
    postedDate: '2024-01-15'
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    logo: '📊',
    location: 'Zurich',
    salary: 'CHF 95,000 - 125,000',
    type: 'Full-time',
    description: 'Analyze complex datasets to drive business insights and build predictive models for our e-commerce platform.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    matchScore: 82,
    companySize: '100-200 employees',
    benefits: ['Learning Budget', 'Conference Attendance', 'Health Insurance', 'Flexible Schedule'],
    whyMatch: ['Strong Python skills', 'ML experience', 'Statistical background', 'Problem-solving approach'],
    postedDate: '2024-01-18'
  }
];

interface ApplicationModalProps {
  job: SwipeJob;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function ApplicationModal({ job, isOpen, onClose, onSubmit }: ApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [includeCV, setIncludeCV] = useState(true);
  const [includePortfolio, setIncludePortfolio] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    onSubmit();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-jobequal-text dark:text-white">
            Apply for {job.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">{job.company}</h4>
            <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">{job.location} • {job.type}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
              placeholder="Tell the employer why you're interested in this position..."
            />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-jobequal-text dark:text-white">Documents to Include:</h4>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeCV}
                onChange={(e) => setIncludeCV(e.target.checked)}
                className="w-4 h-4 text-jobequal-green border-gray-300 dark:border-gray-600 rounded focus:ring-jobequal-green"
              />
              <span className="text-jobequal-text dark:text-white">Include my CV</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includePortfolio}
                onChange={(e) => setIncludePortfolio(e.target.checked)}
                className="w-4 h-4 text-jobequal-green border-gray-300 dark:border-gray-600 rounded focus:ring-jobequal-green"
              />
              <span className="text-jobequal-text dark:text-white">Include portfolio link</span>
            </label>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  AI Application Boost
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  Your application will be highlighted to the employer as a top match based on your {job.matchScore}% compatibility score.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !includeCV}
              className="flex-1 bg-jobequal-green hover:bg-jobequal-green-hover text-white px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EnhancedSwipeJobDiscovery() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<{ job: SwipeJob; action: 'like' | 'pass' }[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const { addToFavorites, isFavorite } = useFavorites();
  const { t } = useLanguage();

  const currentJob = mockSwipeJobs[currentJobIndex];
  const hasMoreJobs = currentJobIndex < mockSwipeJobs.length - 1;

  const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
    if (!currentJob) return;

    setSwipeDirection(direction);
    
    // Animate card out
    await controls.start({
      x: direction === 'right' ? 1000 : -1000,
      rotate: direction === 'right' ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.3 }
    });

    const action = direction === 'right' ? 'like' : 'pass';
    setSwipedJobs(prev => [...prev, { job: currentJob, action }]);

    if (direction === 'right') {
      // Add to favorites when swiped right
      addToFavorites({
        id: currentJob.id,
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        salary: currentJob.salary,
        type: 'job'
      });
      
      // Show application modal
      setShowApplicationModal(true);
    }

    // Move to next job
    if (hasMoreJobs) {
      setCurrentJobIndex(prev => prev + 1);
      await controls.start({
        x: 0,
        rotate: 0,
        opacity: 1,
        transition: { duration: 0.3 }
      });
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
    
    const lastSwiped = swipedJobs[swipedJobs.length - 1];
    setSwipedJobs(prev => prev.slice(0, -1));
    setCurrentJobIndex(prev => Math.max(0, prev - 1));
    controls.set({ x: 0, rotate: 0, opacity: 1 });
  }, [swipedJobs, controls]);

  const handleApplicationSubmit = () => {
    if (currentJob) {
      setAppliedJobs(prev => new Set(prev.add(currentJob.id)));
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
  };

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
            Great Job Exploring!
          </h3>
          <p className="text-jobequal-text-muted dark:text-gray-400 mb-6">
            You've reviewed all available positions. Check your applications and saved jobs, or discover more opportunities.
          </p>
          <div className="space-y-3">
            <Link
              to="/favorites"
              className="block w-full bg-jobequal-green hover:bg-jobequal-green-hover text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              View Saved Jobs ({swipedJobs.filter(s => s.action === 'like').length})
            </Link>
            <Link
              to="/job-search"
              className="block w-full border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white py-3 px-6 rounded-xl font-semibold transition-colors"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentJob) return null;

  return (
    <div className="relative">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
            Job {currentJobIndex + 1} of {mockSwipeJobs.length}
          </span>
          <span className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">
            {Math.round(((currentJobIndex + 1) / mockSwipeJobs.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentJobIndex + 1) / mockSwipeJobs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Swipe Container */}
      <div className="relative h-[600px] overflow-hidden" ref={constraintsRef}>
        {/* Background Card (Next Job Preview) */}
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
          whileDrag={{ 
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          }}
          style={{
            backgroundImage: swipeDirection === 'right' 
              ? 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2))'
              : swipeDirection === 'left'
              ? 'linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2))'
              : 'none'
          }}
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
                LIKE
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
                PASS
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 h-full flex flex-col">
            {/* Header with JobEqual Logo */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">J</span>
                </div>
                <span className="text-sm font-medium text-jobequal-green">JobEqual</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(currentJob.matchScore)}`}>
                {currentJob.matchScore}% Match
                <Target className="w-4 h-4 inline ml-1" />
              </div>
            </div>

            {/* Company Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-md">
                {currentJob.logo}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-1">
                  {currentJob.title}
                </h2>
                <p className="text-jobequal-green font-semibold text-lg">{currentJob.company}</p>
                <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400 mt-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentJob.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {currentJob.salary}
                  </div>
                </div>
              </div>
              {currentJob.featured && (
                <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">Why You're a Great Match</h3>
                <div className="space-y-2">
                  {currentJob.whyMatch.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-jobequal-text-muted dark:text-gray-400">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">Job Description</h3>
                <p className="text-sm text-jobequal-text-muted dark:text-gray-400 leading-relaxed">
                  {currentJob.description}
                </p>
              </div>

              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green rounded-full text-sm"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-jobequal-text dark:text-white">Company Size:</span>
                      <p className="text-jobequal-text-muted dark:text-gray-400">{currentJob.companySize}</p>
                    </div>
                    <div>
                      <span className="font-medium text-jobequal-text dark:text-white">Posted:</span>
                      <p className="text-jobequal-text-muted dark:text-gray-400">
                        {new Date(currentJob.postedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Show More/Less Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center justify-center space-x-2 py-2 text-jobequal-green hover:text-jobequal-green-hover transition-colors"
            >
              <span className="text-sm font-medium">
                {showDetails ? 'Show Less' : 'Show More Details'}
              </span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
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

      {/* Application Modal */}
      <ApplicationModal
        job={currentJob}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
}