import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';

type UserType = 'candidate' | 'recruiter';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'candidate' as UserType,
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in submitted:', formData);
    // In real app, handle sign in logic here
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Welcome Content */}
          <div className="order-2 lg:order-1">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-jobequal-text mb-6 leading-tight">
                Welcome Back to
                <span className="text-jobequal-green block lg:inline lg:ml-4">JobEqual</span>
              </h1>
              <p className="text-xl lg:text-2xl text-jobequal-text-muted mb-12 leading-relaxed">
                Continue your journey to find the perfect job match or discover exceptional talent.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-jobequal-text mb-2">Secure & Private</h3>
                    <p className="text-jobequal-text-muted">
                      Your data is protected with Swiss-grade security standards
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-jobequal-text mb-2">Instant Matching</h3>
                    <p className="text-jobequal-text-muted">
                      AI-powered job matching that understands your aspirations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-jobequal-text mb-2">
                  Sign In
                </h2>
                <p className="text-jobequal-text-muted">
                  Access your JobEqual account
                </p>
              </div>

              {/* User Type Toggle */}
              <div className="flex bg-jobequal-neutral rounded-2xl p-2 mb-8">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, userType: 'candidate'})}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    formData.userType === 'candidate'
                      ? 'bg-white text-jobequal-green shadow-md'
                      : 'text-jobequal-text-muted hover:text-jobequal-text'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, userType: 'recruiter'})}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    formData.userType === 'recruiter'
                      ? 'bg-white text-jobequal-green shadow-md'
                      : 'text-jobequal-text-muted hover:text-jobequal-text'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Recruiter</span>
                </button>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-4 mb-8">
                <button className="w-full flex items-center justify-center space-x-3 py-4 px-6 border border-jobequal-neutral-dark rounded-xl hover:bg-jobequal-neutral transition-all duration-200">
                  <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">f</div>
                  <span className="font-semibold text-jobequal-text">Continue with LinkedIn</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-3 py-4 px-6 border border-jobequal-neutral-dark rounded-xl hover:bg-jobequal-neutral transition-all duration-200">
                  <div className="w-5 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">G</div>
                  <span className="font-semibold text-jobequal-text">Continue with Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-jobequal-neutral-dark"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-jobequal-text-muted">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      className="w-5 h-5 text-jobequal-green border-jobequal-neutral-dark rounded focus:ring-jobequal-green"
                    />
                    <span className="text-jobequal-text-muted">Remember me</span>
                  </label>
                  
                  <Link 
                    to="/forgot-password"
                    className="text-jobequal-green hover:text-jobequal-green-dark transition-colors font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="text-center pt-6 border-t border-jobequal-neutral-dark">
                  <p className="text-jobequal-text-muted">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup"
                      className="text-jobequal-green hover:text-jobequal-green-dark transition-colors font-semibold"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16 max-w-4xl mx-auto">
          <p className="text-jobequal-text-muted text-lg mb-8">
            Trusted by professionals at top Swiss companies
          </p>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-jobequal-text-muted">UBS</div>
            <div className="text-2xl font-bold text-jobequal-text-muted">Nestlé</div>
            <div className="text-2xl font-bold text-jobequal-text-muted">Roche</div>
            <div className="text-2xl font-bold text-jobequal-text-muted">ABB</div>
          </div>
        </div>
      </div>
    </main>
  );
}
