import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BarChart3,
} from "lucide-react";
import {
  aiAnalysisService,
  CVAnalysisResult,
} from "../services/aiAnalysisService";
import { useAuth } from "../contexts/AuthContext";
import {
  AnimatedButton,
  EnhancedMotion,
  StaggeredList,
  GradientText,
} from "./ui/enhanced-motion";

interface SimplifiedCVUploadProps {
  onUploadComplete?: (analysisResult: CVAnalysisResult) => void;
  className?: string;
}

export const SimplifiedCVUpload: React.FC<SimplifiedCVUploadProps> = ({
  onUploadComplete,
  className,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setError(null);
    setUploadedFile(file);
    setUploadProgress(0);

    if (!user) {
      setError("Please sign in to upload and analyze your CV");
      return;
    }

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
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
        userId: user.id,
      });

      setAnalysisResult(analysis);
      onUploadComplete?.(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze CV");
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
      setUploadProgress(100);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600";
    if (score >= 60) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <EnhancedMotion
        animation="slideInFromBottom"
        className="text-center mb-8"
      >
        <GradientText className="text-4xl font-bold mb-4">
          AI-Powered CV Analysis
        </GradientText>
        <p className="text-jobequal-text-muted text-lg">
          Upload your CV and get instant AI-powered insights, compatibility
          scores, and improvement recommendations
        </p>
      </EnhancedMotion>

      {/* Upload Area */}
      {!uploadedFile && (
        <EnhancedMotion animation="scaleInBounce" delay={0.2}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
              ${
                isDragOver
                  ? "border-jobequal-green bg-jobequal-green-light scale-105"
                  : "border-gray-300 hover:border-jobequal-green hover:bg-gray-50"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <motion.div
              animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-jobequal-green" />
              <h3 className="text-xl font-semibold text-jobequal-text mb-2">
                {isDragOver ? "Drop your CV here" : "Upload your CV"}
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
                <h3 className="font-semibold text-jobequal-text">
                  {uploadedFile.name}
                </h3>
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
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.5,
                }}
                className="relative w-32 h-32 mx-auto mb-6"
              >
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
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
                      strokeDashoffset: "283",
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
                title: "Skills Match",
                score: analysisResult.skillsMatch.score,
                icon: Target,
                description: `${analysisResult.skillsMatch.matched.length} skills matched`,
              },
              {
                title: "Experience",
                score: analysisResult.experienceAnalysis.score,
                icon: TrendingUp,
                description: `${analysisResult.experienceAnalysis.yearsOfExperience} years total`,
              },
              {
                title: "Education",
                score: analysisResult.educationAnalysis.score,
                icon: Award,
                description: analysisResult.educationAnalysis.degree,
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${getScoreGradient(item.score)}`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-jobequal-text">
                      {item.title}
                    </h3>
                    <p className="text-sm text-jobequal-text-muted">
                      {item.description}
                    </p>
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
                  <span
                    className={`text-lg font-bold ${getScoreColor(item.score)} mt-2 block`}
                  >
                    {item.score}%
                  </span>
                </div>
              </div>
            ))}
          </StaggeredList>

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
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Another CV
            </AnimatedButton>

            <AnimatedButton variant="secondary" onClick={() => window.print()}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </AnimatedButton>

            <AnimatedButton
              variant="accent"
              onClick={() => (window.location.href = "/job-search")}
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

export default SimplifiedCVUpload;
