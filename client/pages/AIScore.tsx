import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  Star, 
  Award,
  Brain,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  Lightbulb,
  BookOpen,
  Users,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  Clock,
  Briefcase,
  GraduationCap,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  matchScore: number;
  strengths: string[];
  improvements: string[];
  requirements: {
    skill: string;
    userLevel: number;
    requiredLevel: number;
    match: boolean;
  }[];
}

interface SkillAnalysis {
  category: string;
  skills: {
    name: string;
    userLevel: number;
    marketDemand: number;
    salaryImpact: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const mockJobMatch: JobMatch = {
  id: '1',
  title: 'Senior Software Engineer',
  company: 'TechCorp Zurich',
  logo: '🚀',
  location: 'Zurich',
  salary: 'CHF 120,000 - 140,000',
  matchScore: 95,
  strengths: [
    'Perfect JavaScript & React experience match',
    'Leadership skills align with team lead requirements',
    'Swiss location preference matches',
    'Salary expectations within range'
  ],
  improvements: [
    'Consider getting AWS certification',
    'Docker experience could be strengthened',
    'Add more project management experience'
  ],
  requirements: [
    { skill: 'JavaScript', userLevel: 95, requiredLevel: 90, match: true },
    { skill: 'React', userLevel: 90, requiredLevel: 85, match: true },
    { skill: 'Node.js', userLevel: 85, requiredLevel: 80, match: true },
    { skill: 'TypeScript', userLevel: 80, requiredLevel: 75, match: true },
    { skill: 'AWS', userLevel: 60, requiredLevel: 70, match: false },
    { skill: 'Docker', userLevel: 55, requiredLevel: 65, match: false },
    { skill: 'Leadership', userLevel: 85, requiredLevel: 70, match: true },
    { skill: 'Communication', userLevel: 90, requiredLevel: 80, match: true }
  ]
};

const skillAnalysis: SkillAnalysis[] = [
  {
    category: 'Technical Skills',
    skills: [
      { name: 'JavaScript', userLevel: 95, marketDemand: 98, salaryImpact: 85, trend: 'stable' },
      { name: 'React', userLevel: 90, marketDemand: 95, salaryImpact: 88, trend: 'up' },
      { name: 'Node.js', userLevel: 85, marketDemand: 85, salaryImpact: 82, trend: 'up' },
      { name: 'TypeScript', userLevel: 80, marketDemand: 92, salaryImpact: 90, trend: 'up' },
      { name: 'Python', userLevel: 75, marketDemand: 88, salaryImpact: 85, trend: 'up' },
      { name: 'AWS', userLevel: 60, marketDemand: 95, salaryImpact: 95, trend: 'up' }
    ]
  },
  {
    category: 'Soft Skills',
    skills: [
      { name: 'Leadership', userLevel: 85, marketDemand: 90, salaryImpact: 92, trend: 'stable' },
      { name: 'Communication', userLevel: 90, marketDemand: 95, salaryImpact: 88, trend: 'stable' },
      { name: 'Problem Solving', userLevel: 88, marketDemand: 92, salaryImpact: 85, trend: 'stable' },
      { name: 'Team Management', userLevel: 80, marketDemand: 85, salaryImpact: 90, trend: 'up' }
    ]
  }
];

const marketInsights = [
  {
    title: 'High Demand Skills',
    description: 'Skills with 90%+ market demand in Switzerland',
    skills: ['AWS', 'TypeScript', 'React', 'Communication'],
    icon: TrendingUp,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30'
  },
  {
    title: 'Salary Boosters',
    description: 'Skills that significantly impact compensation',
    skills: ['AWS', 'Leadership', 'TypeScript', 'Team Management'],
    icon: DollarSign,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  },
  {
    title: 'Trending Up',
    description: 'Skills gaining popularity in Swiss market',
    skills: ['React', 'Node.js', 'TypeScript', 'Team Management'],
    icon: ArrowUp,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'
  }
];

export default function AIScore() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJob, setSelectedJob] = useState<JobMatch>(mockJobMatch);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis loading
    setTimeout(() => setIsAnalyzing(false), 2000);
  }, []);

  const getSkillColor = (userLevel: number, requiredLevel: number) => {
    if (userLevel >= requiredLevel) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (userLevel >= requiredLevel * 0.8) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  if (isAnalyzing) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Navigation />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-jobequal-green border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4">
            Analyzing Your Profile
          </h2>
          <p className="text-jobequal-text-muted dark:text-gray-300 mb-6">
            Our AI is computing detailed skill matches and market insights...
          </p>
          <div className="space-y-2 text-sm text-jobequal-text-muted dark:text-gray-400">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ✓ Processing skill compatibility
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              ✓ Analyzing market demand
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              ✓ Calculating salary impact
            </motion.p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-jobequal-green mr-3" />
            <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white">
              AI Match Analysis
            </h1>
          </div>
          <p className="text-lg text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            Deep dive into your profile compatibility with detailed skill analysis and market insights
          </p>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-jobequal-green mb-2">{selectedJob.matchScore}%</div>
              <div className="text-sm font-medium text-jobequal-text dark:text-white">Overall Match</div>
              <div className="text-xs text-jobequal-text-muted dark:text-gray-400 mt-1">Excellent fit</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">8/10</div>
              <div className="text-sm font-medium text-jobequal-text dark:text-white">Skill Match</div>
              <div className="text-xs text-jobequal-text-muted dark:text-gray-400 mt-1">Strong alignment</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm font-medium text-jobequal-text dark:text-white">Market Fit</div>
              <div className="text-xs text-jobequal-text-muted dark:text-gray-400 mt-1">Top percentile</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-orange-600 mb-2">+15%</div>
              <div className="text-sm font-medium text-jobequal-text dark:text-white">Salary Potential</div>
              <div className="text-xs text-jobequal-text-muted dark:text-gray-400 mt-1">Above average</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'overview', label: 'Match Overview', icon: Eye },
              { id: 'skills', label: 'Skill Analysis', icon: Zap },
              { id: 'market', label: 'Market Insights', icon: BarChart3 },
              { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-jobequal-green text-jobequal-green'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Job Match Card */}
              <div className="lg:col-span-2">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl shadow-md">
                        {selectedJob.logo}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-1">
                          {selectedJob.title}
                        </h3>
                        <p className="text-jobequal-green font-medium text-lg mb-2">{selectedJob.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedJob.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {selectedJob.salary}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-jobequal-green mb-1">{selectedJob.matchScore}%</div>
                      <div className="text-sm text-jobequal-text-muted dark:text-gray-400">Match Score</div>
                    </div>
                  </div>

                  {/* Skill Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-jobequal-text dark:text-white mb-4">Skill Requirements</h4>
                    <div className="space-y-3">
                      {selectedJob.requirements.map((req, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${req.match ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="font-medium text-jobequal-text dark:text-white">{req.skill}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              Your level: <span className="font-medium">{req.userLevel}%</span>
                            </div>
                            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              Required: <span className="font-medium">{req.requiredLevel}%</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSkillColor(req.userLevel, req.requiredLevel)}`}>
                              {req.match ? 'Match' : 'Gap'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Link
                      to={`/job/${selectedJob.id}`}
                      className="flex-1 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-6 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 text-center"
                    >
                      View Full Job Details
                    </Link>
                    <button className="px-6 py-3 border border-jobequal-green text-jobequal-green rounded-xl font-semibold hover:bg-jobequal-green hover:text-white transition-all duration-200">
                      Save Analysis
                    </button>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="space-y-6">
                {/* Strengths */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Your Strengths
                  </h4>
                  <ul className="space-y-2">
                    {selectedJob.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                        <Star className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Growth Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {selectedJob.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-start">
                        <ArrowUp className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                    Get Learning Recommendations
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {skillAnalysis.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                  <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6">{category.category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.skills.map((skill, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-jobequal-text dark:text-white">{skill.name}</h4>
                          {getTrendIcon(skill.trend)}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-jobequal-text-muted dark:text-gray-400">Your Level</span>
                              <span className="font-medium">{skill.userLevel}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-jobequal-green h-2 rounded-full transition-all duration-500"
                                style={{ width: `${skill.userLevel}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-jobequal-text-muted dark:text-gray-400">Market Demand</span>
                              <span className="font-medium">{skill.marketDemand}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${skill.marketDemand}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-jobequal-text-muted dark:text-gray-400">Salary Impact</span>
                              <span className="font-medium">{skill.salaryImpact}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${skill.salaryImpact}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {marketInsights.map((insight, index) => (
                <div key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${insight.color}`}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-2">{insight.title}</h3>
                  <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">{insight.description}</p>
                  <div className="space-y-2">
                    {insight.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm font-medium text-jobequal-text dark:text-white">{skill}</span>
                        <ChevronRight className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Learning Path */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-jobequal-green" />
                  Recommended Learning Path
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-jobequal-text dark:text-white">Priority Skills</h4>
                    {['AWS Certification', 'Docker Fundamentals', 'Advanced TypeScript'].map((course, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-jobequal-text dark:text-white">{course}</span>
                          <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">High Impact</span>
                        </div>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                          Estimated time: {index === 0 ? '40 hours' : index === 1 ? '20 hours' : '30 hours'}
                        </p>
                        <button className="w-full bg-jobequal-green hover:bg-jobequal-green-hover text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                          Start Learning
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-jobequal-text dark:text-white">Bonus Skills</h4>
                    {['Kubernetes Basics', 'GraphQL', 'System Design'].map((course, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-jobequal-text dark:text-white">{course}</span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">Nice to Have</span>
                        </div>
                        <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                          Estimated time: {index === 0 ? '25 hours' : index === 1 ? '15 hours' : '35 hours'}
                        </p>
                        <button className="w-full border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                          Explore
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Career Suggestions */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
                <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-jobequal-green" />
                  Career Growth Suggestions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { role: 'Tech Lead', timeline: '6-12 months', requirements: ['Leadership', 'Architecture'] },
                    { role: 'Staff Engineer', timeline: '1-2 years', requirements: ['System Design', 'Mentoring'] },
                    { role: 'Engineering Manager', timeline: '1-3 years', requirements: ['People Management', 'Strategy'] }
                  ].map((path, index) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-jobequal-green/10 to-jobequal-teal/10 rounded-xl border border-jobequal-green/20">
                      <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">{path.role}</h4>
                      <div className="flex items-center text-sm text-jobequal-text-muted dark:text-gray-400 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {path.timeline}
                      </div>
                      <div className="space-y-1 mb-4">
                        {path.requirements.map((req, reqIndex) => (
                          <div key={reqIndex} className="text-xs bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green px-2 py-1 rounded-full inline-block mr-1">
                            {req}
                          </div>
                        ))}
                      </div>
                      <button className="w-full text-jobequal-green hover:text-jobequal-green-hover font-medium text-sm transition-colors">
                        Explore Path →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
