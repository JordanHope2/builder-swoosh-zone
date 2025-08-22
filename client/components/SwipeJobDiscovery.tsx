import React, { useState, useRef, useCallback } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
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
} from "lucide-react";
import { Link } from "react-router-dom";

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
}

const mockSwipeJobs: SwipeJob[] = [
  {
    id: "1",
    title: "Senior Software Engineer",
    company: "TechCorp Zurich",
    logo: "🚀",
    location: "Zurich",
    salary: "CHF 120,000 - 140,000",
    type: "Full-time",
    description:
      "Join our innovative team building next-generation financial technology solutions using React, TypeScript, and cloud technologies.",
    requirements: ["React", "TypeScript", "Node.js", "5+ years experience"],
    matchScore: 95,
    featured: true,
    companySize: "200-500 employees",
    benefits: [
      "Health Insurance",
      "Remote Work",
      "Stock Options",
      "Learning Budget",
    ],
    whyMatch: [
      "Perfect tech stack match",
      "Seniority level matches",
      "Location preference",
      "Salary expectations met",
    ],
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateCH",
    logo: "💡",
    location: "Geneva",
    salary: "CHF 110,000 - 130,000",
    type: "Full-time",
    description:
      "Lead product strategy for our growing fintech platform, working with cross-functional teams to deliver exceptional user experiences.",
    requirements: [
      "Product Management",
      "Agile",
      "Data Analysis",
      "3+ years experience",
    ],
    matchScore: 87,
    companySize: "50-200 employees",
    benefits: [
      "Flexible Hours",
      "Health Insurance",
      "Training Budget",
      "Team Events",
    ],
    whyMatch: [
      "Leadership experience match",
      "Industry expertise",
      "Growth potential",
      "Team collaboration skills",
    ],
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio Basel",
    logo: "🎨",
    location: "Basel (Remote)",
    salary: "CHF 85,000 - 105,000",
    type: "Full-time",
    description:
      "Create beautiful and intuitive user experiences for B2B applications, working with a talented design team.",
    requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
    matchScore: 73,
    companySize: "20-50 employees",
    benefits: [
      "Remote Work",
      "Creative Freedom",
      "Latest Tools",
      "Design Conferences",
    ],
    whyMatch: [
      "Design tool expertise",
      "Remote work preference",
      "Creative projects",
      "Portfolio alignment",
    ],
  },
];

export function SwipeJobDiscovery() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [swipedJobs, setSwipedJobs] = useState<
    { job: SwipeJob; action: "like" | "pass" }[]
  >([]);
  const [showDetails, setShowDetails] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const currentJob = mockSwipeJobs[currentJobIndex];
  const hasMoreJobs = currentJobIndex < mockSwipeJobs.length - 1;

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (!currentJob) return;

      const action = direction === "right" ? "like" : "pass";

      // Animate card out
      await controls.start({
        x: direction === "right" ? 300 : -300,
        opacity: 0,
        rotate: direction === "right" ? 15 : -15,
        transition: { duration: 0.3 },
      });

      // Add to swiped jobs
      setSwipedJobs((prev) => [...prev, { job: currentJob, action }]);

      // Move to next job
      if (hasMoreJobs) {
        setCurrentJobIndex((prev) => prev + 1);
        // Reset card position
        controls.set({ x: 0, opacity: 1, rotate: 0 });
      }
    },
    [currentJob, hasMoreJobs, controls],
  );

  const handlePan = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      handleSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  const handleUndo = () => {
    if (swipedJobs.length === 0) return;

    const lastSwiped = swipedJobs[swipedJobs.length - 1];
    setSwipedJobs((prev) => prev.slice(0, -1));
    setCurrentJobIndex((prev) => Math.max(0, prev - 1));
    controls.set({ x: 0, opacity: 1, rotate: 0 });
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  if (!currentJob && swipedJobs.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-jobequal-text mb-2">
          You're all caught up!
        </h3>
        <p className="text-jobequal-text-muted">
          Check back later for new job matches.
        </p>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">✨</div>
        <h3 className="text-xl font-semibold text-jobequal-text mb-2">
          No more jobs to review!
        </h3>
        <p className="text-jobequal-text-muted mb-4">
          You've reviewed {swipedJobs.length} jobs.
          {swipedJobs.filter((s) => s.action === "like").length} were liked!
        </p>
        <button
          onClick={() => {
            setCurrentJobIndex(0);
            setSwipedJobs([]);
            controls.set({ x: 0, opacity: 1, rotate: 0 });
          }}
          className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto relative">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-jobequal-text-muted mb-2">
          <span>
            Job {currentJobIndex + 1} of {mockSwipeJobs.length}
          </span>
          <span>
            {swipedJobs.filter((s) => s.action === "like").length} liked
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentJobIndex + 1) / mockSwipeJobs.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div ref={constraintsRef} className="relative h-[600px] mb-6">
        {/* Next card (underneath) */}
        {hasMoreJobs && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-lg transform scale-95 opacity-50" />
        )}

        {/* Current card */}
        <motion.div
          animate={controls}
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          onPanEnd={handlePan}
          whileDrag={{
            rotate: 5,
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-jobequal-neutral-dark dark:border-gray-600 cursor-grab active:cursor-grabbing overflow-hidden"
        >
          {/* Match Score Header */}
          <div className="p-6 bg-gradient-to-r from-jobequal-green/10 to-jobequal-teal/10">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(currentJob.matchScore)}`}
              >
                <Zap className="w-4 h-4" />
                <span>{currentJob.matchScore}% Match</span>
              </div>
              {currentJob.featured && (
                <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            {/* Company Logo & Info */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-md">
                {currentJob.logo}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-1">
                  {currentJob.title}
                </h2>
                <p className="text-jobequal-text-muted dark:text-gray-300 font-medium mb-2">
                  {currentJob.company}
                </p>
                <div className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-400">
                  <Building className="w-4 h-4 mr-1" />
                  <span>{currentJob.companySize}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2 text-jobequal-green" />
                  <span>{currentJob.location}</span>
                </div>
                <div className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2 text-jobequal-blue-dark" />
                  <span>{currentJob.type}</span>
                </div>
              </div>

              <div className="flex items-center text-jobequal-green font-bold">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>{currentJob.salary}</span>
              </div>

              {/* Description */}
              <div
                className={`transition-all duration-300 ${showDetails ? "" : "line-clamp-3"}`}
              >
                <p className="text-jobequal-text-muted dark:text-gray-300 leading-relaxed">
                  {currentJob.description}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-jobequal-green hover:text-jobequal-green-hover transition-colors text-sm font-medium"
              >
                {showDetails ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show More
                  </>
                )}
              </button>

              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  {/* Why This Match */}
                  <div>
                    <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                      Why this match?
                    </h4>
                    <div className="space-y-1">
                      {currentJob.whyMatch.map((reason, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-300"
                        >
                          <div className="w-2 h-2 bg-jobequal-green rounded-full mr-2" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                      Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="bg-jobequal-green-light dark:bg-gray-700 text-jobequal-green-dark dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                      Benefits
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentJob.benefits.map((benefit, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Swipe Indicators */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 pointer-events-none">
            <div className="bg-red-500 text-white p-4 rounded-full rotate-12">
              <X className="w-8 h-8" />
            </div>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 pointer-events-none">
            <div className="bg-green-500 text-white p-4 rounded-full -rotate-12">
              <Heart className="w-8 h-8" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUndo}
          disabled={swipedJobs.length === 0}
          className="w-12 h-12 bg-gray-400 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <Heart className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Link to full job details */}
      <div className="mt-4 text-center">
        <Link
          to={`/job/${currentJob.id}`}
          className="text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
}
