import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, Settings, User, LogOut, Shield } from "lucide-react";
import { LanguageSwitcher } from "@components/LanguageSwitcher";
import { ThemeToggle } from "@components/ThemeProvider";
import { NotificationsOverlay } from "@components/NotificationsOverlay";
import { useLanguage } from "@/contexts/LanguageContext";
import SecurityUtils from "@/lib/security";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "candidate" | "recruiter" | "company" | "admin";
  avatar?: string;
}

interface NavigationProps {
  user?: UserProfile;
  onLogout?: () => void;
}

export function Navigation({
  user,
  onLogout,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Handle scroll effect with throttling for performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: "/job-search", label: t("nav.browse_jobs"), public: true },
    { to: "/swipe", label: t("nav.swipe_discovery"), public: true },
    { to: "/cv-upload", label: t("nav.upload_cv"), public: true },
    { to: "/companies", label: t("nav.companies"), public: true },
    { to: "/about", label: t("nav.about"), public: true },
    { to: "/contact", label: t("nav.contact"), public: true },
  ];

  const dashboardLinks = {
    candidate: "/dashboard",
    recruiter: "/enhanced-recruiter-dashboard",
    company: "/company-dashboard",
    admin: "/owner-admin-dashboard",
  };

  const isActiveLink = (path: string) => location.pathname === path;

  const handleSecureLogout = () => {
    // Clear any stored tokens/session data
    localStorage.removeItem("auth_token");
    sessionStorage.clear();

    // Call logout handler
    onLogout?.();

    // Redirect to home
    window.location.href = "/";
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      candidate: "Job Seeker",
      recruiter: "Recruiter",
      company: "Company",
      admin: "Administrator",
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/98 backdrop-blur-md shadow-lg border-b border-jobequal-neutral-dark"
            : "bg-white/95 backdrop-blur-sm border-b border-jobequal-neutral-dark"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <Link
                to="/"
                className="flex items-center space-x-2 lg:space-x-3 group"
              >
                <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-lg lg:text-xl">
                    J
                  </span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-red-600 rounded-full flex items-center justify-center border border-white shadow-sm">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                <span className="text-xl lg:text-2xl font-bold text-jobequal-text tracking-tight">
                  JobEqual
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <motion.div key={link.to} whileHover={{ scale: 1.05 }}>
                    <Link
                      to={link.to}
                      className={`relative text-sm xl:text-base font-medium transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-jobequal-green after:transition-all after:duration-300 ${
                        isActiveLink(link.to)
                          ? "text-jobequal-green after:w-full"
                          : "text-jobequal-text-muted hover:text-jobequal-text after:w-0 hover:after:w-full"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <NotificationsOverlay />
              <ThemeToggle />
              <LanguageSwitcher />

              {/* Role Switcher */}
              <motion.div whileHover={{ scale: 1.02 }}>
                <Link
                  to="/role-switcher"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200 text-xs xl:text-sm"
                >
                  🔄 Role Switch
                </Link>
              </motion.div>

              {user ? (
                // User Profile Dropdown
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {SecurityUtils.sanitizeText(
                          user.name.charAt(0).toUpperCase(),
                        )}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-jobequal-text dark:text-white">
                        {SecurityUtils.sanitizeText(user.name)}
                      </div>
                      <div className="text-xs text-jobequal-text-muted dark:text-gray-400">
                        {getRoleDisplayName(user.role)}
                      </div>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-jobequal-neutral-dark dark:border-gray-600 py-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="font-medium text-jobequal-text dark:text-white">
                            {SecurityUtils.sanitizeText(user.name)}
                          </div>
                          <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                            {SecurityUtils.sanitizeText(user.email)}
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to={dashboardLinks[user.role]}
                            className="flex items-center px-4 py-2 text-sm text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Dashboard
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </Link>
                          {user.role === "admin" && (
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Shield className="w-4 h-4 mr-3" />
                              Admin Panel
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                          <button
                            onClick={handleSecureLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Auth Buttons
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="text-jobequal-text-muted hover:text-jobequal-text font-medium transition-all duration-200 hover:scale-105 text-sm xl:text-base"
                  >
                    {t("nav.sign_in")}
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 text-sm xl:text-base"
                    >
                      {t("nav.sign_up")}
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-3">
              <NotificationsOverlay />
              <ThemeToggle />
              <LanguageSwitcher />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-jobequal-text hover:text-jobequal-green transition-colors duration-200 p-2"
                aria-label="Toggle mobile menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-16 right-0 bottom-0 w-80 max-w-[90vw] bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* User Profile Section */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pb-6 border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {SecurityUtils.sanitizeText(
                            user.name.charAt(0).toUpperCase(),
                          )}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-jobequal-text dark:text-white">
                          {SecurityUtils.sanitizeText(user.name)}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {getRoleDisplayName(user.role)}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={dashboardLinks[user.role]}
                      className="block w-full text-center bg-jobequal-green text-white py-2 rounded-lg font-medium hover:bg-jobequal-green-hover transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  </motion.div>
                )}

                {/* Navigation Links */}
                <div className="space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.to}
                        className={`block py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          isActiveLink(link.to)
                            ? "bg-jobequal-green-light text-jobequal-green border-l-4 border-jobequal-green"
                            : "text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral dark:hover:bg-gray-700"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA Buttons */}
                <div className="pt-6 border-t border-jobequal-neutral-dark space-y-3">
                  <Link
                    to="/role-switcher"
                    className="block w-full text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    🔄 Role Switcher
                  </Link>

                  {user ? (
                    <button
                      onClick={handleSecureLogout}
                      className="block w-full text-center py-3 px-4 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        className="block w-full text-center py-3 px-4 rounded-xl font-medium text-jobequal-text-muted hover:text-jobequal-text hover:bg-jobequal-neutral dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        {t("nav.sign_in")}
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full text-center bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {t("nav.sign_up")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
