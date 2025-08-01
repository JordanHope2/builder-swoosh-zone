import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart3,
  Users,
  Briefcase,
  TrendingUp,
  MessageCircle,
  Star,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  MapPin,
  Building,
  Heart,
  Share2,
  Settings,
  Bell,
  FileText,
  PieChart,
  Activity,
  Zap,
  Globe,
  Camera,
  Video,
  Mail,
  Phone,
  Linkedin,
  Twitter
} from 'lucide-react';
import {
  DashboardContainer,
  StatsCard,
  SectionHeader,
  ActionButton,
  DashboardCard,
  LoadingSpinner,
  fadeInUp,
  slideInLeft
} from '../components/ui/unified-dashboard';
import SecurityUtils from '../lib/security';

interface DashboardStats {
  totalJobPosts: number;
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  profileViews: number;
  followers: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  averageResponseTime: string;
}

interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  status: 'active' | 'paused' | 'closed' | 'draft';
  applications: number;
  views: number;
  postedDate: string;
  deadline: string;
  urgent?: boolean;
}

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  matchScore: number;
  experience: string;
  location: string;
  salary: string;
}

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  headquarters: string;
  website: string;
  description: string;
  verified: boolean;
}

const mockStats: DashboardStats = {
  totalJobPosts: 24,
  activeJobs: 8,
  totalApplications: 342,
  newApplications: 15,
  profileViews: 1250,
  followers: 89,
  averageRating: 4.2,
  totalReviews: 156,
  responseRate: 95,
  averageResponseTime: '2.3 hours'
};

const mockJobs: JobPost[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Zurich',
    type: 'Full-time',
    salary: 'CHF 120,000 - 140,000',
    status: 'active',
    applications: 45,
    views: 234,
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
    urgent: true
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Zurich',
    type: 'Full-time',
    salary: 'CHF 110,000 - 130,000',
    status: 'active',
    applications: 28,
    views: 156,
    postedDate: '2024-01-10',
    deadline: '2024-02-10'
  },
  {
    id: '3',
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: 'CHF 85,000 - 105,000',
    status: 'paused',
    applications: 67,
    views: 298,
    postedDate: '2024-01-05',
    deadline: '2024-02-05'
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Software Engineer',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@email.com',
    appliedDate: '2024-01-16',
    status: 'new',
    matchScore: 95,
    experience: '8 years',
    location: 'Zurich',
    salary: 'CHF 130,000'
  },
  {
    id: '2',
    jobId: '1',
    jobTitle: 'Senior Software Engineer',
    candidateName: 'Michael Chen',
    candidateEmail: 'michael.chen@email.com',
    appliedDate: '2024-01-16',
    status: 'reviewing',
    matchScore: 88,
    experience: '6 years',
    location: 'Zurich',
    salary: 'CHF 125,000'
  },
  {
    id: '3',
    jobId: '2',
    jobTitle: 'Product Manager',
    candidateName: 'Emma Rodriguez',
    candidateEmail: 'emma.rodriguez@email.com',
    appliedDate: '2024-01-15',
    status: 'shortlisted',
    matchScore: 91,
    experience: '5 years',
    location: 'Geneva',
    salary: 'CHF 120,000'
  }
];

const mockCompanyProfile: CompanyProfile = {
  id: '1',
  name: 'TechCorp Zurich',
  logo: '🚀',
  industry: 'Technology',
  size: '200-500 employees',
  headquarters: 'Zurich, Switzerland',
  website: 'https://techcorp.ch',
  description: 'Leading fintech company revolutionizing digital banking solutions across Europe.',
  verified: true
};

export default function CompanyDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobFilter, setJobFilter] = useState('all');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Job Posts', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Company Profile', icon: Building },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'draft':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'interviewed':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'offered':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesFilter = jobFilter === 'all' || job.status === jobFilter;
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredApplications = mockApplications.filter(application => {
    const matchesFilter = applicationFilter === 'all' || application.status === applicationFilter;
    const matchesSearch = searchTerm === '' || 
      application.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center mb-6 lg:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-lg mr-4">
                {mockCompanyProfile.logo}
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white mb-2">
                  Company Dashboard
                </h1>
                <p className="text-jobequal-text-muted dark:text-gray-400 flex items-center">
                  {mockCompanyProfile.name}
                  {mockCompanyProfile.verified && (
                    <CheckCircle className="w-4 h-4 ml-2 text-jobequal-green" />
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-jobequal-neutral-dark dark:border-gray-600 text-jobequal-text dark:text-white rounded-xl hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-colors">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </button>
              <button className="flex items-center px-6 py-2 bg-jobequal-green text-white rounded-xl hover:bg-jobequal-green-hover transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">Active Jobs</p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">{mockStats.activeJobs}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-jobequal-green/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-jobequal-green" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">Applications</p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">{mockStats.totalApplications}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +{mockStats.newApplications} new today
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">Profile Views</p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">{mockStats.profileViews}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  +8% this week
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-jobequal-text-muted dark:text-gray-400">Rating</p>
                <p className="text-2xl font-bold text-jobequal-text dark:text-white">{mockStats.averageRating}/5</p>
                <div className="flex items-center mt-1">
                  {renderStars(mockStats.averageRating)}
                  <span className="text-xs text-jobequal-text-muted dark:text-gray-400 ml-1">
                    ({mockStats.totalReviews})
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-2 mb-8"
        >
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-jobequal-green text-white shadow-md'
                    : 'text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:bg-jobequal-neutral dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Activity className="w-6 h-6 mr-3 text-jobequal-green" />
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-jobequal-green/5 rounded-xl">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-jobequal-text dark:text-white font-medium">New application received</p>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">Sarah Johnson applied for Senior Software Engineer</p>
                        <p className="text-xs text-jobequal-text-muted dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-jobequal-text dark:text-white font-medium">High profile view activity</p>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">Your company profile was viewed 45 times today</p>
                        <p className="text-xs text-jobequal-text-muted dark:text-gray-400">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-jobequal-text dark:text-white font-medium">New review received</p>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400">5-star review from a former employee</p>
                        <p className="text-xs text-jobequal-text-muted dark:text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Analytics */}
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center p-3 bg-jobequal-green/10 hover:bg-jobequal-green/20 rounded-xl transition-colors">
                        <Plus className="w-5 h-5 mr-3 text-jobequal-green" />
                        <span className="text-jobequal-text dark:text-white font-medium">Post New Job</span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
                        <MessageCircle className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">Message Candidates</span>
                      </button>
                      <button className="w-full flex items-center p-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                        <BarChart3 className="w-5 h-5 mr-3 text-purple-600 dark:text-purple-400" />
                        <span className="text-jobequal-text dark:text-white font-medium">View Analytics</span>
                      </button>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-6">
                    <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">Response Rate</span>
                          <span className="text-sm font-bold text-jobequal-green">{mockStats.responseRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full"
                            style={{ width: `${mockStats.responseRate}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">Avg. Response Time</span>
                          <span className="text-sm font-bold text-jobequal-green">{mockStats.averageResponseTime}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">Followers</span>
                          <span className="text-sm font-bold text-jobequal-green">{mockStats.followers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0">
                    Job Posts ({mockJobs.length})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      />
                    </div>
                    <select
                      value={jobFilter}
                      onChange={(e) => setJobFilter(e.target.value)}
                      className="px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="all">All Jobs</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button className="flex items-center px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors">
                      <Plus className="w-4 h-4 mr-2" />
                      New Job
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-jobequal-text dark:text-white mr-3">
                              {job.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                            {job.urgent && (
                              <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                                Urgent
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                            <span className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              {job.department}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.type}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Posted {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6">
                            <span className="text-lg font-bold text-jobequal-green">
                              {job.salary}
                            </span>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {job.applications} applications
                            </span>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {job.views} views
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-red-500 dark:text-gray-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-0">
                    Applications ({mockStats.totalApplications})
                  </h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted" />
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      />
                    </div>
                    <select
                      value={applicationFilter}
                      onChange={(e) => setApplicationFilter(e.target.value)}
                      className="px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="all">All Applications</option>
                      <option value="new">New</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="offered">Offered</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-jobequal-green text-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mr-3">
                              {application.candidateName}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                            <div className="ml-3 flex items-center">
                              <Target className="w-4 h-4 text-jobequal-green mr-1" />
                              <span className="text-sm font-medium text-jobequal-green">{application.matchScore}% Match</span>
                            </div>
                          </div>
                          <p className="text-jobequal-text-muted dark:text-gray-400 mb-2">{application.jobTitle}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-jobequal-text-muted dark:text-gray-400">
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {application.candidateEmail}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {application.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {application.experience}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {application.salary}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Applied {new Date(application.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 text-jobequal-green border border-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors">
                            View Profile
                          </button>
                          <button className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors">
                            Contact
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-jobequal-green" />
                    Hiring Performance
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-jobequal-green/5 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">Time to Fill</span>
                      <span className="text-xl font-bold text-jobequal-green">18 days</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">Quality of Hire</span>
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">4.3/5</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                      <span className="font-medium text-jobequal-text dark:text-white">Offer Acceptance Rate</span>
                      <span className="text-xl font-bold text-purple-600 dark:text-purple-400">85%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <PieChart className="w-6 h-6 mr-3 text-jobequal-green" />
                    Application Sources
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">JobEqual Platform</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-jobequal-green h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">65%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">Direct Applications</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">Referrals</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">10%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-jobequal-text dark:text-white">Other</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white flex items-center">
                    <Building className="w-6 h-6 mr-3 text-jobequal-green" />
                    Company Profile
                  </h2>
                  <button className="flex items-center px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Company Name</label>
                      <input
                        type="text"
                        value={mockCompanyProfile.name}
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Industry</label>
                      <input
                        type="text"
                        value={mockCompanyProfile.industry}
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Company Size</label>
                      <input
                        type="text"
                        value={mockCompanyProfile.size}
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Headquarters</label>
                      <input
                        type="text"
                        value={mockCompanyProfile.headquarters}
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Website</label>
                      <input
                        type="text"
                        value={mockCompanyProfile.website}
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Description</label>
                      <textarea
                        value={mockCompanyProfile.description}
                        rows={4}
                        className="w-full px-4 py-2 border border-jobequal-neutral-dark dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-6xl mx-auto mb-4">
                        {mockCompanyProfile.logo}
                      </div>
                      <button className="flex items-center px-4 py-2 border border-jobequal-green text-jobequal-green rounded-lg hover:bg-jobequal-green hover:text-white transition-colors mx-auto">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Logo
                      </button>
                    </div>

                    <div className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6">
                      <h3 className="font-semibold text-jobequal-text dark:text-white mb-4">Verification Status</h3>
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Verified Company</span>
                      </div>
                      <p className="text-xs text-jobequal-text-muted dark:text-gray-400 mt-2">
                        Your company profile has been verified by JobEqual
                      </p>
                    </div>

                    <div className="border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl p-6">
                      <h3 className="font-semibold text-jobequal-text dark:text-white mb-4">Quick Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Profile Views</span>
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">{mockStats.profileViews}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Followers</span>
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">{mockStats.followers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Rating</span>
                          <span className="text-sm font-medium text-jobequal-text dark:text-white">{mockStats.averageRating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-jobequal-green" />
                    Account Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Email Notifications</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green" />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">New applications</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green" />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">Profile views</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green" />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">Marketing updates</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">Privacy Settings</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green" />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">Show company in public listings</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green" />
                          <span className="ml-2 text-sm text-jobequal-text dark:text-white">Allow candidates to contact directly</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
                  <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                    <Zap className="w-6 h-6 mr-3 text-jobequal-green" />
                    Subscription & Billing
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-jobequal-green/10 rounded-xl">
                      <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">Enterprise Plan</h3>
                      <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                        Unlimited job posts, advanced analytics, priority support
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-jobequal-green">CHF 299/month</span>
                        <button className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors">
                          Manage
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">Usage This Month</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-jobequal-text-muted dark:text-gray-400">Job Posts</span>
                          <span className="text-jobequal-text dark:text-white">{mockStats.activeJobs} / Unlimited</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-jobequal-text-muted dark:text-gray-400">Applications</span>
                          <span className="text-jobequal-text dark:text-white">{mockStats.totalApplications} / Unlimited</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
