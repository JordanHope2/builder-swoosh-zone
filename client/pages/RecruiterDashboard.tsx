import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Calendar, 
  Plus,
  Edit3,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  Bell,
  Search,
  Filter,
  Target,
  Award,
  Activity,
  BarChart3
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'active' | 'draft' | 'closed' | 'paused';
  applicants: number;
  views: number;
  posted: string;
  expires: string;
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  matchScore: number;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'interviewed' | 'offered' | 'rejected';
  avatar: string;
}

const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Zurich',
    type: 'Full-time',
    status: 'active',
    applicants: 24,
    views: 156,
    posted: '2024-01-15',
    expires: '2024-02-15'
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    status: 'active',
    applicants: 18,
    views: 89,
    posted: '2024-01-12',
    expires: '2024-02-12'
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'Geneva',
    type: 'Full-time',
    status: 'draft',
    applicants: 0,
    views: 0,
    posted: '2024-01-20',
    expires: '2024-02-20'
  },
  {
    id: '4',
    title: 'Data Scientist',
    department: 'Analytics',
    location: 'Basel',
    type: 'Full-time',
    status: 'closed',
    applicants: 31,
    views: 203,
    posted: '2023-12-15',
    expires: '2024-01-15'
  }
];

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    location: 'Zurich',
    experience: '8 years',
    matchScore: 95,
    appliedDate: '2024-01-18',
    status: 'new',
    avatar: '👨‍💻'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    title: 'Frontend Developer',
    location: 'Geneva',
    experience: '6 years',
    matchScore: 88,
    appliedDate: '2024-01-17',
    status: 'reviewing',
    avatar: '👩‍💻'
  },
  {
    id: '3',
    name: 'Michael Weber',
    title: 'Full Stack Developer',
    location: 'Basel',
    experience: '7 years',
    matchScore: 82,
    appliedDate: '2024-01-16',
    status: 'interviewed',
    avatar: '👨‍💼'
  }
];

function JobPostingCard({ job }: { job: JobPosting }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-jobequal-green bg-jobequal-green-light border-jobequal-green';
      case 'draft': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'paused': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'closed': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-jobequal-text-muted bg-jobequal-neutral border-jobequal-neutral-dark';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'draft': return <Edit3 className="w-4 h-4" />;
      case 'paused': return <AlertCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-jobequal-neutral-dark hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
              {getStatusIcon(job.status)}
              <span className="capitalize">{job.status}</span>
            </div>
            {job.status === 'active' && (
              <span className="text-xs text-jobequal-text-muted">
                Expires {new Date(job.expires).toLocaleDateString()}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-jobequal-text group-hover:text-jobequal-green transition-colors mb-1">
            {job.title}
          </h3>
          <p className="text-jobequal-text-muted">{job.department} • {job.location} • {job.type}</p>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 rounded-lg text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
            <Edit3 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-jobequal-text-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-jobequal-neutral-dark">
        <div className="text-center">
          <div className="text-2xl font-bold text-jobequal-green">{job.applicants}</div>
          <div className="text-xs text-jobequal-text-muted">Applicants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-jobequal-blue-dark">{job.views}</div>
          <div className="text-xs text-jobequal-text-muted">Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-jobequal-text">
            {job.applicants > 0 ? Math.round((job.applicants / job.views) * 100) : 0}%
          </div>
          <div className="text-xs text-jobequal-text-muted">Conv. Rate</div>
        </div>
      </div>
    </div>
  );
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'reviewing': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'interviewed': return 'text-jobequal-green bg-jobequal-green-light border-jobequal-green';
      case 'offered': return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-jobequal-text-muted bg-jobequal-neutral border-jobequal-neutral-dark';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-jobequal-green bg-jobequal-green-light';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 55) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-2xl">
          {candidate.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-bold text-lg text-jobequal-text group-hover:text-jobequal-green transition-colors">
              {candidate.name}
            </h3>
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${getMatchColor(candidate.matchScore)}`}>
              {candidate.matchScore}% Match
            </div>
          </div>
          
          <p className="text-jobequal-text-muted mb-2">{candidate.title}</p>
          <p className="text-sm text-jobequal-text-muted">
            {candidate.location} • {candidate.experience} experience
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
              <span className="capitalize">{candidate.status}</span>
            </div>
            <span className="text-xs text-jobequal-text-muted">
              Applied {new Date(candidate.appliedDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates'>('overview');
  const [jobFilter, setJobFilter] = useState('all');

  const filteredJobs = mockJobPostings.filter(job => 
    jobFilter === 'all' || job.status === jobFilter
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-4">
              Recruiter Dashboard
            </h1>
            <p className="text-xl text-jobequal-text-muted">
              Manage your job postings and find the best candidates
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
              <Settings className="w-6 h-6" />
            </button>
            <Link
              to="/post-job"
              className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-jobequal-green mb-1">4</div>
            <div className="text-jobequal-text-muted">Active Jobs</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-jobequal-blue-dark mb-1">73</div>
            <div className="text-jobequal-text-muted">Total Applicants</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">24</div>
            <div className="text-jobequal-text-muted">New This Week</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">6</div>
            <div className="text-jobequal-text-muted">Hires Made</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border border-jobequal-neutral-dark mb-8">
          <div className="flex space-x-2">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'jobs', label: 'Job Postings', icon: Briefcase },
              { key: 'candidates', label: 'Recent Candidates', icon: Users }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-jobequal-green text-white shadow-md'
                    : 'text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Performance Chart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark">
              <h2 className="text-2xl font-bold text-jobequal-text mb-6">Application Trends</h2>
              <div className="h-64 bg-jobequal-neutral rounded-2xl flex items-center justify-center">
                <p className="text-jobequal-text-muted">Chart visualization would go here</p>
              </div>
            </div>

            {/* Top Performing Jobs */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark">
              <h2 className="text-2xl font-bold text-jobequal-text mb-6">Top Performing Jobs</h2>
              <div className="space-y-4">
                {mockJobPostings.filter(job => job.status === 'active').map((job, index) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-jobequal-green-light rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-jobequal-green rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-jobequal-green-dark">{job.title}</h3>
                        <p className="text-sm text-jobequal-text-muted">{job.applicants} applicants</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-jobequal-green">{job.views}</div>
                      <div className="text-xs text-jobequal-text-muted">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* Filter Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                >
                  <option value="all">All Jobs</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-jobequal-text-muted" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="pl-10 pr-4 py-2 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-jobequal-text-muted">
                Showing {filteredJobs.length} of {mockJobPostings.length} jobs
              </p>
            </div>

            {/* Job Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobPostingCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-jobequal-text">Recent Candidates</h2>
              <Link
                to="/applicants"
                className="text-jobequal-green hover:text-jobequal-green-dark font-semibold"
              >
                View All Applicants →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCandidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
