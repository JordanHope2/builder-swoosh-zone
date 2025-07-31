import { MapPin, Clock, Building, Heart, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  featured?: boolean;
  matchScore: number;
}

const featuredJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Zurich',
    location: 'Zurich',
    salary: 'CHF 120,000 - 140,000',
    type: 'Full-time',
    logo: '🚀',
    featured: true,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCH',
    location: 'Geneva',
    salary: 'CHF 110,000 - 130,000',
    type: 'Full-time',
    logo: '💡',
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Basel',
    salary: 'CHF 85,000 - 105,000',
    type: 'Full-time',
    logo: '🎨',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataDriven AG',
    location: 'Bern',
    salary: 'CHF 100,000 - 120,000',
    type: 'Full-time',
    logo: '📊',
    featured: true,
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Remote',
    salary: 'CHF 95,000 - 115,000',
    type: 'Full-time',
    logo: '☁️',
  },
  {
    id: '6',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Lausanne',
    salary: 'CHF 130,000 - 150,000',
    type: 'Full-time',
    logo: '📈',
  },
];

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:scale-105 hover:bg-white">
      <div className="flex items-center justify-between mb-6">
        {job.featured && (
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Featured</span>
            </div>
          </div>
        )}
        <button className="text-jobequal-text-muted hover:text-red-500 transition-all duration-200 hover:scale-110 ml-auto">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-start space-x-5 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-md group-hover:shadow-lg transition-all duration-300">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-jobequal-text group-hover:text-jobequal-green transition-all duration-200 mb-2 leading-tight">
            {job.title}
          </h3>
          <p className="text-jobequal-text-muted font-medium text-lg">{job.company}</p>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center text-jobequal-text-muted">
          <MapPin className="w-5 h-5 mr-3 text-jobequal-green" />
          <span className="font-medium">{job.location}</span>
        </div>
        <div className="flex items-center text-jobequal-text-muted">
          <Clock className="w-5 h-5 mr-3 text-jobequal-blue-dark" />
          <span className="font-medium">{job.type}</span>
        </div>
        <div className="flex items-center text-jobequal-green font-bold text-lg">
          <TrendingUp className="w-5 h-5 mr-3" />
          <span>{job.salary}</span>
        </div>
      </div>

      <Link
        to={`/job/${job.id}`}
        className="block w-full bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light text-jobequal-green-dark py-4 rounded-2xl font-semibold hover:from-jobequal-green hover:to-jobequal-teal hover:text-white transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-center"
      >
        View Details
      </Link>
    </div>
  );
}

export function FeaturedJobs() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-jobequal-neutral to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <div className="flex items-center justify-center mb-6">
            <Star className="w-6 h-6 text-jobequal-green mr-3" />
            <span className="text-jobequal-text-muted font-medium text-lg tracking-wide uppercase">
              Curated Excellence
            </span>
            <Star className="w-6 h-6 text-jobequal-green ml-3" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-jobequal-text mb-8 leading-tight tracking-tight">
            Featured Opportunities
          </h2>
          <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed font-light">
            Discover hand-picked job opportunities from Switzerland's most prestigious companies.
            Quality positions for exceptional professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-16">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/job-search"
            className="inline-block bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-12 py-5 rounded-2xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
