import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Brain,
  TrendingUp,
  Target,
  Users,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface UploadStage {
  id: 'upload' | 'processing' | 'results';
  title: string;
  description: string;
}

const stages: UploadStage[] = [
  {
    id: 'upload',
    title: 'Upload Your CV',
    description: 'Drop your CV here or click to browse'
  },
  {
    id: 'processing',
    title: 'Analyzing Your Profile',
    description: 'Our AI is extracting skills and experience from your CV'
  },
  {
    id: 'results',
    title: 'Your Job Matches',
    description: 'Based on your profile, here are personalized recommendations'
  }
];

interface MatchedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  logo: string;
  skills: string[];
  type: string;
  posted: string;
  featured?: boolean;
}

const mockMatches: MatchedJob[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Zurich',
    location: 'Zurich',
    salary: 'CHF 120,000 - 140,000',
    matchScore: 95,
    logo: '🚀',
    skills: ['React', 'TypeScript', 'Node.js'],
    type: 'Full-time',
    posted: '2 days ago',
    featured: true
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'InnovateCH',
    location: 'Geneva',
    salary: 'CHF 100,000 - 120,000',
    matchScore: 88,
    logo: '💡',
    skills: ['JavaScript', 'Python', 'AWS'],
    type: 'Full-time',
    posted: '1 week ago'
  },
  {
    id: '3',
    title: 'Frontend Engineer',
    company: 'DesignStudio Basel',
    location: 'Basel',
    salary: 'CHF 85,000 - 105,000',
    matchScore: 82,
    logo: '🎨',
    skills: ['React', 'CSS', 'Design Systems'],
    type: 'Full-time',
    posted: '3 days ago'
  }
];

interface CVAnalysis {
  skills: string[];
  experience: string;
  education: string;
  strengths: string[];
  recommendations: string[];
}

const mockAnalysis: CVAnalysis = {
  skills: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'Python', 'AWS', 'CSS', 'Git'],
  experience: '5+ years in Software Development',
  education: 'Bachelor in Computer Science',
  strengths: [
    'Strong frontend development skills',
    'Experience with modern JavaScript frameworks',
    'Full-stack development capabilities',
    'Cloud platform knowledge'
  ],
  recommendations: [
    'Consider roles in fintech companies',
    'Look for senior-level positions',
    'Focus on companies using React/TypeScript',
    'Remote work opportunities available'
  ]
};

function UploadStage({ onFileUpload }: { onFileUpload: (file: File) => void }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8 text-jobequal-green mr-3" />
          <h1 className="text-5xl lg:text-6xl font-bold text-jobequal-text">
            Upload Your CV
          </h1>
          <Sparkles className="w-8 h-8 text-jobequal-green ml-3" />
        </div>
        <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
          Let our AI analyze your skills and experience to find perfect job matches. 
          Experience Swiss precision in career matching.
        </p>
      </div>

      <div
        className={`relative bg-white/90 backdrop-blur-sm rounded-3xl p-16 border-2 border-dashed transition-all duration-300 ${
          isDragOver 
            ? 'border-jobequal-green bg-jobequal-green-light' 
            : 'border-jobequal-neutral-dark hover:border-jobequal-green'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="cv-upload"
        />
        
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center transition-all duration-300 ${
            isDragOver ? 'bg-jobequal-green scale-110' : 'bg-gradient-to-br from-jobequal-green to-jobequal-teal'
          }`}>
            <Upload className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-3xl font-bold text-jobequal-text mb-4">
            Drop your CV here or click to browse
          </h3>
          <p className="text-lg text-jobequal-text-muted mb-8">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>
          
          <div className="bg-jobequal-green-light rounded-2xl p-6 max-w-2xl mx-auto">
            <h4 className="font-bold text-jobequal-green-dark mb-3">What happens next?</h4>
            <ul className="text-left space-y-2 text-jobequal-text-muted">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                <span>AI analyzes your skills and experience</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                <span>Matches you with relevant job opportunities</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                <span>Provides personalized career recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessingStage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <h1 className="text-5xl lg:text-6xl font-bold text-jobequal-text mb-6">
          Analyzing Your Profile
        </h1>
        <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
          Our AI is extracting skills, experience, and qualifications from your CV.
          This will only take a few moments.
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 border border-jobequal-neutral-dark">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-3xl flex items-center justify-center animate-pulse">
          <Brain className="w-12 h-12 text-white" />
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-4 h-4 bg-jobequal-green rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-jobequal-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-jobequal-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <h3 className="text-2xl font-bold text-jobequal-text">Processing your CV...</h3>
          
          <div className="bg-jobequal-green-light rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-jobequal-green" />
                <span className="text-jobequal-text-muted">Extracting skills and technologies</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-jobequal-green" />
                <span className="text-jobequal-text-muted">Analyzing work experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-jobequal-green border-t-transparent rounded-full animate-spin"></div>
                <span className="text-jobequal-text-muted">Finding job matches...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobMatchCard({ job }: { job: MatchedJob }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-3xl">
            {job.logo}
          </div>
          <div>
            {job.featured && (
              <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1 mb-2">
                <Star className="w-3 h-3" />
                <span>Featured</span>
              </div>
            )}
            <h3 className="font-bold text-xl text-jobequal-text group-hover:text-jobequal-green transition-colors">
              {job.title}
            </h3>
            <p className="text-jobequal-text-muted font-medium">{job.company}</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-jobequal-green mb-1">{job.matchScore}%</div>
          <div className="text-sm text-jobequal-text-muted">Match</div>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-jobequal-text-muted">
            <MapPin className="w-4 h-4 mr-2 text-jobequal-green" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-jobequal-text-muted">
            <Clock className="w-4 h-4 mr-2 text-jobequal-blue-dark" />
            <span>{job.type}</span>
          </div>
        </div>
        
        <div className="flex items-center text-jobequal-green font-bold">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span>{job.salary}</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, index) => (
            <span 
              key={index}
              className="bg-jobequal-green-light text-jobequal-green-dark px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <Link
        to={`/job/${job.id}`}
        className="block w-full bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light text-jobequal-green-dark py-3 rounded-2xl font-semibold text-center hover:from-jobequal-green hover:to-jobequal-teal hover:text-white transition-all duration-200 transform hover:scale-105"
      >
        View Details
      </Link>
    </div>
  );
}

function ResultsStage({ analysis, matches }: { analysis: CVAnalysis; matches: MatchedJob[] }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl lg:text-6xl font-bold text-jobequal-text mb-6">
          Perfect Matches Found!
        </h1>
        <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
          Based on your CV analysis, we found {matches.length} highly relevant job opportunities.
          Create an account to save these matches and apply directly.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* CV Analysis */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark sticky top-24">
            <h2 className="text-2xl font-bold text-jobequal-text mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-jobequal-green" />
              Your Profile Analysis
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-jobequal-text mb-3">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-jobequal-green-light text-jobequal-green-dark px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-jobequal-text mb-3">Experience</h3>
                <p className="text-jobequal-text-muted">{analysis.experience}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-jobequal-text mb-3">Education</h3>
                <p className="text-jobequal-text-muted">{analysis.education}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-jobequal-text mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-jobequal-green mt-0.5 flex-shrink-0" />
                      <span className="text-jobequal-text-muted text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Link
              to="/signup"
              className="block w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 rounded-2xl font-semibold text-center hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
            >
              Create Account to Save
            </Link>
          </div>
        </div>

        {/* Job Matches */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-jobequal-text flex items-center">
              <Target className="w-8 h-8 mr-3 text-jobequal-green" />
              Your Job Matches
            </h2>
            <div className="text-jobequal-text-muted">
              Sorted by relevance
            </div>
          </div>
          
          <div className="space-y-6">
            {matches.map((job) => (
              <JobMatchCard key={job.id} job={job} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/job-search"
              className="inline-flex items-center space-x-2 bg-jobequal-green-light text-jobequal-green-dark px-8 py-4 rounded-2xl font-semibold hover:bg-jobequal-green hover:text-white transition-all duration-200"
            >
              <span>See All Jobs</span>
              <Users className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CVUpload() {
  const [currentStage, setCurrentStage] = useState<'upload' | 'processing' | 'results'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStage('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setCurrentStage('results');
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white">
      <Navigation />
      
      <div className="px-6 lg:px-8 py-16 lg:py-24">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStage === stage.id 
                    ? 'bg-jobequal-green text-white scale-110' 
                    : stages.findIndex(s => s.id === currentStage) > index
                    ? 'bg-jobequal-green text-white'
                    : 'bg-jobequal-neutral-dark text-jobequal-text-muted'
                }`}>
                  {stages.findIndex(s => s.id === currentStage) > index ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div className={`h-1 w-24 mx-4 transition-all duration-300 ${
                    stages.findIndex(s => s.id === currentStage) > index 
                      ? 'bg-jobequal-green' 
                      : 'bg-jobequal-neutral-dark'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stage Content */}
        {currentStage === 'upload' && <UploadStage onFileUpload={handleFileUpload} />}
        {currentStage === 'processing' && <ProcessingStage />}
        {currentStage === 'results' && (
          <ResultsStage analysis={mockAnalysis} matches={mockMatches} />
        )}
      </div>
    </main>
  );
}
