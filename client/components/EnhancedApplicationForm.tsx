import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  FileText, 
  Link as LinkIcon, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Loader,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { applicationService, ApplicationData } from '../services/applicationService';
import { AnimatedButton, EnhancedMotion, StaggeredList } from './ui/enhanced-motion';

interface EnhancedApplicationFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onApplicationSubmitted?: (success: boolean) => void;
  onClose?: () => void;
}

interface FormData {
  coverLetter: string;
  portfolioUrl: string;
  expectedSalary: string;
  availabilityDate: string;
  customAnswers: Record<string, string>;
  personalInfo: {
    phone: string;
    linkedinUrl: string;
    portfolioUrl: string;
    availability: string;
  };
}

const customQuestions = [
  {
    id: 'motivation',
    question: 'What motivates you to apply for this position?',
    placeholder: 'Share what excites you about this opportunity...',
    required: true
  },
  {
    id: 'experience',
    question: 'Describe your most relevant experience for this role.',
    placeholder: 'Highlight your key achievements and relevant skills...',
    required: true
  },
  {
    id: 'goals',
    question: 'What are your career goals for the next 3 years?',
    placeholder: 'Tell us about your professional aspirations...',
    required: false
  }
];

export const EnhancedApplicationForm: React.FC<EnhancedApplicationFormProps> = ({
  jobId,
  jobTitle,
  companyName,
  onApplicationSubmitted,
  onClose
}) => {
  const [formData, setFormData] = useState<FormData>({
    coverLetter: '',
    portfolioUrl: '',
    expectedSalary: '',
    availabilityDate: '',
    customAnswers: {},
    personalInfo: {
      phone: '',
      linkedinUrl: '',
      portfolioUrl: '',
      availability: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<any>(null);

  const { user } = useAuth();

  useEffect(() => {
    // Load user profile data if available
    if (user) {
      setUserProfile({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        linkedinUrl: user.user_metadata?.linkedin_url || ''
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('customAnswers.')) {
      const questionId = field.replace('customAnswers.', '');
      setFormData(prev => ({
        ...prev,
        customAnswers: {
          ...prev.customAnswers,
          [questionId]: value
        }
      }));
    } else if (field.startsWith('personalInfo.')) {
      const infoField = field.replace('personalInfo.', '');
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [infoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.coverLetter.trim()) {
      setSubmitStatus({ type: 'error', message: 'Cover letter is required' });
      return false;
    }

    // Check required custom questions
    const requiredQuestions = customQuestions.filter(q => q.required);
    for (const question of requiredQuestions) {
      if (!formData.customAnswers[question.id]?.trim()) {
        setSubmitStatus({ type: 'error', message: `Please answer: ${question.question}` });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setSubmitStatus({ type: 'error', message: 'Please sign in to submit application' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const applicationData: ApplicationData = {
        jobId,
        candidateId: user.id,
        coverLetter: formData.coverLetter,
        portfolioUrl: formData.portfolioUrl || formData.personalInfo.portfolioUrl,
        expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary) : undefined,
        availabilityDate: formData.availabilityDate,
        customAnswers: formData.customAnswers
      };

      const result = await applicationService.submitApplication(applicationData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! You will receive a confirmation email shortly.'
        });
        
        onApplicationSubmitted?.(true);
        
        // Auto-close after success
        setTimeout(() => {
          onClose?.();
        }, 3000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Failed to submit application'
        });
        onApplicationSubmitted?.(false);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit application'
      });
      onApplicationSubmitted?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <ApplicationDetailsStep />;
      case 3:
        return <ReviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  const PersonalInfoStep = () => (
    <StaggeredList className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-jobequal-text mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-jobequal-green" />
          Personal Information
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-jobequal-text mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo.phone', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                placeholder="+41 79 123 4567"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-jobequal-text mb-2">
              LinkedIn Profile
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={formData.personalInfo.linkedinUrl}
                onChange={(e) => handleInputChange('personalInfo.linkedinUrl', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </div>
      </div>
    </StaggeredList>
  );

  const ApplicationDetailsStep = () => (
    <StaggeredList className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-jobequal-text mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-jobequal-green" />
          Application Details
        </h3>
        
        {/* Cover Letter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-jobequal-text mb-2">
            Cover Letter *
          </label>
          <textarea
            value={formData.coverLetter}
            onChange={(e) => handleInputChange('coverLetter', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
            placeholder={`Dear ${companyName} Team,\n\nI am writing to express my interest in the ${jobTitle} position...`}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.coverLetter.length}/500 characters
          </p>
        </div>

        {/* Portfolio URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-jobequal-text mb-2">
            Portfolio/Website URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>

        {/* Expected Salary */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-jobequal-text mb-2">
              Expected Salary (CHF/year)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={formData.expectedSalary}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                placeholder="120000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-jobequal-text mb-2">
              Available Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={formData.availabilityDate}
                onChange={(e) => handleInputChange('availabilityDate', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Questions */}
      <div>
        <h4 className="text-lg font-semibold text-jobequal-text mb-4">Additional Questions</h4>
        {customQuestions.map((question, index) => (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-jobequal-text mb-2">
              {question.question} {question.required && '*'}
            </label>
            <textarea
              value={formData.customAnswers[question.id] || ''}
              onChange={(e) => handleInputChange(`customAnswers.${question.id}`, e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
              placeholder={question.placeholder}
              required={question.required}
            />
          </div>
        ))}
      </div>
    </StaggeredList>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-jobequal-text mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-jobequal-green" />
        Review Your Application
      </h3>
      
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-semibold text-jobequal-text mb-4">Application Summary</h4>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Position:</span>
            <span className="font-medium">{jobTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Company:</span>
            <span className="font-medium">{companyName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Expected Salary:</span>
            <span className="font-medium">
              {formData.expectedSalary ? `CHF ${parseInt(formData.expectedSalary).toLocaleString()}` : 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Start Date:</span>
            <span className="font-medium">
              {formData.availabilityDate || 'Flexible'}
            </span>
          </div>
        </div>
      </div>

      {submitStatus.type && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center space-x-3 ${
            submitStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className={submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {submitStatus.message}
          </span>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Apply for {jobTitle}</h2>
              <p className="text-white/90">at {companyName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6 flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full ${
                  step <= currentStep ? 'bg-white' : 'bg-white/30'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mt-2 text-white/80">
            <span>Personal Info</span>
            <span>Application</span>
            <span>Review</span>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </form>

        {/* Footer */}
        <div className="border-t p-6 flex justify-between items-center">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <div className="flex space-x-3">
            {currentStep < 3 ? (
              <AnimatedButton
                variant="primary"
                onClick={nextStep}
              >
                Next
              </AnimatedButton>
            ) : (
              <AnimatedButton
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || submitStatus.type === 'success'}
                loading={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </AnimatedButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedApplicationForm;
