import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Brain,
  Target,
  TrendingUp,
  Star,
  Download,
  Eye,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';
import { aiAnalysisService, CVAnalysisResult } from '../services/aiAnalysisService';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedButton, EnhancedMotion, StaggeredList, GradientText } from './ui/enhanced-motion';

interface EnhancedCVUploadProps {
  onUploadComplete?: (analysisResult: CVAnalysisResult) => void;
  className?: string;
}

export const EnhancedCVUpload: React.FC<EnhancedCVUploadProps> = ({
  onUploadComplete,
  className
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const processFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setError(null);
    setUploadedFile(file);
    setUploadProgress(0);

    // Allow analysis for both authenticated and non-authenticated users
    // Use a guest user ID if not authenticated
    const userId = user?.id || 'guest-user';

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      setIsAnalyzing(true);

      // Read file content
      const fileContent = await readFileContent(file);

      // Perform AI analysis
      const analysis = await aiAnalysisService.analyzeCVWithAI({
        fileName: file.name,
        fileContent,
        fileType: file.type,
        userId: userId
      });

      setAnalysisResult(analysis);
      onUploadComplete?.(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze CV');
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      setUploadProgress(100);
    }
  }, [user, onUploadComplete]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <EnhancedMotion animation="slideInFromBottom" className="text-center mb-8">
        <GradientText className="text-4xl font-bold mb-4">
          AI-Powered CV Analysis
        </GradientText>
        <p className="text-jobequal-text-muted text-lg">
          Upload your CV and get instant AI-powered insights, compatibility scores, and improvement recommendations
        </p>
      </EnhancedMotion>

      {/* Upload Area */}
      {!uploadedFile && (
        <EnhancedMotion animation="scaleInBounce" delay={0.2}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
              relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center
              ${isDragActive
                ? 'border-jobequal-green bg-jobequal-green-light'
                : 'border-gray-300 hover:border-jobequal-green hover:bg-gray-50 focus-within:border-jobequal-green focus-within:ring-2 focus-within:ring-jobequal-green focus-within:ring-offset-2'
              }
            `}
            role="button"
            tabIndex={0}
            aria-label="Click to upload CV or drag and drop file here"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileSelect}
              className="hidden"
            />
            <motion.div
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-jobequal-green" />
              <h3 className="text-xl font-semibold text-jobequal-text mb-2">
                {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
              </h3>
              <p className="text-jobequal-text-muted mb-4">
                Drag and drop your CV or click to browse
              </p>
              <p className="text-sm text-jobequal-text-muted">
                Supports PDF, DOC, DOCX, TXT (max 10MB)
              </p>
            </motion.div>
          </div>
        </EnhancedMotion>
      )}

      {/* Upload Progress */}
      {uploadedFile && uploadProgress < 100 && (
        <EnhancedMotion animation="slideInFromBottom" className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-4 mb-4">
              <FileText className="w-8 h-8 text-jobequal-green" />
              <div>
                <h3 className="font-semibold text-jobequal-text">{uploadedFile.name}</h3>
                <p className="text-sm text-jobequal-text-muted">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-jobequal-green to-jobequal-teal"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-jobequal-text-muted mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
        </EnhancedMotion>
      )}

      {/* AI Analysis Loading */}
      {isAnalyzing && (
        <EnhancedMotion animation="scaleInBounce" className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <Brain className="w-full h-full text-jobequal-green" />
          </motion.div>
          <h3 className="text-xl font-semibold text-jobequal-text mb-2">
            AI is analyzing your CV...
          </h3>
          <p className="text-jobequal-text-muted">
            This will take just a moment
          </p>
        </EnhancedMotion>
      )}

      {/* Error Display */}
      {error && (
        <EnhancedMotion animation="slideInFromBottom" className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Upload Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </EnhancedMotion>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-8"
        >
          {/* Overall Score */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
                className="relative w-32 h-32 mx-auto mb-6"
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    className={`${getScoreColor(analysisResult.overallScore)}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: analysisResult.overallScore / 100 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    style={{
                      strokeDasharray: "283",
                      strokeDashoffset: "283"
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-jobequal-text">
                    {analysisResult.overallScore}
                  </span>
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-jobequal-text mb-2">
                Overall CV Score
              </h2>
              <p className="text-jobequal-text-muted">
                Your CV has been analyzed and scored based on multiple factors
              </p>
            </div>
          </div>

          {/* Detailed Scores */}
          <StaggeredList className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Skills Match',
                score: analysisResult.skillsMatch.score,
                icon: Target,
                description: `${analysisResult.skillsMatch.matched.length} skills matched`
              },
              {
                title: 'Experience',
                score: analysisResult.experienceAnalysis.score,
                icon: TrendingUp,
                description: `${analysisResult.experienceAnalysis.yearsOfExperience} years total`
              },
              {
                title: 'Education',
                score: analysisResult.educationAnalysis.score,
                icon: Award,
                description: analysisResult.educationAnalysis.degree
              }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getScoreGradient(item.score)}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-jobequal-text">{item.title}</h3>
                    <p className="text-sm text-jobequal-text-muted">{item.description}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(item.score)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(item.score)} mt-2 block`}>
                    {item.score}%
                  </span>
                </div>
              </div>
            ))}
          </StaggeredList>

          {/* Job Compatibility */}
          {analysisResult.compatibilityWithJobs.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-jobequal-text mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-jobequal-green" />
                Job Compatibility
              </h3>
              <StaggeredList className="space-y-4">
                {analysisResult.compatibilityWithJobs.map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-jobequal-text">{job.jobTitle}</h4>
                      <p className="text-sm text-jobequal-text-muted">
                        {job.reasons.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${getScoreColor(job.compatibilityScore)}`}>
                        {job.compatibilityScore}%
                      </span>
                      <p className="text-sm text-jobequal-text-muted">Match</p>
                    </div>
                  </div>
                ))}
              </StaggeredList>
            </div>
          )}

          {/* Recommendations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-jobequal-text mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysisResult.strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-jobequal-text">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-jobequal-text mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Improvement Areas
              </h3>
              <ul className="space-y-2">
                {analysisResult.improvementAreas.map((area, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-jobequal-text">{area}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light rounded-3xl p-8">
            <h3 className="text-xl font-bold text-jobequal-text mb-6">
              Personalized Recommendations
            </h3>
            <StaggeredList className="space-y-3">
              {analysisResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl">
                  <div className="w-6 h-6 bg-jobequal-green rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-jobequal-text">{recommendation}</p>
                </div>
              ))}
            </StaggeredList>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <AnimatedButton
              variant="primary"
              onClick={() => {
                setUploadedFile(null);
                setAnalysisResult(null);
                setUploadProgress(0);
                setError(null);
              }}
              className="min-h-[44px] px-6 py-3"
              aria-label="Upload a new CV"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Another CV
            </AnimatedButton>
            
            <AnimatedButton
              variant="secondary"
              onClick={() => window.print()}
              className="min-h-[44px] px-6 py-3"
              aria-label="Download analysis report as PDF"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </AnimatedButton>
            
            <AnimatedButton
              variant="accent"
              onClick={() => window.location.href = '/job-search'}
              className="min-h-[44px] px-6 py-3"
              aria-label="Browse matching jobs based on your CV"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Matching Jobs
            </AnimatedButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedCVUpload;
