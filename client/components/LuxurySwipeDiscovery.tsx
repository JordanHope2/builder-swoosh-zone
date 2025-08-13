import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Heart,
  X,
  Star,
  MapPin,
  Clock,
  Building,
  DollarSign,
  Zap,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  Globe,
  Calendar,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Share2,
  Eye,
  ChevronRight,
  Diamond,
  Crown,
  Target,
  Briefcase
} from 'lucide-react';
import { useJobs } from '../contexts/JobsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAppData } from '../hooks/useAppData';
import { applicationToast } from '../hooks/use-toast';

interface LuxuryJob {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  salary: string;
  salaryRange: { min: number; max: number };
  type: string;
  description: string;
  matchScore: number;
  tags: string[];
  benefits: string[];
  remote: boolean;
  featured: boolean;
  premium: boolean;
  companySize: string;
  industry: string;
  companyRating: number;
  jobLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  urgency: 'Low' | 'Medium' | 'High' | 'Urgent';
  postedTime: string;
  applicants: number;
  culture: string[];
  perks: string[];
  growthOpportunity: number;
  workLifeBalance: number;
  techStack: string[];
  teamSize: number;
}

const luxuryJobs: LuxuryJob[] = [
  {
    id: '1',
    title: 'Senior Software Architect',
    company: 'Credit Suisse',
    companyLogo: '🏦',
    location: 'Zurich Financial District',
    salary: 'CHF 150,000 - 200,000',
    salaryRange: { min: 150000, max: 200000 },
    type: 'Full-time',
    description: 'Lead the architectural evolution of our next-generation trading platform serving global markets. Work with cutting-edge technologies in a fast-paced, high-impact environment.',
    matchScore: 96,
    tags: ['Architecture', 'TypeScript', 'React', 'Node.js', 'AWS', 'Microservices'],
    benefits: ['Stock Options', 'Health Insurance', 'Pension Plan', 'Flexible Hours'],
    remote: true,
    featured: true,
    premium: true,
    companySize: '10,000+ employees',
    industry: 'Financial Services',
    companyRating: 4.6,
    jobLevel: 'Senior',
    urgency: 'High',
    postedTime: '2 hours ago',
    applicants: 23,
    culture: ['Innovation', 'Excellence', 'Collaboration', 'Growth'],
    perks: ['Premium Office', 'Team Events', 'Learning Budget', 'Sabbatical'],
    growthOpportunity: 95,
    workLifeBalance: 85,
    techStack: ['React', 'TypeScript', 'Node.js', 'AWS', 'Kubernetes', 'GraphQL'],
    teamSize: 12
  },
  {
    id: '2',
    title: 'Lead Product Designer',
    company: 'Google Switzerland',
    companyLogo: '🎨',
    location: 'Zurich Tech Hub',
    salary: 'CHF 130,000 - 170,000',
    salaryRange: { min: 130000, max: 170000 },
    type: 'Full-time',
    description: 'Shape the future of digital experiences for millions of users worldwide. Lead design initiatives that combine beautiful aesthetics with intuitive functionality.',
    matchScore: 89,
    tags: ['Product Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
    benefits: ['Stock Options', 'Health Insurance', 'Flexible Work', 'Learning Budget'],
    remote: true,
    featured: true,
    premium: false,
    companySize: '1,000+ employees',
    industry: 'Technology',
    companyRating: 4.8,
    jobLevel: 'Lead',
    urgency: 'Medium',
    postedTime: '1 day ago',
    applicants: 45,
    culture: ['Innovation', 'Creativity', 'Impact', 'Diversity'],
    perks: ['Free Meals', 'Gym Membership', 'Travel Budget', 'Conference Attendance'],
    growthOpportunity: 92,
    workLifeBalance: 90,
    techStack: ['Figma', 'Sketch', 'Principle', 'Adobe Creative Suite', 'Miro'],
    teamSize: 8
  },
  {
    id: '3',
    title: 'Principal Data Scientist',
    company: 'Roche',
    companyLogo: '🧬',
    location: 'Basel Pharma Campus',
    salary: 'CHF 140,000 - 180,000',
    salaryRange: { min: 140000, max: 180000 },
    type: 'Full-time',
    description: 'Drive breakthrough discoveries in personalized medicine using advanced machine learning and AI. Transform healthcare through data-driven innovation.',
    matchScore: 92,
    tags: ['Machine Learning', 'Python', 'R', 'TensorFlow', 'Healthcare', 'Research'],
    benefits: ['Research Time', 'Publications Support', 'Health Benefits', 'Flexible Schedule'],
    remote: false,
    featured: true,
    premium: true,
    companySize: '100,000+ employees',
    industry: 'Pharmaceuticals',
    companyRating: 4.5,
    jobLevel: 'Senior',
    urgency: 'Medium',
    postedTime: '3 days ago',
    applicants: 18,
    culture: ['Scientific Excellence', 'Patient Focus', 'Innovation', 'Integrity'],
    perks: ['Research Sabbatical', 'Publication Bonus', 'Conference Speaking', 'Patent Rewards'],
    growthOpportunity: 88,
    workLifeBalance: 82,
    techStack: ['Python', 'R', 'TensorFlow', 'PyTorch', 'SQL', 'Spark'],
    teamSize: 15
  }
];

const LuxurySwipeDiscovery: React.FC = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobs] = useState<LuxuryJob[]>(luxuryJobs);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeStats, setSwipeStats] = useState({
    liked: 0,
    passed: 0,
    superLiked: 0
  });
  const [showJobDetails, setShowJobDetails] = useState(false);
  
  const { addToFavorites } = useFavorites();
  const { auth } = useAppData();
  const constraintsRef = useRef(null);

  const currentJob = jobs[currentJobIndex];

  const createApplication = async (job: LuxuryJob, swipeAction: 'like' | 'superlike') => {
    try {
      // Create application data
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        swipeAction,
        timestamp: new Date().toISOString(),
        userId: auth?.user?.id || 'guest',
        coverLetter: swipeAction === 'superlike'
          ? 'I am very interested in this position and would love to discuss how I can contribute to your team.'
          : 'I believe my skills and experience make me a great fit for this role.',
        source: 'swipe_discovery'
      };

      // Log application creation (in real app, this would be an API call)
      console.log('Creating swipe-based application:', applicationData);

      // Here you would typically make an API call to create the application
      // The API should handle idempotency by job+user combination
      // await applicationService.createApplication(applicationData);

    } catch (error) {
      console.error('Failed to create application:', error);
      applicationToast.error('Failed to submit application. Please try again.');
    }
  };

  const handleSwipe = (dir: number, action: 'like' | 'pass' | 'superlike' = dir > 0 ? 'like' : 'pass') => {
    if (isAnimating || !currentJob) return;
    
    setIsAnimating(true);
    setDirection(dir);

    // Update stats
    setSwipeStats(prev => ({
      ...prev,
      [action === 'like' ? 'liked' : action === 'pass' ? 'passed' : 'superLiked']: prev[action === 'like' ? 'liked' : action === 'pass' ? 'passed' : 'superLiked'] + 1
    }));

    // Add to favorites and create application if liked or super liked
    if ((action === 'like' || action === 'superlike') && currentJob) {
      addToFavorites({
        id: currentJob.id,
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        salary: currentJob.salary,
        type: 'job'
      });

      // Create application (idempotent by job+user)
      createApplication(currentJob, action);

      // Show success toast for swipe match
      applicationToast.swipeMatch(currentJob.title);
    }

    // Move to next job
    setTimeout(() => {
      setCurrentJobIndex(prev => (prev + 1) % jobs.length);
      setIsAnimating(false);
    }, 400);
  };

  if (!currentJob) {
    return <CompletionScreen stats={swipeStats} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Luxury Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 h-screen flex flex-col">
        {/* Elegant Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-6">
            {/* JobEqual Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">JE</span>
              </div>
              <span className="text-white/90 font-medium text-sm group-hover:text-white transition-colors duration-200">JobEqual</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Diamond className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold text-lg">Dream Jobs</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Heart className="w-4 h-4 text-green-400" />
                <span className="text-white">{swipeStats.liked}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-white">{swipeStats.superLiked}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-white/80 text-sm">
              {currentJobIndex + 1} of {jobs.length}
            </div>
            <div className="w-32 h-1 bg-white/20 rounded-full mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentJobIndex + 1) / jobs.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Premium Card Stack */}
        <div className="flex-1 relative flex items-center justify-center">
          <div className="relative w-full max-w-md mx-auto h-[700px]" ref={constraintsRef}>
            <AnimatePresence initial={false} custom={direction}>
              {/* Current Card */}
              <LuxuryJobCard
                key={currentJob.id}
                job={currentJob}
                onSwipe={handleSwipe}
                custom={direction}
                isAnimating={isAnimating}
                onDetailsToggle={() => setShowJobDetails(!showJobDetails)}
                showDetails={showJobDetails}
              />
              
              {/* Next Card Preview */}
              {jobs[currentJobIndex + 1] && (
                <motion.div
                  key={`preview-next-${jobs[currentJobIndex + 1].id}`}
                  className="absolute inset-0 w-full h-full"
                  initial={{ scale: 0.9, opacity: 0.6, y: 20, rotateY: -15 }}
                  animate={{ scale: 0.9, opacity: 0.6, y: 20, rotateY: -15 }}
                  style={{ zIndex: -1 }}
                >
                  <LuxuryJobCardContent job={jobs[currentJobIndex + 1]} isPreview />
                </motion.div>
              )}

              {/* Third Card Preview */}
              {jobs[currentJobIndex + 2] && (
                <motion.div
                  key={`preview-third-${jobs[currentJobIndex + 2].id}`}
                  className="absolute inset-0 w-full h-full"
                  initial={{ scale: 0.8, opacity: 0.3, y: 40, rotateY: -30 }}
                  animate={{ scale: 0.8, opacity: 0.3, y: 40, rotateY: -30 }}
                  style={{ zIndex: -2 }}
                >
                  <LuxuryJobCardContent job={jobs[currentJobIndex + 2]} isPreview />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Luxury Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-center space-x-8 mt-8"
        >
          <LuxuryActionButton
            icon={X}
            color="from-red-500 to-red-600"
            label="Pass"
            size="md"
            onClick={() => handleSwipe(-1, 'pass')}
            disabled={isAnimating}
          />
          
          <LuxuryActionButton
            icon={Star}
            color="from-purple-500 to-purple-600"
            label="Super Like"
            size="lg"
            premium
            onClick={() => handleSwipe(0, 'superlike')}
            disabled={isAnimating}
          />
          
          <LuxuryActionButton
            icon={Heart}
            color="from-green-500 to-green-600"
            label="Like"
            size="md"
            onClick={() => handleSwipe(1, 'like')}
            disabled={isAnimating}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Luxury Job Card Component
interface LuxuryJobCardProps {
  job: LuxuryJob;
  onSwipe: (direction: number, action?: 'like' | 'pass' | 'superlike') => void;
  custom: number;
  isAnimating: boolean;
  onDetailsToggle: () => void;
  showDetails: boolean;
}

const LuxuryJobCard: React.FC<LuxuryJobCardProps> = ({ 
  job, 
  onSwipe, 
  custom, 
  isAnimating,
  onDetailsToggle,
  showDetails 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (Math.abs(offset) > 150 || Math.abs(velocity) > 800) {
      if (Math.abs(info.offset.y) > 150 && info.offset.y < 0) {
        onSwipe(0, 'superlike');
      } else {
        onSwipe(offset > 0 ? 1 : -1, offset > 0 ? 'like' : 'pass');
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotate: direction < 0 ? 45 : -45
    })
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      custom={custom}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={!isAnimating}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity }}
      whileTap={{ scale: 0.98 }}
    >
      <LuxuryJobCardContent 
        job={job} 
        showDetails={showDetails}
        onDetailsToggle={onDetailsToggle}
      />
      
      {/* Swipe Indicators */}
      <motion.div
        className="absolute top-16 left-8 bg-green-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl border border-green-400/50"
        style={{ opacity: useTransform(x, [50, 200], [0, 1]) }}
      >
        ❤️ INTERESTED
      </motion.div>
      
      <motion.div
        className="absolute top-16 right-8 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl border border-red-400/50"
        style={{ opacity: useTransform(x, [-200, -50], [1, 0]) }}
      >
        ✖️ PASS
      </motion.div>
      
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-purple-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-2xl border border-purple-400/50"
        style={{ opacity: useTransform(y, [-150, -50], [1, 0]) }}
      >
        ⭐ SUPER LIKE
      </motion.div>
    </motion.div>
  );
};

// Luxury Job Card Content
interface LuxuryJobCardContentProps {
  job: LuxuryJob;
  isPreview?: boolean;
  showDetails?: boolean;
  onDetailsToggle?: () => void;
}

const LuxuryJobCardContent: React.FC<LuxuryJobCardContentProps> = ({ 
  job, 
  isPreview = false,
  showDetails = false,
  onDetailsToggle 
}) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-xl ${isPreview ? 'opacity-60' : ''}`}>
      {/* Premium Header */}
      <div className="relative h-56 bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400 to-transparent rounded-full transform translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400 to-transparent rounded-full transform -translate-x-24 translate-y-24" />
        </div>

        {/* Status Badges */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {job.premium && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
              <Crown className="w-3 h-3 mr-1" />
              PREMIUM
            </div>
          )}
          {job.featured && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold">
              FEATURED
            </div>
          )}
          {job.remote && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full text-xs font-bold">
              REMOTE
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/20">
              {job.companyLogo}
            </div>
            <div>
              <div className="text-xs text-white/60 uppercase tracking-wide">{job.industry}</div>
              <h3 className="text-lg font-bold">{job.company}</h3>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  {job.companyRating}
                </div>
                <span>•</span>
                <span>{job.companySize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="absolute bottom-6 right-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-lg">{job.matchScore}%</span>
              <span className="text-sm text-white/80">Match</span>
            </div>
          </div>
        </div>

        {/* Job Level Badge */}
        <div className="absolute bottom-6 left-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 py-1 rounded-full text-sm font-semibold">
            {job.jobLevel} Level
          </div>
        </div>
      </div>
      
      {/* Job Content */}
      <div className="p-6 h-[calc(100%-14rem)] overflow-y-auto">
        {/* Job Title & Basics */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{job.title}</h2>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{job.location}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-semibold">{job.salary}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{job.postedTime}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-emerald-600">{job.growthOpportunity}%</div>
              <div className="text-xs text-emerald-600">Growth</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-blue-600">{job.workLifeBalance}%</div>
              <div className="text-xs text-blue-600">Balance</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl text-center">
              <div className="text-lg font-bold text-purple-600">{job.applicants}</div>
              <div className="text-xs text-purple-600">Applicants</div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>
        
        {/* Tech Stack */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-indigo-500" />
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.techStack.slice(0, 6).map((tech, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* Benefits Preview */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Award className="w-4 h-4 mr-2 text-green-500" />
            Key Benefits
          </h4>
          <div className="space-y-2">
            {job.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        {!isPreview && onDetailsToggle && (
          <button
            onClick={onDetailsToggle}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{showDetails ? 'Show Less' : 'View Details'}</span>
            <ChevronRight className={`w-4 h-4 transform transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
};

// Luxury Action Button
interface LuxuryActionButtonProps {
  icon: React.ComponentType<any>;
  color: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  premium?: boolean;
}

const LuxuryActionButton: React.FC<LuxuryActionButtonProps> = ({
  icon: Icon,
  color,
  label,
  onClick,
  disabled = false,
  size = 'md',
  premium = false
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <motion.button
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${color} text-white shadow-2xl flex items-center justify-center transition-all duration-200 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'
        } ${premium ? 'ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-transparent' : ''}`}
        whileHover={disabled ? {} : { scale: 1.1, y: -2 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className={iconSizes[size]} />
        {premium && (
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-3 h-3 text-yellow-900" />
          </motion.div>
        )}
      </motion.button>
      <span className="text-xs font-medium text-white/80">{label}</span>
    </div>
  );
};

// Completion Screen
const CompletionScreen: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="text-center text-white p-8"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <Crown className="w-12 h-12 text-yellow-900" />
      </motion.div>
      <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        Excellent Work! 🎉
      </h3>
      <p className="text-white/80 mb-6">You've explored all premium opportunities</p>
      <div className="flex justify-center space-x-6 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.liked}</div>
          <div className="text-sm text-white/60">Liked</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.superLiked}</div>
          <div className="text-sm text-white/60">Super Liked</div>
        </div>
      </div>
      <motion.button
        className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
      >
        Discover More Jobs
      </motion.button>
    </motion.div>
  </div>
);

export default LuxurySwipeDiscovery;
