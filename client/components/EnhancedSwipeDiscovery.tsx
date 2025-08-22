import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  PanInfo,
} from "framer-motion";
import {
  Heart,
  X,
  RotateCcw,
  Star,
  MapPin,
  Clock,
  Building,
  DollarSign,
  Zap,
  Target,
  Award,
  ArrowUp,
  ArrowDown,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useJobs } from "../contexts/JobsContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAppData } from "../hooks/useAppData";

interface SwipeableJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  logo: string;
  matchScore: number;
  tags: string[];
  benefits: string[];
  remote: boolean;
  featured: boolean;
}

const mockSwipeJobs: SwipeableJob[] = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp Zurich",
    location: "Zurich, Switzerland",
    salary: "CHF 120,000 - 140,000",
    type: "Full-time",
    description:
      "Join our innovative team building next-generation financial technology solutions using React, TypeScript, and modern cloud technologies.",
    logo: "🚀",
    matchScore: 95,
    tags: ["React", "TypeScript", "Node.js", "AWS"],
    benefits: [
      "Remote Work",
      "Health Insurance",
      "Stock Options",
      "30 Days Vacation",
    ],
    remote: true,
    featured: true,
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "DesignHub Geneva",
    location: "Geneva, Switzerland",
    salary: "CHF 90,000 - 110,000",
    type: "Full-time",
    description:
      "Create beautiful and intuitive user experiences for web and mobile applications in our creative team.",
    logo: "🎨",
    matchScore: 87,
    tags: ["Figma", "UI Design", "Prototyping", "User Research"],
    benefits: ["Flexible Hours", "Design Budget", "Conferences", "Mentorship"],
    remote: false,
    featured: false,
  },
  {
    id: "3",
    title: "Data Scientist",
    company: "DataDriven Bern",
    location: "Bern, Switzerland",
    salary: "CHF 100,000 - 120,000",
    type: "Full-time",
    description:
      "Analyze complex datasets to drive business insights and growth using machine learning and statistical methods.",
    logo: "📊",
    matchScore: 82,
    tags: ["Python", "Machine Learning", "SQL", "Statistics"],
    benefits: ["Research Time", "Conferences", "GPU Access", "Publications"],
    remote: true,
    featured: true,
  },
];

const EnhancedSwipeDiscovery: React.FC = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobs] = useState<SwipeableJob[]>(mockSwipeJobs);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [actions, setActions] = useState<
    { type: "like" | "dislike" | "super"; count: number }[]
  >([
    { type: "like", count: 0 },
    { type: "dislike", count: 0 },
    { type: "super", count: 0 },
  ]);

  const { addToFavorites } = useFavorites();
  const { auth } = useAppData();
  const constraintsRef = useRef(null);

  const currentJob = jobs[currentJobIndex];

  const handleSwipe = (
    dir: number,
    action: "like" | "dislike" | "super" = dir > 0 ? "like" : "dislike",
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setDirection(dir);

    // Update action counts
    setActions((prev) =>
      prev.map((a) => (a.type === action ? { ...a, count: a.count + 1 } : a)),
    );

    // Add to favorites if liked or super liked
    if ((action === "like" || action === "super") && currentJob) {
      addToFavorites({
        id: currentJob.id,
        title: currentJob.title,
        company: currentJob.company,
        location: currentJob.location,
        salary: currentJob.salary,
        type: "job",
      });
    }

    // Move to next job after animation
    setTimeout(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobs.length);
      setIsAnimating(false);
    }, 300);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? 30 : -30,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotate: direction < 0 ? 30 : -30,
    }),
  };

  const swipeVariants = {
    like: {
      x: 1000,
      rotate: 30,
      opacity: 0,
      transition: { duration: 0.3 },
    },
    dislike: {
      x: -1000,
      rotate: -30,
      opacity: 0,
      transition: { duration: 0.3 },
    },
    super: {
      y: -1000,
      scale: 1.2,
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  if (!currentJob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-jobequal-green" />
          <h3 className="text-2xl font-bold text-jobequal-text mb-2">
            All Done! 🎉
          </h3>
          <p className="text-jobequal-text-muted">
            You've reviewed all available jobs
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-20"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header Stats */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex space-x-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.type}
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    action.type === "like"
                      ? "bg-green-100 text-green-600"
                      : action.type === "dislike"
                        ? "bg-red-100 text-red-600"
                        : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {action.type === "like" ? (
                    <Heart className="w-4 h-4" />
                  ) : action.type === "dislike" ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </div>
                <span className="font-semibold text-gray-700">
                  {action.count}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="text-right">
            <span className="text-gray-500">
              {currentJobIndex + 1} / {jobs.length}
            </span>
          </div>
        </motion.div>

        {/* Card Stack */}
        <div className="flex-1 relative flex items-center justify-center">
          <div
            className="relative w-full max-w-sm mx-auto h-[600px]"
            ref={constraintsRef}
          >
            <AnimatePresence initial={false} custom={direction}>
              {/* Current Card */}
              <SwipeCard
                key={currentJob.id}
                job={currentJob}
                onSwipe={handleSwipe}
                variants={variants}
                custom={direction}
                isAnimating={isAnimating}
              />

              {/* Next Card (Preview) */}
              {jobs[currentJobIndex + 1] && (
                <motion.div
                  className="absolute inset-0 w-full h-full"
                  initial={{ scale: 0.95, opacity: 0.7, y: 10 }}
                  animate={{ scale: 0.95, opacity: 0.7, y: 10 }}
                  style={{ zIndex: -1 }}
                >
                  <JobCardContent job={jobs[currentJobIndex + 1]} isPreview />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center space-x-8 mt-8"
        >
          <ActionButton
            icon={X}
            color="red"
            label="Pass"
            onClick={() => handleSwipe(-1, "dislike")}
            disabled={isAnimating}
          />
          <ActionButton
            icon={RotateCcw}
            color="gray"
            label="Undo"
            onClick={() => {
              if (currentJobIndex > 0) {
                setCurrentJobIndex((prev) => prev - 1);
              }
            }}
            disabled={isAnimating || currentJobIndex === 0}
          />
          <ActionButton
            icon={Star}
            color="purple"
            label="Super Like"
            onClick={() => handleSwipe(0, "super")}
            disabled={isAnimating}
            size="lg"
          />
          <ActionButton
            icon={Heart}
            color="green"
            label="Like"
            onClick={() => handleSwipe(1, "like")}
            disabled={isAnimating}
          />
        </motion.div>
      </div>
    </div>
  );
};

// Swipe Card Component
interface SwipeCardProps {
  job: SwipeableJob;
  onSwipe: (direction: number, action?: "like" | "dislike" | "super") => void;
  variants: any;
  custom: number;
  isAnimating: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  job,
  onSwipe,
  variants,
  custom,
  isAnimating,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
      if (Math.abs(info.offset.y) > 100 && info.offset.y < 0) {
        // Super like (swipe up)
        onSwipe(0, "super");
      } else {
        // Like or dislike
        onSwipe(offset > 0 ? 1 : -1);
      }
    }
  };

  return (
    <motion.div
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      custom={custom}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      drag={!isAnimating}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity }}
      whileTap={{ scale: 0.95 }}
    >
      <JobCardContent job={job} />

      {/* Swipe Indicators */}
      <motion.div
        className="absolute top-8 left-8 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg"
        style={{
          opacity: useTransform(x, [50, 150], [0, 1]),
        }}
      >
        LIKE
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg"
        style={{
          opacity: useTransform(x, [-150, -50], [1, 0]),
        }}
      >
        PASS
      </motion.div>

      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-lg"
        style={{
          opacity: useTransform(y, [-100, -50], [1, 0]),
        }}
      >
        SUPER LIKE
      </motion.div>
    </motion.div>
  );
};

// Job Card Content
interface JobCardContentProps {
  job: SwipeableJob;
  isPreview?: boolean;
}

const JobCardContent: React.FC<JobCardContentProps> = ({
  job,
  isPreview = false,
}) => {
  return (
    <div
      className={`w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden ${isPreview ? "opacity-70" : ""}`}
    >
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-br from-jobequal-green to-jobequal-teal p-6 text-white">
        <div className="absolute top-4 right-4 flex space-x-2">
          {job.featured && (
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              FEATURED
            </div>
          )}
          {job.remote && (
            <div className="bg-blue-400 text-blue-900 px-2 py-1 rounded-full text-xs font-bold">
              REMOTE
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl">
            {job.logo}
          </div>
          <div>
            <h2 className="text-xl font-bold">{job.title}</h2>
            <p className="text-white/90">{job.company}</p>
          </div>
        </div>

        {/* Match Score */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span className="font-bold">{job.matchScore}% Match</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-[calc(100%-12rem)] overflow-y-auto">
        {/* Job Details */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{job.type}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">{job.description}</p>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-jobequal-green-light text-jobequal-green px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Benefits</h4>
          <div className="space-y-2">
            {job.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Button Component
interface ActionButtonProps {
  icon: React.ComponentType<any>;
  color: "red" | "green" | "purple" | "gray";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: "md" | "lg";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  color,
  label,
  onClick,
  disabled = false,
  size = "md",
}) => {
  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white",
    gray: "bg-gray-300 hover:bg-gray-400 text-gray-700",
  };

  const sizeClasses = {
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.button
        className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} shadow-lg flex items-center justify-center transition-colors duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={disabled ? {} : { scale: 0.9 }}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className={size === "lg" ? "w-8 h-8" : "w-6 h-6"} />
      </motion.button>
      <span className="text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
};

export default EnhancedSwipeDiscovery;
