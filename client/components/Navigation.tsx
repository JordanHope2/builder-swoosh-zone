import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation() {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-sm border-b border-jobequal-neutral-dark sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-2xl font-bold text-jobequal-text tracking-tight">JobEqual</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              <Link
                to="/job-search"
                className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105"
              >
                Browse Jobs
              </Link>
              <Link
                to="/cv-upload"
                className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105"
              >
                Upload CV
              </Link>
              <Link
                to="/companies"
                className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105"
              >
                Companies
              </Link>
              <Link
                to="/about"
                className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105"
              >
                About
              </Link>
            </div>
          </div>

          {/* CTA Buttons & Language Switcher */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link
              to="/signin"
              className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-8 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
