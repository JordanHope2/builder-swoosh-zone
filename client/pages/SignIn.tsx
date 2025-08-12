import { EnhancedSignIn } from '../components/EnhancedSignIn';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Shield,
  Mountain,
  CheckCircle
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeProvider';

const benefits = [
  {
    icon: Shield,
    title: 'Swiss Privacy',
    description: 'Your data protected with Swiss banking-level security'
  },
  {
    icon: Mountain,
    title: 'Premium Quality',
    description: 'Curated opportunities from Switzerland\'s finest companies'
  },
  {
    icon: CheckCircle,
    title: 'AI Matching',
    description: 'Advanced algorithms find your perfect career match'
  }
];

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center mb-6"
            >
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
                <span className="text-3xl font-bold text-jobequal-text dark:text-white tracking-tight">JobEqual</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-jobequal-text-muted dark:text-gray-300">
                Sign in to continue your career journey
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-jobequal-text dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-jobequal-green focus:ring-jobequal-green border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-jobequal-text-muted dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-jobequal-green hover:text-jobequal-green-hover transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-white bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jobequal-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Sign in</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-jobequal-text-muted dark:text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                to="/signup"
                className="font-medium text-jobequal-green hover:text-jobequal-green-hover transition-colors"
              >
                Create your account →
              </Link>
            </div>
          </motion.form>
        </motion.div>
      </div>

      {/* Right Side - Benefits & Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-jobequal-green/10 via-jobequal-teal/10 to-jobequal-blue/10 dark:from-jobequal-green/5 dark:via-jobequal-teal/5 dark:to-jobequal-blue/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-jobequal-green rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-jobequal-teal rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-jobequal-green mr-3 animate-pulse" />
              <span className="text-jobequal-text-muted dark:text-gray-400 font-medium tracking-wide uppercase">
                Swiss Excellence
              </span>
            </div>
            <h3 className="text-4xl font-bold text-jobequal-text dark:text-white mb-4 leading-tight">
              Your Career Journey
              <br />
              <span className="bg-gradient-to-r from-jobequal-green to-jobequal-teal bg-clip-text text-transparent">
                Starts Here
              </span>
            </h3>
            <p className="text-lg text-jobequal-text-muted dark:text-gray-300 leading-relaxed">
              Join thousands of professionals who found their dream careers through our Swiss-quality platform.
            </p>
          </motion.div>

          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <benefit.icon className="w-6 h-6 text-jobequal-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-jobequal-text dark:text-white mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-jobequal-text-muted dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
