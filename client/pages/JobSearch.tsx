import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { MapPin, Clock, Building, Search, Filter, ChevronDown, Bookmark, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  logo: string;
  featured?: boolean;
  remote?: boolean;
  posted: string;
  matchScore: number;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Zurich',
    location: 'Zurich',
    salary: 'CHF 120,000 - 140,000',
    type: 'Full-time',
    description: 'Join our innovative team building next-generation financial technology solutions.',
    requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
    logo: '🚀',
    featured: true,
    posted: '2 days ago'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCH',
    location: 'Geneva',
    salary: 'CHF 110,000 - 130,000',
    type: 'Full-time',
    description: 'Lead product strategy for our growing fintech platform.',
    requirements: ['Product Management', 'Agile', 'Data Analysis', '3+ years experience'],
    logo: '💡',
    posted: '1 week ago'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio Basel',
    location: 'Basel',
    salary: 'CHF 85,000 - 105,000',
    type: 'Full-time',
    description: 'Create beautiful and intuitive user experiences for B2B applications.',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    logo: '🎨',
    remote: true,
    posted: '3 days ago'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech AG',
    location: 'Remote',
    salary: 'CHF 95,000 - 115,000',
    type: 'Full-time',
    description: 'Build and maintain scalable cloud infrastructure.',
    requirements: ['AWS', 'Kubernetes', 'Docker', 'CI/CD'],
    logo: '☁️',
    remote: true,
    posted: '5 days ago'
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'DataDriven Bern',
    location: 'Bern',
    salary: 'CHF 100,000 - 120,000',
    type: 'Full-time',
    description: 'Analyze complex datasets to drive business insights and growth.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    logo: '📊',
    featured: true,
    posted: '1 day ago'
  },
  {
    id: '6',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Lausanne',
    salary: 'CHF 130,000 - 150,000',
    type: 'Full-time',
    description: 'Lead marketing strategy and team for B2B SaaS company.',
    requirements: ['Marketing Strategy', 'Team Leadership', 'B2B Experience', '7+ years'],
    logo: '📈',
    posted: '4 days ago'
  }
];

function JobCard({ job }: { job: Job }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-5 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-md">
            {job.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              {job.featured && (
                <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Featured</span>
                </div>
              )}
              {job.remote && (
                <div className="bg-jobequal-blue text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Remote
                </div>
              )}
            </div>
            <Link to={`/job/${job.id}`} className="block group-hover:text-jobequal-green transition-colors">
              <h3 className="font-bold text-2xl text-jobequal-text mb-2 leading-tight">
                {job.title}
              </h3>
            </Link>
            <p className="text-jobequal-text-muted font-medium text-lg mb-3">{job.company}</p>
            <p className="text-jobequal-text-muted leading-relaxed mb-4">{job.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requirements.slice(0, 3).map((req, index) => (
                <span 
                  key={index}
                  className="bg-jobequal-green-light text-jobequal-green-dark px-3 py-1 rounded-full text-sm font-medium"
                >
                  {req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="text-jobequal-text-muted text-sm">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`transition-all duration-200 hover:scale-110 ${
            isBookmarked ? 'text-red-500' : 'text-jobequal-text-muted hover:text-red-500'
          }`}
        >
          <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-jobequal-neutral-dark">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-jobequal-text-muted">
            <MapPin className="w-4 h-4 mr-2 text-jobequal-green" />
            <span className="font-medium">{job.location}</span>
          </div>
          <div className="flex items-center text-jobequal-text-muted">
            <Clock className="w-4 h-4 mr-2 text-jobequal-blue-dark" />
            <span className="font-medium">{job.type}</span>
          </div>
          <div className="flex items-center text-jobequal-green font-bold">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span>{job.salary}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-jobequal-text-muted">{job.posted}</span>
          <Link
            to={`/job/${job.id}`}
            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-2 rounded-xl font-medium hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function FilterSidebar() {
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experience: '',
    salary: '',
    remote: false
  });

  const locations = ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Remote'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = ['CHF 60,000 - 80,000', 'CHF 80,000 - 100,000', 'CHF 100,000 - 120,000', 'CHF 120,000+'];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark sticky top-24">
      <div className="flex items-center space-x-3 mb-8">
        <Filter className="w-6 h-6 text-jobequal-green" />
        <h3 className="text-2xl font-bold text-jobequal-text">Filters</h3>
      </div>
      
      <div className="space-y-8">
        {/* Location Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-4">Location</label>
          <select 
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-4">Job Type</label>
          <select 
            value={filters.jobType}
            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
            className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          >
            <option value="">All Types</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-4">Experience Level</label>
          <select 
            value={filters.experience}
            onChange={(e) => setFilters({...filters, experience: e.target.value})}
            className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          >
            <option value="">All Levels</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Salary Filter */}
        <div>
          <label className="block text-jobequal-text font-semibold mb-4">Salary Range</label>
          <select 
            value={filters.salary}
            onChange={(e) => setFilters({...filters, salary: e.target.value})}
            className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          >
            <option value="">All Ranges</option>
            {salaryRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Remote Work */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.remote}
              onChange={(e) => setFilters({...filters, remote: e.target.checked})}
              className="w-5 h-5 text-jobequal-green border-jobequal-neutral-dark rounded focus:ring-jobequal-green"
            />
            <span className="text-jobequal-text font-semibold">Remote Work Available</span>
          </label>
        </div>

        {/* Clear Filters */}
        <button 
          onClick={() => setFilters({location: '', jobType: '', experience: '', salary: '', remote: false})}
          className="w-full bg-jobequal-green-light text-jobequal-green-dark py-3 rounded-xl font-semibold hover:bg-jobequal-green hover:text-white transition-all duration-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-jobequal-text mb-6 leading-tight">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
            Discover opportunities that match your skills and aspirations across Switzerland
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-jobequal-neutral-dark mb-12">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-lg"
              />
            </div>
            <button className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200">
              Search
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-jobequal-text mb-2">
                  {mockJobs.length} Jobs Found
                </h2>
                <p className="text-jobequal-text-muted">
                  Showing the best matches for your search
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-jobequal-text-muted font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-3 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Posted</option>
                  <option value="salary">Salary</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-6">
              {mockJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center space-x-4 mt-12">
              <button className="px-6 py-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:bg-jobequal-green hover:text-white transition-all duration-200">
                Previous
              </button>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map(page => (
                  <button 
                    key={page}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                      page === 1 
                        ? 'bg-jobequal-green text-white' 
                        : 'text-jobequal-text-muted hover:bg-jobequal-green hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="px-6 py-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:bg-jobequal-green hover:text-white transition-all duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
