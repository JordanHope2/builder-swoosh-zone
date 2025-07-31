import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="w-full bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-jobequal-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold text-foreground">JobEqual</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                to="/jobs" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Browse Jobs
              </Link>
              <Link 
                to="/companies" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Companies
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-jobequal-green text-white px-6 py-2 rounded-xl hover:bg-jobequal-green-dark transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
