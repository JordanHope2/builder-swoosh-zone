import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Shield,
  Lock,
  Eye,
  Users,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function PrivacyPolicy() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { t } = useLanguage();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "data-collection",
      title: "Data Collection and Processing",
      icon: FileText,
      content: [
        {
          subtitle: "Personal Information We Collect",
          details: [
            "Name, email address, phone number, and professional title",
            "CV/Resume content including work experience, education, and skills",
            "LinkedIn profile information (when connected)",
            "Location and salary expectations",
            "Communication preferences and language settings",
          ],
        },
        {
          subtitle: "Technical Information",
          details: [
            "IP address, browser type, and device information",
            "Usage patterns and interaction data on our platform",
            "Cookies and tracking technologies (see Cookie Policy)",
            "Search queries and job application history",
          ],
        },
        {
          subtitle: "Legal Basis for Processing (GDPR Article 6)",
          details: [
            "Consent: Job applications, newsletter subscriptions, marketing communications",
            "Contract Performance: Account management, job matching services",
            "Legitimate Interest: Platform improvement, fraud prevention, analytics",
            "Legal Obligation: Tax reporting, regulatory compliance",
          ],
        },
      ],
    },
    {
      id: "data-usage",
      title: "How We Use Your Data",
      icon: Users,
      content: [
        {
          subtitle: "Primary Services",
          details: [
            "AI-powered job matching and recommendations",
            "CV analysis and skill assessment",
            "Communication with potential employers",
            "Account management and customer support",
            "Platform personalization and user experience optimization",
          ],
        },
        {
          subtitle: "Secondary Uses",
          details: [
            "Market research and salary benchmarking (anonymized)",
            "Platform analytics and performance monitoring",
            "Fraud prevention and security measures",
            "Compliance with Swiss and EU legal requirements",
          ],
        },
      ],
    },
    {
      id: "data-sharing",
      title: "Data Sharing and Disclosure",
      icon: Globe,
      content: [
        {
          subtitle: "Employers and Recruiters",
          details: [
            "Profile information shared only with explicit consent",
            "CV sharing requires direct job application action",
            "Contact details shared only for interview coordination",
            "Right to withdraw consent at any time",
          ],
        },
        {
          subtitle: "Service Providers",
          details: [
            "Cloud hosting services (AWS/Azure in EU regions)",
            "Email service providers for communications",
            "Analytics tools for platform improvement",
            "AI processing services for matching algorithms",
            "All providers bound by strict data processing agreements",
          ],
        },
        {
          subtitle: "Legal Requirements",
          details: [
            "Swiss Federal Data Protection Act (nFADP) compliance",
            "EU GDPR compliance for EU residents",
            "Court orders or legal process requirements",
            "Tax and regulatory reporting obligations",
          ],
        },
      ],
    },
    {
      id: "data-security",
      title: "Data Security and Protection",
      icon: Lock,
      content: [
        {
          subtitle: "Technical Safeguards",
          details: [
            "End-to-end encryption for data transmission (TLS 1.3)",
            "AES-256 encryption for data at rest",
            "Multi-factor authentication for admin access",
            "Regular security audits and penetration testing",
            "ISO 27001 compliant data centers in Switzerland",
          ],
        },
        {
          subtitle: "Organizational Measures",
          details: [
            "Employee data protection training and certification",
            "Principle of least privilege access controls",
            "Regular backup and disaster recovery procedures",
            "Incident response plan with 72-hour breach notification",
            "Data Protection Officer (DPO) oversight",
          ],
        },
      ],
    },
    {
      id: "user-rights",
      title: "Your Rights and Controls",
      icon: Shield,
      content: [
        {
          subtitle: "GDPR and Swiss Data Protection Rights",
          details: [
            "Right to Access: Request a copy of your personal data",
            "Right to Rectification: Correct inaccurate information",
            "Right to Erasure: Delete your account and data",
            "Right to Portability: Export your data in machine-readable format",
            "Right to Restrict Processing: Limit how we use your data",
            "Right to Object: Opt-out of marketing and profiling",
          ],
        },
        {
          subtitle: "How to Exercise Your Rights",
          details: [
            "Account settings for most privacy controls",
            "Email privacy@jobequal.ch for formal requests",
            "Response within 30 days (GDPR requirement)",
            "Identity verification required for security",
            "No cost for reasonable requests",
          ],
        },
      ],
    },
    {
      id: "retention",
      title: "Data Retention and Deletion",
      icon: Clock,
      content: [
        {
          subtitle: "Retention Periods",
          details: [
            "Active accounts: Data retained while account is active",
            "Inactive accounts: Automatic deletion after 3 years of inactivity",
            "Job applications: Retained for 2 years unless withdrawn",
            "Communication records: 7 years for legal compliance",
            "Technical logs: 1 year for security and debugging",
          ],
        },
        {
          subtitle: "Deletion Process",
          details: [
            "Immediate removal from production systems",
            "Backup deletion within 90 days",
            "Legal holds may delay deletion",
            "Anonymization for research purposes",
            "Confirmation provided upon completion",
          ],
        },
      ],
    },
    {
      id: "international",
      title: "International Data Transfers",
      icon: Globe,
      content: [
        {
          subtitle: "Data Localization",
          details: [
            "Primary data storage in Swiss and EU data centers",
            "AI processing may occur in adequacy countries",
            "No transfer to countries without adequate protection",
            "Standard Contractual Clauses (SCCs) where required",
          ],
        },
        {
          subtitle: "Cross-Border Job Applications",
          details: [
            "Explicit consent required for international employers",
            "Clear notification of destination country",
            "Additional protections for sensitive destinations",
            "Right to withdraw consent affecting transfer",
          ],
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: Eye,
      content: [
        {
          subtitle: "Cookie Categories",
          details: [
            "Essential: Required for platform functionality",
            "Analytics: Usage statistics and performance monitoring",
            "Personalization: Job recommendations and user preferences",
            "Marketing: Advertising and conversion tracking (opt-in only)",
          ],
        },
        {
          subtitle: "Your Cookie Choices",
          details: [
            "Cookie consent banner on first visit",
            "Granular controls in privacy settings",
            "Browser settings to block cookies",
            "Third-party opt-out tools and services",
          ],
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-jobequal-green mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white">
              Privacy Policy
            </h1>
          </div>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is our priority. This policy explains how JobEqual
            collects, uses, and protects your personal information in compliance
            with Swiss and EU data protection laws.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-jobequal-text-muted dark:text-gray-400">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              GDPR Compliant
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Swiss nFADP
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-blue-500 mr-2" />
              Last Updated: January 2024
            </div>
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light dark:from-jobequal-green/20 dark:to-jobequal-blue/20 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
            Privacy at a Glance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="w-8 h-8 text-jobequal-green mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Data Protection
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                Enterprise-grade security with Swiss banking standards
              </p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Your Control
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                Full control over what data is shared with whom
              </p>
            </div>
            <div className="text-center">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Swiss Storage
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                Data stored in Swiss and EU data centers only
              </p>
            </div>
            <div className="text-center">
              <Eye className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Transparency
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                Clear visibility into how your data is used
              </p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-jobequal-green-light dark:bg-jobequal-green/20 rounded-xl flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-jobequal-green" />
                    </div>
                    <h2 className="text-xl font-bold text-jobequal-text dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="w-5 h-5 text-jobequal-text-muted dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-jobequal-text-muted dark:text-gray-400" />
                  )}
                </div>
              </button>

              {expandedSection === section.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pb-6"
                >
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                      >
                        <h3 className="font-semibold text-jobequal-text dark:text-white mb-3">
                          {item.subtitle}
                        </h3>
                        <ul className="space-y-2">
                          {item.details.map((detail, detailIndex) => (
                            <li
                              key={detailIndex}
                              className="flex items-start text-sm text-jobequal-text-muted dark:text-gray-400"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
            Contact Our Data Protection Officer
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-4">
                For Privacy-Related Inquiries
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-jobequal-green" />
                  <a
                    href="mailto:privacy@jobequal.ch"
                    className="text-jobequal-green hover:text-jobequal-green-hover"
                  >
                    privacy@jobequal.ch
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-jobequal-green" />
                  <span className="text-jobequal-text dark:text-white">
                    +41 44 123 45 67
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-jobequal-green mt-1" />
                  <div className="text-jobequal-text dark:text-white">
                    <div>JobEqual AG</div>
                    <div>Data Protection Officer</div>
                    <div>Bahnhofstrasse 123</div>
                    <div>8001 Zurich, Switzerland</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-4">
                Regulatory Authorities
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Swiss Federal Data Protection and Information Commissioner
                  (FDPIC)
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  For residents of Switzerland
                </p>
                <a
                  href="https://www.edoeb.admin.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  www.edoeb.admin.ch
                </a>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mt-4">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  EU Data Protection Authorities
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  For EU residents
                </p>
                <a
                  href="https://edpb.europa.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  European Data Protection Board
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Updates Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Policy Updates
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                We may update this privacy policy to reflect changes in our
                practices or legal requirements. Material changes will be
                communicated via email and prominently displayed on our
                platform. Your continued use of JobEqual after such changes
                indicates acceptance of the updated policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
