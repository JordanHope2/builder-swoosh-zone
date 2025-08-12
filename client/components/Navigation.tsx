import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeProvider';
import { NotificationSystem } from './NotificationSystem';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: '/job-search', label: t('nav.browse_jobs') },
    { to: '/swipe', label: t('nav.swipe_discovery') },
    { to: '/cv-upload', label: t('nav.upload_cv') },
    { to: '/companies', label: t('nav.companies') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-jobequal-neutral-dark' 
          : 'bg-white/90 backdrop-blur-sm border-b border-jobequal-neutral-dark'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 lg:space-x-3 group">
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-lg lg:text-xl">J</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-red-600 rounded-full flex items-center justify-center border border-white shadow-sm">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                <span className="text-xl lg:text-2xl font-bold text-jobequal-text tracking-tight">JobEqual</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative text-sm xl:text-base font-medium transition-all duration-200 hover:scale-105 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-jobequal-green after:transition-all after:duration-300 ${
                      isActiveLink(link.to)
                        ? 'text-jobequal-green after:w-full'
                        : 'text-jobequal-text-muted hover:text-jobequal-text after:w-0 hover:after:w-full'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop CTA Buttons & Controls */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <NotificationSystem />
              <ThemeToggle />
              <LanguageSwitcher />
              <Link
                to="/role-switcher"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-xs xl:text-sm"
              >
                🔄 Role Switch
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105 text-sm xl:text-base"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm xl:text-base"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105 text-sm xl:text-base"
                  >
                    {t('nav.sign_in')}
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm xl:text-base"
                  >
                    {t('nav.sign_up')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <NotificationSystem />
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-jobequal-text hover:text-jobequal-green transition-colors duration-200 p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Mobile Menu Panel */}
        <div className={`absolute top-16 right-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl transition-all duration-300 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 space-y-6">
            {/* Navigation Links */}
            <div className="space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block py-3 px-4 rounded-xl font-medium transition-all duration-200 animate-slide-in-right ${
                    isActiveLink(link.to)
                      ? 'bg-jobequal-green-light text-jobequal-green border-l-4 border-jobequal-green'
                      : 'text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile CTA Buttons */}
            <div className="pt-6 border-t border-jobequal-neutral-dark space-y-3">
              <Link
                to="/role-switcher"
                className="block w-full text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                🔄 Role Switcher
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block w-full text-center py-3 px-4 rounded-xl font-medium text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-center bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="block w-full text-center py-3 px-4 rounded-xl font-medium text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral transition-all duration-200"
                  >
                    {t('nav.sign_in')}
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {t('nav.sign_up')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
