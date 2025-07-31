import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Eye,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  MoreVertical,
  Star,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  MessageCircle,
  Send,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Share,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  title: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  status: 'new' | 'reviewed' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  appliedDate: string;
  salary: string;
  availability: string;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
  views: number;
  posted: string;
  salary: string;
  applications: Candidate[];
}

const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Zurich',
    type: 'Full-time',
    status: 'active',
    applicants: 47,
    views: 324,
    posted: '2 weeks ago',
    salary: 'CHF 120,000 - 140,000',
    applications: [
      {
        id: '1',
        name: 'Jordan Hope',
        avatar: '👨‍💻',
        title: 'Senior Software Engineer',
        location: 'Zurich',
        experience: '5 years',
        skills: ['React', 'Node.js', 'TypeScript'],
        matchScore: 95,
        status: 'interviewed',
        appliedDate: '3 days ago',
        salary: 'CHF 130,000',
        availability: 'Immediately'
      },
      {
        id: '2',
        name: 'Sarah Chen',
        avatar: '👩‍💻',
        title: 'Full Stack Developer',
        location: 'Geneva',
        experience: '4 years',
        skills: ['Vue.js', 'Python', 'AWS'],
        matchScore: 87,
        status: 'reviewed',
        appliedDate: '1 week ago',
        salary: 'CHF 125,000',
        availability: '2 weeks notice'
      }
    ]
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Basel',
    type: 'Full-time',
    status: 'active',
    applicants: 28,
    views: 156,
    posted: '1 week ago',
    salary: 'CHF 110,000 - 130,000',
    applications: []
  }
];

const analytics = {
  totalJobs: 8,
  activeJobs: 5,
  totalApplicants: 142,
  hiredThisMonth: 3,
  averageTimeToHire: 21,
  topSkills: ['React', 'Python', 'AWS', 'JavaScript', 'Node.js'],
  applicationTrends: [
    { month: 'Jan', applications: 45 },
    { month: 'Feb', applications: 52 },
    { month: 'Mar', applications: 38 },
    { month: 'Apr', applications: 67 },
    { month: 'May', applications: 58 }
  ]
};

const pipelineStages = [
  { name: 'New Applications', count: 23, color: 'bg-blue-500' },
  { name: 'Screening', count: 15, color: 'bg-yellow-500' },
  { name: 'Interview', count: 8, color: 'bg-purple-500' },
  { name: 'Final Review', count: 4, color: 'bg-orange-500' },
  { name: 'Offer', count: 2, color: 'bg-green-500' }
];

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(mockJobPostings[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'interviewed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      case 'offered': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      case 'hired': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">
              Recruiter Dashboard
            </h1>
            <p className="text-jobequal-text-muted dark:text-gray-300">
              Manage your job postings and track candidate pipeline
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Post New Job</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: 'Active Jobs', value: analytics.activeJobs, total: analytics.totalJobs, icon: Briefcase, color: 'text-blue-600' },
            { title: 'Total Applicants', value: analytics.totalApplicants, change: '+12%', icon: Users, color: 'text-green-600' },
            { title: 'Hired This Month', value: analytics.hiredThisMonth, change: '+2', icon: UserCheck, color: 'text-purple-600' },
            { title: 'Avg. Time to Hire', value: `${analytics.averageTimeToHire}d`, change: '-3d', icon: Clock, color: 'text-orange-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                {stat.change && (
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') 
                      ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                      : 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-jobequal-text dark:text-white mb-1">
                {stat.value}
                {stat.total && <span className="text-lg text-jobequal-text-muted dark:text-gray-400">/{stat.total}</span>}
              </div>
              <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pipeline Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6">Hiring Pipeline</h3>
          <div className="grid grid-cols-5 gap-4">
            {pipelineStages.map((stage, index) => (
              <div key={index} className="text-center">
                <div className={`w-full h-24 ${stage.color} rounded-xl flex items-center justify-center mb-3 relative overflow-hidden`}>
                  <div className="text-3xl font-bold text-white">{stage.count}</div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                </div>
                <h4 className="font-semibold text-jobequal-text dark:text-white text-sm mb-1">{stage.name}</h4>
                <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                  {Math.round((stage.count / 52) * 100)}% of total
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Postings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-jobequal-text dark:text-white">Active Job Postings</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Filter className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <Search className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockJobPostings.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                      selectedJob?.id === job.id ? 'bg-jobequal-green-light dark:bg-jobequal-green/10' : ''
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-jobequal-text dark:text-white">{job.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                            job.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                          <span>{job.department}</span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center text-jobequal-green">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="font-medium">{job.applicants} applicants</span>
                          </div>
                          <div className="flex items-center text-blue-600">
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="font-medium">{job.views} views</span>
                          </div>
                          <span className="text-jobequal-text-muted dark:text-gray-400">{job.posted}</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Candidate Details */}
          <div className="space-y-6">
            {selectedJob && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
              >
                <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                  Recent Applications
                </h3>
                <div className="space-y-4">
                  {selectedJob.applications.length > 0 ? (
                    selectedJob.applications.map((candidate, index) => (
                      <div key={candidate.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-lg">
                              {candidate.avatar}
                            </div>
                            <div>
                              <h4 className="font-semibold text-jobequal-text dark:text-white">{candidate.name}</h4>
                              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">{candidate.title}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(candidate.matchScore)}`}>
                            {candidate.matchScore}% match
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-jobequal-text-muted dark:text-gray-400">Experience:</span>
                            <span className="font-medium text-jobequal-text dark:text-white">{candidate.experience}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-jobequal-text-muted dark:text-gray-400">Location:</span>
                            <span className="font-medium text-jobequal-text dark:text-white">{candidate.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-jobequal-text-muted dark:text-gray-400">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {candidate.skills.slice(0, 3).map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <button className="flex-1 bg-jobequal-green hover:bg-jobequal-green-hover text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                            Review
                          </button>
                          <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <MessageCircle className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-jobequal-text-muted dark:text-gray-400 mx-auto mb-4" />
                      <p className="text-jobequal-text-muted dark:text-gray-400">No applications yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-medium hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 flex items-center justify-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Post New Job</span>
                </button>
                <button className="w-full bg-white dark:bg-gray-700 border border-jobequal-green text-jobequal-green py-3 px-4 rounded-xl font-medium hover:bg-jobequal-green-light dark:hover:bg-jobequal-green/10 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-jobequal-text dark:text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Manage Settings</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
