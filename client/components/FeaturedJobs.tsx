import { useState, useEffect } from 'react';
import { MapPin, Clock, Building, Heart, Star, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface Company {
  id: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  description: string;
  companies: Company | null;
  matchScore: number;
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const { t } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-jobequal-green bg-jobequal-green-light border-jobequal-green';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (score >= 55) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `CHF ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From CHF ${min.toLocaleString()}`;
    if (max) return `Up to CHF ${max.toLocaleString()}`;
    return 'Not specified';
  };

  // Use a placeholder logo/icon based on the first letter of the company name
  const companyName = job.companies?.name ?? job.company_name;
  const logoPlaceholder = companyName ? companyName.charAt(0).toUpperCase() : 'J';

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:scale-105 hover:bg-white relative overflow-hidden ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-jobequal-green/5 to-jobequal-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl" />
      <div className="relative z-10">
        <div className="text-center mb-4 sm:mb-6">
          <div className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg font-bold border-2 animate-pulse-soft ${getMatchColor(job.matchScore)}`}>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce-subtle" />
            <span>{job.matchScore}% {t('featured.match')}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
          className={`transition-all duration-300 hover:scale-110 absolute top-4 right-4 group/heart ${isLiked ? 'text-red-500' : 'text-jobequal-text-muted hover:text-red-500'}`}
          aria-label={t('featured.save_job')}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover/heart:animate-pulse ${isLiked ? 'fill-current scale-110' : ''}`} />
        </button>
        <div className="flex items-start space-x-3 sm:space-x-4 lg:space-x-5 mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:rotate-3 flex-shrink-0">
            {logoPlaceholder}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl lg:text-xl text-jobequal-text group-hover:text-jobequal-green transition-all duration-200 mb-1 sm:mb-2 leading-tight line-clamp-2">
              {job.title}
            </h3>
            <p className="text-jobequal-text-muted font-medium text-sm sm:text-base lg:text-lg truncate">{companyName}</p>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <div className="flex items-center text-jobequal-text-muted text-sm sm:text-base">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-jobequal-green flex-shrink-0" />
            <span className="font-medium truncate">{job.location}</span>
          </div>
          <div className="flex items-center text-jobequal-green font-bold text-sm sm:text-base lg:text-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">{formatSalary(job.salary_min, job.salary_max)}</span>
          </div>
        </div>
        <Link
          to={`/job/${job.id}`}
          className="block w-full bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light text-jobequal-green-dark py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-jobequal-green hover:to-jobequal-teal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-center relative overflow-hidden group/button text-sm sm:text-base"
        >
          <span className="relative z-10">{t('featured.apply_now')}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-jobequal-green to-jobequal-teal transform scale-x-0 group-hover/button:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
      </div>
    </div>
  );
}

export function FeaturedJobs() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });

    const section = document.getElementById('featured-jobs');
    if (section) observer.observe(section);

    const fetchJobs = async () => {
      try {
        // Use environment variable for API base URL, fallback for local dev
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${apiBaseUrl}/api/jobs`);
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data.jobs.slice(0, 6)); // Take first 6 jobs for the featured section
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="featured-jobs" className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-jobequal-neutral to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-jobequal-green/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-jobequal-teal/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-jobequal-green mr-2 sm:mr-3 animate-bounce-subtle" />
            <span className="text-jobequal-text-muted font-medium text-sm sm:text-base lg:text-lg tracking-wide uppercase">Curated Excellence</span>
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-jobequal-green ml-2 sm:ml-3 animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-jobequal-text mb-6 sm:mb-8 leading-tight tracking-tight center-force lang-transition responsive-spacing">
            <span className="bg-gradient-to-r from-jobequal-text to-jobequal-green bg-clip-text text-transparent animate-gradient-x">{t('featured.title')}</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed font-light center-force lang-transition responsive-spacing px-4">{t('featured.subtitle')}</p>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white/50 rounded-2xl p-8 h-96 animate-pulse"></div>
            ))
          ) : error ? (
            <div className="col-span-full text-center text-red-500 bg-red-100 p-8 rounded-2xl">{error}</div>
          ) : (
            jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))
          )}
        </div>
        <div className={`text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            to="/job-search"
            className="inline-block bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>{t('featured.view_all')}</span>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </div>
      </div>
    </section>
  );
}
