import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { 
  User, 
  Briefcase, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Star,
  Eye,
  Calendar,
  Target,
  Award,
  Settings,
  Upload,
  Bell,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { SkeletonLoader } from '../components/SkeletonLoader';

// Define types based on expected API responses
interface Job {
  id: string;
  title: string;
  location: string;
  salary_min: number;
  salary_max: number;
  company_name: string;
  companies: { name: string };
}

interface Application {
  id: string;
  created_at: string;
  status: 'submitted' | 'reviewing' | 'interview' | 'rejected' | 'offered';
  jobs: Job;
}

interface Favorite {
  id: string;
  jobs: Job;
}

function ProfileProgressCard({ profileProgress }: { profileProgress: any }) {
  if (!profileProgress) return <SkeletonLoader className="h-64" />;

  const incompleteSections = Object.entries(profileProgress.sections)
    .filter(([, completed]) => !completed)
    .map(([section]) => section);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-jobequal-text flex items-center">
          <User className="w-6 h-6 mr-3 text-jobequal-green" />
          Profile Completion
        </h2>
        <div className="text-3xl font-bold text-jobequal-green">
          {profileProgress.overall}%
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-jobequal-text-muted">Progress</span>
          <span className="text-jobequal-text font-semibold">{profileProgress.overall}% Complete</span>
        </div>
        <div className="w-full bg-jobequal-neutral rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-3 rounded-full transition-all duration-500"
            style={{ width: `${profileProgress.overall}%` }}
          ></div>
        </div>
      </div>
      
      {incompleteSections.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-jobequal-text">Complete your profile:</h3>
          {incompleteSections.map((section) => (
            <div key={section} className="flex items-center justify-between p-3 bg-jobequal-green-light rounded-xl">
              <span className="text-jobequal-green-dark font-medium capitalize">
                {section.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <ArrowRight className="w-4 h-4 text-jobequal-green" />
            </div>
          ))}
        </div>
      )}
      
      <Link
        to="/profile-settings"
        className="block w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 rounded-xl font-semibold text-center hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200"
      >
        Edit Profile
      </Link>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-jobequal-neutral-dark hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-xl flex items-center justify-center text-2xl">
            <Briefcase/>
          </div>
          <div>
            <h3 className="font-bold text-lg text-jobequal-text group-hover:text-jobequal-green transition-colors">
              {job.title}
            </h3>
            <p className="text-jobequal-text-muted">{job.companies?.name || job.company_name}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-jobequal-text-muted">
            <MapPin className="w-4 h-4 mr-1 text-jobequal-green" />
            {job.location}
          </div>
        </div>
        {(job.salary_min && job.salary_max) && (
          <div className="flex items-center text-sm text-jobequal-green font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            CHF {job.salary_min} - {job.salary_max}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <Link
          to={`/job/${job.id}`}
          className="flex-1 bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light text-jobequal-green-dark py-2 rounded-xl font-medium text-center hover:from-jobequal-green hover:to-jobequal-teal hover:text-white transition-all duration-200"
        >
          View Details
        </Link>
        <button className="p-2 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'reviewing': return 'text-yellow-600 bg-yellow-100';
      case 'interview': return 'text-jobequal-green bg-jobequal-green-light';
      case 'offered': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-jobequal-text-muted bg-jobequal-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'reviewing': return <Eye className="w-4 h-4" />;
      case 'interview': return <Calendar className="w-4 h-4" />;
      case 'offered': return <Award className="w-4 h-4" />;
      case 'rejected': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-lg flex items-center justify-center text-lg">
            <Briefcase/>
          </div>
          <div>
            <h3 className="font-semibold text-jobequal-text">{application.jobs.title}</h3>
            <p className="text-jobequal-text-muted text-sm">{application.jobs.companies.name}</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
          {getStatusIcon(application.status)}
          <span className="capitalize">{application.status}</span>
        </div>
      </div>
      
      <div className="text-sm text-jobequal-text-muted">
        Applied on {new Date(application.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'saved'>('overview');
  const { user } = useAuth();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs(*, companies(name))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('*, jobs(*, companies(name))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  // TODO: Fetch real recommendations
  const mockRecommendations: Job[] = [];

  const calculateProfileProgress = (profile: any) => {
    if (!profile) return { overall: 0, sections: {} };
    const sections = {
      basicInfo: !!(profile.full_name && profile.username),
      cv: !!profile.avatar_url, // Using avatar as a proxy for a CV for now
      skills: false, // Assuming no skills field yet
      experience: false, // Assuming no experience field yet
      preferences: false, // Assuming no preferences field yet
    };
    const completed = Object.values(sections).filter(Boolean).length;
    const total = Object.keys(sections).length;
    return {
      overall: Math.round((completed / total) * 100),
      sections,
    };
  };

  const profileProgress = calculateProfileProgress(profile);

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-4">
              Welcome back, {profile?.full_name || user?.email}! 👋
            </h1>
            <p className="text-xl text-jobequal-text-muted">
              Ready to find your next opportunity?
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
              <Bell className="w-6 h-6" />
            </button>
            <Link
              to="/profile-settings"
              className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-jobequal-green mb-1">{mockRecommendations.length}</div>
            <div className="text-jobequal-text-muted">Job Matches</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-jobequal-blue-dark mb-1">{applications?.length ?? 0}</div>
            <div className="text-jobequal-text-muted">Applications</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-blue rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-jobequal-green mb-1">{favorites?.length ?? 0}</div>
            <div className="text-jobequal-text-muted">Saved Jobs</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">0</div>
            <div className="text-jobequal-text-muted">Interviews</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border border-jobequal-neutral-dark">
              <div className="flex space-x-2">
                {[
                  { key: 'overview', label: 'Job Recommendations', icon: Target },
                  { key: 'applications', label: 'My Applications', icon: Briefcase },
                  { key: 'saved', label: 'Saved Jobs', icon: Heart }
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
               <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-jobequal-text">Recommended Jobs</h2>
                  <Link
                    to="/job-search"
                    className="text-jobequal-green hover:text-jobequal-green-dark font-semibold flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {/* Placeholder for real recommendations */}
                  <p className="text-center text-jobequal-text-muted p-8">Job recommendation engine coming soon!</p>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-jobequal-text">My Applications</h2>
                <div className="space-y-4">
                  {isLoadingApplications ? (
                    <SkeletonLoader />
                  ) : applications && applications.length > 0 ? (
                    applications.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))
                  ) : (
                    <p className="text-center text-jobequal-text-muted p-8">You haven't applied to any jobs yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-jobequal-text">Saved Jobs</h2>
                 {isLoadingFavorites ? (
                  <SkeletonLoader />
                ) : favorites && favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map((fav) => (
                      <JobCard key={fav.id} job={fav.jobs} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-jobequal-neutral-dark text-center">
                    <Heart className="w-16 h-16 text-jobequal-text-muted mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-jobequal-text mb-2">No saved jobs yet</h3>
                    <p className="text-jobequal-text-muted mb-6">
                      Start saving jobs you're interested in to keep track of them here.
                    </p>
                    <Link
                      to="/job-search"
                      className="inline-flex items-center space-x-2 bg-jobequal-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors"
                    >
                      <span>Browse Jobs</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Progress */}
            {isLoadingProfile ? <SkeletonLoader className="h-64" /> : <ProfileProgressCard profileProgress={profileProgress} />}

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark">
              <h2 className="text-2xl font-bold text-jobequal-text mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/cv-upload"
                  className="flex items-center space-x-3 p-4 rounded-xl border border-jobequal-neutral-dark hover:bg-jobequal-green-light hover:border-jobequal-green transition-all duration-200 group"
                >
                  <Upload className="w-5 h-5 text-jobequal-green" />
                  <div className="flex-1">
                    <div className="font-semibold text-jobequal-text group-hover:text-jobequal-green-dark">
                      Update CV
                    </div>
                    <div className="text-sm text-jobequal-text-muted">
                      Get better job matches
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-jobequal-text-muted group-hover:text-jobequal-green" />
                </Link>
                
                <Link
                  to="/job-search"
                  className="flex items-center space-x-3 p-4 rounded-xl border border-jobequal-neutral-dark hover:bg-jobequal-green-light hover:border-jobequal-green transition-all duration-200 group"
                >
                  <Target className="w-5 h-5 text-jobequal-green" />
                  <div className="flex-1">
                    <div className="font-semibold text-jobequal-text group-hover:text-jobequal-green-dark">
                      Browse Jobs
                    </div>
                    <div className="text-sm text-jobequal-text-muted">
                      Discover new opportunities
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-jobequal-text-muted group-hover:text-jobequal-green" />
                </Link>
                
                <Link
                  to="/profile-settings"
                  className="flex items-center space-x-3 p-4 rounded-xl border border-jobequal-neutral-dark hover:bg-jobequal-green-light hover:border-jobequal-green transition-all duration-200 group"
                >
                  <Settings className="w-5 h-5 text-jobequal-green" />
                  <div className="flex-1">
                    <div className="font-semibold text-jobequal-text group-hover:text-jobequal-green-dark">
                      Edit Profile
                    </div>
                    <div className="text-sm text-jobequal-text-muted">
                      Manage your information
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-jobequal-text-muted group-hover:text-jobequal-green" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
