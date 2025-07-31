import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from '../components/Navigation';
import { Home, Search, Upload, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="text-8xl lg:text-9xl font-bold text-jobequal-green mb-4">404</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-6">
              Page Not Found
            </h1>
            <p className="text-xl text-jobequal-text-muted max-w-2xl mx-auto leading-relaxed">
              Oops! The page you're looking for seems to have wandered off.
              Let's get you back on track to finding your dream job.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark mb-8">
            <h2 className="text-2xl font-bold text-jobequal-text mb-6">
              What would you like to do?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/"
                className="group flex flex-col items-center p-6 rounded-2xl border border-jobequal-neutral-dark hover:border-jobequal-green hover:bg-jobequal-green-light transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-jobequal-text mb-2">Go Home</h3>
                <p className="text-jobequal-text-muted text-sm text-center">
                  Return to the homepage and explore featured opportunities
                </p>
              </Link>

              <Link
                to="/job-search"
                className="group flex flex-col items-center p-6 rounded-2xl border border-jobequal-neutral-dark hover:border-jobequal-green hover:bg-jobequal-green-light transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-teal rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-jobequal-text mb-2">Search Jobs</h3>
                <p className="text-jobequal-text-muted text-sm text-center">
                  Browse through thousands of job opportunities
                </p>
              </Link>

              <Link
                to="/cv-upload"
                className="group flex flex-col items-center p-6 rounded-2xl border border-jobequal-neutral-dark hover:border-jobequal-green hover:bg-jobequal-green-light transition-all duration-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-jobequal-text mb-2">Upload CV</h3>
                <p className="text-jobequal-text-muted text-sm text-center">
                  Let AI find perfect job matches for you
                </p>
              </Link>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
