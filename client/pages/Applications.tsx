import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { PageHeader } from '../components/ui/page-header';
import { ProtectedRoute } from '../components/ProtectedRoute';
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Eye,
  ExternalLink,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  User,
  Mail,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  applicationUrl?: string;
  jobUrl: string;
  salary?: string;
  jobType: string;
  priority?: 'high' | 'medium' | 'low';
  nextStep?: string;
  notes?: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Senior Frontend Developer',
    company: 'TechCorp Zurich',
    companyLogo: '🚀',
    location: 'Zurich, Switzerland',
    appliedDate: '2024-01-15',
    status: 'interview',
    jobUrl: '/job/1',
    salary: 'CHF 120,000 - 140,000',
    jobType: 'Full-time',
    priority: 'high',
    nextStep: 'Technical interview scheduled for Jan 25',
    notes: 'Great company culture, interesting tech stack'
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    company: 'InnovateCH',
    companyLogo: '💡',
    location: 'Geneva, Switzerland',
    appliedDate: '2024-01-12',
    status: 'reviewing',
    jobUrl: '/job/2',
    salary: 'CHF 110,000 - 130,000',
    jobType: 'Full-time',
    priority: 'medium',
    nextStep: 'Waiting for initial screening',
    notes: 'Applied through LinkedIn'
  },
  {
    id: '3',
    jobTitle: 'UX Designer',
    company: 'DesignStudio Basel',
    companyLogo: '🎨',
    location: 'Basel, Switzerland',
    appliedDate: '2024-01-10',
    status: 'pending',
    jobUrl: '/job/3',
    salary: 'CHF 85,000 - 105,000',
    jobType: 'Full-time',
    priority: 'medium',
    nextStep: 'Application under review',
    notes: 'Portfolio submitted'
  },
  {
    id: '4',
    jobTitle: 'Data Scientist',
    company: 'DataDriven Bern',
    companyLogo: '📊',
    location: 'Bern, Switzerland',
    appliedDate: '2024-01-05',
    status: 'rejected',
    jobUrl: '/job/4',
    salary: 'CHF 100,000 - 120,000',
    jobType: 'Full-time',
    priority: 'low',
    nextStep: 'Application closed',
    notes: 'Good experience, will try again next year'
  },
  {
    id: '5',
    jobTitle: 'DevOps Engineer',
    company: 'CloudTech AG',
    companyLogo: '☁️',
    location: 'Remote',
    appliedDate: '2024-01-08',
    status: 'accepted',
    jobUrl: '/job/5',
    salary: 'CHF 95,000 - 115,000',
    jobType: 'Full-time',
    priority: 'high',
    nextStep: 'Contract signing scheduled',
    notes: 'Great team, exciting projects'
  }
];

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    label: 'Pending Review'
  },
  reviewing: {
    icon: Eye,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    label: 'Under Review'
  },
  interview: {
    icon: PlayCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    label: 'Interview Stage'
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-100',
    border: 'border-red-200',
    label: 'Not Selected'
  },
  accepted: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
    border: 'border-green-200',
    label: 'Offer Received'
  }
};

function ApplicationCard({ application }: { application: Application }) {
  const status = statusConfig[application.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${status.border}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center text-xl shadow-md">
            {application.companyLogo}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-jobequal-text mb-1 leading-tight">
              {application.jobTitle}
            </h3>
            <p className="text-jobequal-text-muted font-medium mb-2">{application.company}</p>
            
            <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted mb-3">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{application.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>{application.jobType}</span>
              </div>
            </div>

            {application.salary && (
              <div className="flex items-center space-x-1 text-sm font-semibold text-jobequal-green mb-3">
                <TrendingUp className="w-4 h-4" />
                <span>{application.salary}</span>
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${status.bg}`}>
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {application.nextStep && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-jobequal-text font-medium">Next Step:</p>
          <p className="text-sm text-jobequal-text-muted">{application.nextStep}</p>
        </div>
      )}

      {application.notes && (
        <div className="mb-4 p-3 bg-jobequal-neutral rounded-lg">
          <p className="text-sm text-jobequal-text font-medium">Notes:</p>
          <p className="text-sm text-jobequal-text-muted">{application.notes}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {application.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.priority === 'high' ? 'bg-red-100 text-red-700' :
              application.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)} Priority
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={application.jobUrl}
            className="inline-flex items-center space-x-1 text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Job</span>
          </a>
          {application.applicationUrl && (
            <a
              href={application.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Track</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewing: applications.filter(app => app.status === 'reviewing').length,
    interview: applications.filter(app => app.status === 'interview').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Your Career Journey"
            title="Job Applications"
            description="Track and manage all your job applications in one place. Stay organized and never miss an opportunity."
          >
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Briefcase className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm font-medium text-jobequal-text">{applications.length} Applications</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <PlayCircle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-jobequal-text">{statusCounts.interview} Interviews</span>
              </div>
            </div>
          </PageHeader>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white appearance-none pr-10"
                >
                  <option value="all">All Status ({statusCounts.all})</option>
                  <option value="pending">Pending ({statusCounts.pending})</option>
                  <option value="reviewing">Reviewing ({statusCounts.reviewing})</option>
                  <option value="interview">Interview ({statusCounts.interview})</option>
                  <option value="accepted">Accepted ({statusCounts.accepted})</option>
                  <option value="rejected">Rejected ({statusCounts.rejected})</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ApplicationCard application={application} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-jobequal-text mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
            </h3>
            <p className="text-jobequal-text-muted mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start applying to jobs to see them here'
              }
            </p>
            {(!searchQuery && statusFilter === 'all') && (
              <a
                href="/job-search"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 transform hover:scale-105"
              >
                <Search className="w-5 h-5" />
                <span>Browse Jobs</span>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function Applications() {
  return (
    <ProtectedRoute>
      <ApplicationsPage />
    </ProtectedRoute>
  );
}
