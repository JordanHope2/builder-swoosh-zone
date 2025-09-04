"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const { t } = useLanguage();

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

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
    { href: "/job-search", label: t("nav.browse_jobs") },
    { href: "/companies", label: t("nav.companies") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const dashboardLinks = {
    candidate: "/candidate-dashboard",
    recruiter: "/recruiter-dashboard",
    company: "/company-dashboard",
    admin: "/admin",
  };

  const isActiveLink = (path: string) => pathname === path;

  const handleSecureLogout = () => {
    localStorage.removeItem("auth_token");
    sessionStorage.clear();
    onLogout?.();
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
            ? "bg-white/98 backdrop-blur-md shadow-lg border-b"
            : "bg-white/95 backdrop-blur-sm border-b"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <motion.div className="flex items-center" whileHover={{ scale: 1.02 }}>
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">J+</span>
                </div>
                <span className="text-2xl font-bold text-jobequal-text tracking-tight">JobEqual</span>
              </Link>
            </motion.div>

            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <motion.div key={link.href} whileHover={{ scale: 1.05 }}>
                    <Link
                      href={link.href}
                      className={`relative font-medium transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-jobequal-green after:transition-all after:duration-300 ${
                        isActiveLink(link.href)
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

            <div className="hidden lg:flex items-center space-x-4">
              <NotificationsOverlay />
              <ThemeToggle />
              <LanguageSwitcher />
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                  </motion.button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2"
                      >
                        <div className="px-4 py-3 border-b">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="py-1">
                          <Link href={dashboardLinks[user.role]} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <User className="w-4 h-4 mr-3" />Dashboard
                          </Link>
                          <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                            <Settings className="w-4 h-4 mr-3" />Settings
                          </Link>
                        </div>
                        <div className="border-t py-1">
                          <button onClick={handleSecureLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <LogOut className="w-4 h-4 mr-3" />Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/signin" className="font-medium hover:text-jobequal-green">Sign In</Link>
                  <Link href="/signup" className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold shadow-md">Sign Up</Link>
                </div>
              )}
            </div>
            <div className="lg:hidden flex items-center">
              <motion.button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default Navigation;
