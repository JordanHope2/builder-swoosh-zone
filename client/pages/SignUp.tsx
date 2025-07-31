import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { 
  User, 
  Building, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Upload,
  Globe,
  Users,
  Briefcase
} from 'lucide-react';

type UserType = 'candidate' | 'recruiter';

interface FormData {
  userType: UserType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Candidate specific
  phone?: string;
  linkedIn?: string;
  // Recruiter specific
  company?: string;
  jobTitle?: string;
  companySize?: string;
  website?: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    userType: 'candidate',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up submitted:', formData);
    // In real app, handle sign up logic here
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.firstName && formData.lastName && formData.email && 
             formData.password && formData.confirmPassword && 
             formData.password === formData.confirmPassword;
    }
    if (currentStep === 2 && formData.userType === 'recruiter') {
      return formData.company && formData.jobTitle;
    }
    return true;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-4">
            Join JobEqual
          </h1>
          <p className="text-xl text-jobequal-text-muted">
            Create your account and start your journey to career success
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark max-w-2xl mx-auto">
          {/* User Type Selection */}
          {currentStep === 1 && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-jobequal-text mb-6 text-center">
                  I want to sign up as a:
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => updateFormData('userType', 'candidate')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      formData.userType === 'candidate'
                        ? 'border-jobequal-green bg-jobequal-green-light'
                        : 'border-jobequal-neutral-dark hover:border-jobequal-green'
                    }`}
                  >
                    <User className={`w-12 h-12 mx-auto mb-4 ${
                      formData.userType === 'candidate' ? 'text-jobequal-green' : 'text-jobequal-text-muted'
                    }`} />
                    <h3 className="font-bold text-lg text-jobequal-text mb-2">Job Seeker</h3>
                    <p className="text-jobequal-text-muted text-sm">
                      Find your dream job and connect with top employers
                    </p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => updateFormData('userType', 'recruiter')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                      formData.userType === 'recruiter'
                        ? 'border-jobequal-green bg-jobequal-green-light'
                        : 'border-jobequal-neutral-dark hover:border-jobequal-green'
                    }`}
                  >
                    <Building className={`w-12 h-12 mx-auto mb-4 ${
                      formData.userType === 'recruiter' ? 'text-jobequal-green' : 'text-jobequal-text-muted'
                    }`} />
                    <h3 className="font-bold text-lg text-jobequal-text mb-2">Recruiter</h3>
                    <p className="text-jobequal-text-muted text-sm">
                      Post jobs and find the best talent for your company
                    </p>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="Your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted hover:text-jobequal-green"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-jobequal-text-muted hover:text-jobequal-green"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
                    )}
                  </div>
                </div>

                {formData.userType === 'candidate' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-jobequal-text font-semibold mb-3">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        placeholder="+41 XX XXX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-jobequal-text font-semibold mb-3">LinkedIn (Optional)</label>
                      <input
                        type="url"
                        value={formData.linkedIn || ''}
                        onChange={(e) => updateFormData('linkedIn', e.target.value)}
                        className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6">
                  <Link 
                    to="/login"
                    className="text-jobequal-text-muted hover:text-jobequal-green transition-colors"
                  >
                    Already have an account? Sign in
                  </Link>
                  
                  {formData.userType === 'recruiter' ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStepValid()}
                      className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isStepValid()}
                      className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Account
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          {/* Recruiter Step 2 - Company Information */}
          {currentStep === 2 && formData.userType === 'recruiter' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-jobequal-text mb-2 text-center">
                  Company Information
                </h2>
                <p className="text-jobequal-text-muted text-center">
                  Tell us about your company to complete your recruiter profile
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                    <input
                      type="text"
                      value={formData.company || ''}
                      onChange={(e) => updateFormData('company', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="Your company name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Your Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                    <input
                      type="text"
                      value={formData.jobTitle || ''}
                      onChange={(e) => updateFormData('jobTitle', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="e.g., HR Manager, Talent Acquisition"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Company Size</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                      <select
                        value={formData.companySize || ''}
                        onChange={(e) => updateFormData('companySize', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Website (Optional)</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                      <input
                        type="url"
                        value={formData.website || ''}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                        placeholder="https://yourcompany.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-jobequal-text-muted hover:text-jobequal-green transition-colors font-semibold"
                  >
                    ← Back to Personal Info
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!isStepValid()}
                    className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg text-jobequal-text mb-2">Swiss Quality</h3>
            <p className="text-jobequal-text-muted">
              Experience precision and excellence in every job match
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg text-jobequal-text mb-2">Trusted Network</h3>
            <p className="text-jobequal-text-muted">
              Connect with top companies and professionals across Switzerland
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg text-jobequal-text mb-2">AI-Powered</h3>
            <p className="text-jobequal-text-muted">
              Smart matching technology that understands your aspirations
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
