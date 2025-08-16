import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { PageHeader } from '../components/ui/page-header';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { applicationToast } from '../hooks/use-toast';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  FileText,
  Globe,
  Zap,
  Star,
  Target,
  Save,
  Eye,
  Send,
  Plus,
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  department: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  salary: {
    min: number;
    max: number;
    currency: string;
    negotiable: boolean;
  };
  applicationDeadline: string;
  startDate: string;
  featured: boolean;
  urgent: boolean;
}

const initialFormData: JobFormData = {
  title: '',
  company: '',
  location: '',
  remote: false,
  type: 'full-time',
  experience: 'mid',
  department: '',
  description: '',
  requirements: [],
  responsibilities: [],
  benefits: [],
  skills: [],
  salary: {
    min: 0,
    max: 0,
    currency: 'CHF',
    negotiable: false
  },
  applicationDeadline: '',
  startDate: '',
  featured: false,
  urgent: false
};

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (6+ years)' },
  { value: 'executive', label: 'Executive Level' }
];

const departments = [
  'Engineering & Technology',
  'Product Management',
  'Design & UX',
  'Sales & Business Development',
  'Marketing & Communications',
  'Operations & Supply Chain',
  'Finance & Accounting',
  'Human Resources',
  'Legal & Compliance',
  'Customer Success',
  'Data & Analytics',
  'Security & IT'
];

const currencies = ['CHF', 'EUR', 'USD'];

const commonSkills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'Kubernetes',
  'Product Management', 'Agile', 'Scrum', 'Data Analysis', 'Machine Learning',
  'Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping',
  'Sales', 'CRM', 'Lead Generation', 'Account Management', 'Negotiation',
  'Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing',
  'Financial Analysis', 'Excel', 'SAP', 'QuickBooks', 'Budgeting'
];

function PostJobPage() {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const totalSteps = 4;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return updated;
    });
  };

  const addToArray = (field: keyof JobFormData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      const currentArray = formData[field] as string[];
      if (!currentArray.includes(value.trim())) {
        updateFormData(field, [...currentArray, value.trim()]);
        setter('');
      }
    }
  };

  const removeFromArray = (field: keyof JobFormData, index: number) => {
    const currentArray = formData[field] as string[];
    updateFormData(field, currentArray.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.company && formData.location && formData.department);
      case 2:
        return !!(formData.description && formData.requirements.length > 0 && formData.responsibilities.length > 0);
      case 3:
        return !!(formData.salary.min > 0 && formData.salary.max > 0 && formData.skills.length > 0);
      case 4:
        return !!(formData.applicationDeadline && formData.startDate);
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      applicationToast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      applicationToast.success(
        'Job posted successfully!',
        'Your job listing is now live and candidates can apply.'
      );
      
      // Reset form
      setFormData(initialFormData);
      setCurrentStep(1);
    } catch (error) {
      applicationToast.error('Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-jobequal-text mb-6">Basic Job Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Job Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Company *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => updateFormData('company', e.target.value)}
            placeholder="Your company name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData('location', e.target.value)}
            placeholder="e.g. Zurich, Switzerland"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Department *</label>
          <div className="relative">
            <select
              value={formData.department}
              onChange={(e) => updateFormData('department', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent appearance-none"
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Job Type</label>
          <div className="relative">
            <select
              value={formData.type}
              onChange={(e) => updateFormData('type', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent appearance-none"
            >
              {jobTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Experience Level</label>
          <div className="relative">
            <select
              value={formData.experience}
              onChange={(e) => updateFormData('experience', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent appearance-none"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.remote}
            onChange={(e) => updateFormData('remote', e.target.checked)}
            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
          />
          <span className="text-sm font-medium text-jobequal-text">Remote work available</span>
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-jobequal-text mb-6">Job Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-jobequal-text mb-2">Job Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-jobequal-text mb-2">Requirements *</label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="Add a requirement"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addToArray('requirements', newRequirement, setNewRequirement)}
            />
            <button
              type="button"
              onClick={() => addToArray('requirements', newRequirement, setNewRequirement)}
              className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm">{req}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('requirements', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-jobequal-text mb-2">Responsibilities *</label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              placeholder="Add a responsibility"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addToArray('responsibilities', newResponsibility, setNewResponsibility)}
            />
            <button
              type="button"
              onClick={() => addToArray('responsibilities', newResponsibility, setNewResponsibility)}
              className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm">{resp}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('responsibilities', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-jobequal-text mb-2">Benefits & Perks</label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="Add a benefit or perk"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addToArray('benefits', newBenefit, setNewBenefit)}
            />
            <button
              type="button"
              onClick={() => addToArray('benefits', newBenefit, setNewBenefit)}
              className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm">{benefit}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('benefits', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-jobequal-text mb-6">Compensation & Skills</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Currency</label>
          <div className="relative">
            <select
              value={formData.salary.currency}
              onChange={(e) => updateFormData('salary.currency', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent appearance-none"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Minimum Salary *</label>
          <input
            type="number"
            value={formData.salary.min || ''}
            onChange={(e) => updateFormData('salary.min', parseInt(e.target.value) || 0)}
            placeholder="80000"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Maximum Salary *</label>
          <input
            type="number"
            value={formData.salary.max || ''}
            onChange={(e) => updateFormData('salary.max', parseInt(e.target.value) || 0)}
            placeholder="120000"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.salary.negotiable}
            onChange={(e) => updateFormData('salary.negotiable', e.target.checked)}
            className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
          />
          <span className="text-sm font-medium text-jobequal-text">Salary is negotiable</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-jobequal-text mb-2">Required Skills *</label>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addToArray('skills', newSkill, setNewSkill)}
            />
            <button
              type="button"
              onClick={() => addToArray('skills', newSkill, setNewSkill)}
              className="px-4 py-2 bg-jobequal-green text-white rounded-lg hover:bg-jobequal-green-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick add popular skills:</p>
            <div className="flex flex-wrap gap-2">
              {commonSkills.slice(0, 12).map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addToArray('skills', skill, setNewSkill)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-jobequal-green-light hover:text-jobequal-green transition-colors"
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between bg-jobequal-green-light px-3 py-2 rounded-lg">
                <span className="text-sm text-jobequal-green font-medium">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('skills', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-jobequal-text mb-6">Timeline & Options</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Application Deadline *</label>
          <input
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => updateFormData('applicationDeadline', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-jobequal-text mb-2">Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => updateFormData('featured', e.target.checked)}
              className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
            />
            <span className="text-sm font-medium text-jobequal-text">Featured listing (+CHF 100)</span>
          </label>
          <p className="text-xs text-gray-600 ml-7">Get 3x more visibility with highlighted placement</p>
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.urgent}
              onChange={(e) => updateFormData('urgent', e.target.checked)}
              className="w-4 h-4 text-jobequal-green border-gray-300 rounded focus:ring-jobequal-green"
            />
            <span className="text-sm font-medium text-jobequal-text">Urgent hiring (+CHF 50)</span>
          </label>
          <p className="text-xs text-gray-600 ml-7">Mark as urgent to attract immediate attention</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h4 className="font-semibold text-jobequal-text mb-4">Job Posting Summary</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Position:</span> {formData.title}
          </div>
          <div>
            <span className="font-medium">Location:</span> {formData.location}
          </div>
          <div>
            <span className="font-medium">Salary:</span> {formData.salary.currency} {formData.salary.min?.toLocaleString()} - {formData.salary.max?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Skills:</span> {formData.skills.length} required
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Talent Acquisition"
            title="Post Your Job Opening"
            description="Reach qualified candidates across Switzerland. Post your job and connect with top talent looking for their next opportunity."
          />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-20">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? 'bg-jobequal-green text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-jobequal-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!validateStep(currentStep)}
                className="flex items-center space-x-2 px-6 py-3 bg-jobequal-green text-white rounded-xl font-medium hover:bg-jobequal-green-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep) || isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Post Job</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PostJob() {
  return (
    <ProtectedRoute>
      <PostJobPage />
    </ProtectedRoute>
  );
}
