import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { ResumeScore } from '../components/RealtimeFeedback';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Zap, Target, User, Briefcase, GraduationCap, Award, Eye, X, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ParsedData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: {
    totalYears: number;
    positions: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  languages: string[];
}

const mockParsedData: ParsedData = {
  personalInfo: {
    name: 'Jordan Hope',
    email: 'jordan.hope@email.com',
    phone: '+41 76 123 45 67',
    location: 'Zurich, Switzerland'
  },
  experience: {
    totalYears: 5,
    positions: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp AG',
        duration: '2022 - Present',
        description: 'Led development of React applications, mentored junior developers'
      },
      {
        title: 'Software Engineer',
        company: 'StartupCH',
        duration: '2020 - 2022',
        description: 'Full-stack development using Node.js and React'
      }
    ]
  },
  education: [
    {
      degree: 'Master of Computer Science',
      institution: 'ETH Zurich',
      year: '2020'
    }
  ],
  skills: {
    technical: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL'],
    soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Management']
  },
  languages: ['English (Native)', 'German (B2)', 'French (A2)']
};

const suggestions = [
  { type: 'missing', text: 'Add quantified achievements (e.g., "Increased performance by 40%")', priority: 'high' },
  { type: 'improve', text: 'Include more recent certifications or courses', priority: 'medium' },
  { type: 'optimize', text: 'Add keywords relevant to Swiss tech market', priority: 'high' },
  { type: 'format', text: 'Consider adding a professional summary section', priority: 'medium' }
];

export default function CVUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [resumeScore, setResumeScore] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        setParsedData(mockParsedData);
        
        // Animate score increase
        let currentScore = 0;
        const targetScore = 78;
        const scoreInterval = setInterval(() => {
          currentScore += 2;
          setResumeScore(currentScore);
          if (currentScore >= targetScore) {
            clearInterval(scoreInterval);
          }
        }, 50);
      }, 3000);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateUpload();
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      setUploadedFile(file);
      simulateUpload();
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  if (analysisComplete && parsedData) {
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
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white">
                CV Analysis Complete!
              </h1>
            </div>
            <p className="text-lg text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto">
              We've analyzed your CV with Swiss precision. Here's your detailed breakdown.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Resume Score */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ResumeScore score={resumeScore} />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
              >
                <h3 className="text-lg font-bold text-jobequal-text dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    to="/job-search"
                    className="block w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 text-center"
                  >
                    Find Matching Jobs
                  </Link>
                  <Link
                    to="/swipe"
                    className="block w-full bg-white dark:bg-gray-700 border border-jobequal-green text-jobequal-green dark:text-white py-3 px-4 rounded-xl font-semibold hover:bg-jobequal-green-light dark:hover:bg-gray-600 transition-all duration-200 text-center"
                  >
                    Start Swiping Jobs
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Detailed Analysis */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg overflow-hidden"
              >
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Overview', icon: Eye },
                      { id: 'experience', label: 'Experience', icon: Briefcase },
                      { id: 'skills', label: 'Skills', icon: Zap },
                      { id: 'suggestions', label: 'Suggestions', icon: Target }
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
                <div className="p-6">
                  {activeTab === 'overview' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <h4 className="font-semibold text-jobequal-text dark:text-white mb-3 flex items-center">
                            <User className="w-5 h-5 mr-2 text-jobequal-green" />
                            Personal Information
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Name:</span> {parsedData.personalInfo.name}</p>
                            <p><span className="font-medium">Email:</span> {parsedData.personalInfo.email}</p>
                            <p><span className="font-medium">Phone:</span> {parsedData.personalInfo.phone}</p>
                            <p><span className="font-medium">Location:</span> {parsedData.personalInfo.location}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                          <h4 className="font-semibold text-jobequal-text dark:text-white mb-3 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2 text-jobequal-green" />
                            Career Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="font-medium">Experience:</span> {parsedData.experience.totalYears} years</p>
                            <p><span className="font-medium">Positions:</span> {parsedData.experience.positions.length} roles</p>
                            <p><span className="font-medium">Education:</span> {parsedData.education.length} degree(s)</p>
                            <p><span className="font-medium">Languages:</span> {parsedData.languages.length} languages</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Strengths Identified
                        </h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• Strong technical background with {parsedData.experience.totalYears} years experience</li>
                          <li>• Education from prestigious Swiss institution (ETH Zurich)</li>
                          <li>• Multilingual capabilities valuable in Swiss market</li>
                          <li>• Leadership experience demonstrated</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'experience' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-4">
                        Work Experience
                      </h3>
                      {parsedData.experience.positions.map((position, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-jobequal-text dark:text-white">
                              {position.title}
                            </h4>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {position.duration}
                            </span>
                          </div>
                          <p className="text-jobequal-green font-medium mb-2">{position.company}</p>
                          <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                            {position.description}
                          </p>
                        </div>
                      ))}

                      <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-4 mt-8">
                        Education
                      </h3>
                      {parsedData.education.map((edu, index) => (
                        <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-jobequal-text dark:text-white">
                                {edu.degree}
                              </h4>
                              <p className="text-jobequal-green font-medium">{edu.institution}</p>
                            </div>
                            <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                              {edu.year}
                            </span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'skills' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-4">
                          Technical Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.skills.technical.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-jobequal-green-light dark:bg-jobequal-green/20 text-jobequal-green-dark dark:text-jobequal-green rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-4">
                          Soft Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.skills.soft.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-4">
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.languages.map((language, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'suggestions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-4">
                        Improvement Suggestions
                      </h3>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border-l-4 ${
                            suggestion.priority === 'high'
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Target className="w-4 h-4 mr-2 text-jobequal-green" />
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                  suggestion.priority === 'high'
                                    ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                    : 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                                }`}>
                                  {suggestion.priority.toUpperCase()} PRIORITY
                                </span>
                              </div>
                              <p className="text-sm text-jobequal-text-muted dark:text-gray-300">
                                {suggestion.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                          Want Professional Help?
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                          Our career experts can help optimize your CV for the Swiss job market.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Book CV Review Session
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white mb-6 leading-tight">
            Upload Your CV
          </h1>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let our AI analyze your CV with Swiss precision and provide personalized feedback to boost your job match potential
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-12 border-2 border-dashed border-jobequal-neutral-dark dark:border-gray-600 hover:border-jobequal-green transition-all duration-300 mb-8"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="text-center">
            {!uploadedFile ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
                >
                  <Upload className="w-12 h-12 text-jobequal-green" />
                </motion.div>
                <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4">Drop your CV here</h3>
                <p className="text-jobequal-text-muted dark:text-gray-300 mb-8">or click to browse and select your file</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-block bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-4 rounded-2xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  Choose File
                </button>
                
                <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mt-6">
                  Supported formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </>
            ) : (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg"
                >
                  <FileText className="w-12 h-12 text-white" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-2">{uploadedFile.name}</h3>
                  <p className="text-jobequal-text-muted dark:text-gray-300">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-jobequal-text-muted dark:text-gray-300">Uploading... {uploadProgress}%</p>
                    </motion.div>
                  )}

                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-jobequal-green border-t-transparent rounded-full"
                        />
                        <span className="text-jobequal-green font-semibold">Analyzing your CV with AI...</span>
                      </div>
                      <div className="space-y-2 text-sm text-jobequal-text-muted dark:text-gray-300">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          ✓ Extracting personal information
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                        >
                          ✓ Identifying skills and experience
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.5 }}
                        >
                          ✓ Calculating job match score
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!isUploading && !isAnalyzing && !analysisComplete && (
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-jobequal-text-muted dark:text-gray-400 hover:text-red-500 transition-colors flex items-center mx-auto"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove file
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
