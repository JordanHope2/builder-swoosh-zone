import { Navigation } from "@components/Navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  Users,
  CreditCard,
  Shield,
  Globe,
  Clock,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

import { useLanguage } from "../contexts/LanguageContext";


export default function TermsOfService() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "acceptance",
  );
  const { t } = useLanguage();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: [
        'By accessing or using JobEqual ("the Platform"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.',
        "These Terms constitute a legally binding agreement between you and JobEqual AG, a company incorporated under Swiss law.",
        "If you do not agree to these Terms, you must not use the Platform.",
        "We may modify these Terms at any time by posting updated terms on the Platform. Your continued use constitutes acceptance of any changes.",
      ],
    },
    {
      id: "services",
      title: "2. Platform Services",
      icon: Users,
      content: [
        "JobEqual provides an online platform connecting job seekers with employers in Switzerland and internationally.",
        "Our services include: AI-powered job matching, CV analysis, salary insights, application tracking, and recruitment tools.",
        "We offer both free and premium services. Premium features require a valid subscription or one-time payment.",
        "Service availability may vary by location and is subject to applicable laws and regulations.",
      ],
    },
    {
      id: "user-accounts",
      title: "3. User Accounts and Responsibilities",
      icon: Users,
      content: [
        "You must create an account to access most Platform features. You are responsible for maintaining account confidentiality.",
        "You must provide accurate, current, and complete information when creating your account.",
        "You are responsible for all activities that occur under your account.",
        "You must notify us immediately of any unauthorized use of your account.",
        "You may not share, sell, or transfer your account to another person or entity.",
      ],
    },
    {
      id: "user-conduct",
      title: "4. Acceptable Use and Prohibited Activities",
      icon: Shield,
      content: [
        "You agree to use the Platform lawfully and in accordance with these Terms.",
        "Prohibited activities include: posting false information, harassment, spam, copyright infringement, unauthorized data scraping.",
        "You may not impersonate others or create multiple accounts to circumvent restrictions.",
        "Commercial use beyond standard job posting and recruiting activities requires our written consent.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
      ],
    },
    {
      id: "content",
      title: "5. User Content and Intellectual Property",
      icon: FileText,
      content: [
        "You retain ownership of content you submit (CV, profile information, job postings).",
        "By posting content, you grant us a license to use, display, and distribute it for Platform operations.",
        "You represent that you have the right to post all content and that it does not infringe third-party rights.",
        "We may remove content that violates these Terms or applicable laws.",
        "The Platform's design, features, and underlying technology are our intellectual property.",
      ],
    },
    {
      id: "payments",
      title: "6. Payment Terms and Billing",
      icon: CreditCard,
      content: [
        "Premium services require payment in advance. All prices are in Swiss Francs (CHF) unless otherwise stated.",
        "Subscription fees are billed automatically on a recurring basis until cancelled.",
        "We accept major credit cards and bank transfers. Payment processing is handled by certified PCI DSS providers.",
        "Refunds are available within 30 days of purchase for annual subscriptions, subject to our refund policy.",
        "Price changes will be communicated 30 days in advance for existing subscribers.",
      ],
    },
    {
      id: "privacy",
      title: "7. Privacy and Data Protection",
      icon: Shield,
      content: [
        "Our collection and use of personal information is governed by our Privacy Policy.",
        "We comply with Swiss Federal Data Protection Act (nFADP) and EU GDPR where applicable.",
        "Your data is stored in Swiss and EU data centers with enterprise-grade security.",
        "You control what profile information is visible to employers and recruiters.",
        "We do not sell personal information to third parties.",
      ],
    },
    {
      id: "disclaimers",
      title: "8. Disclaimers and Limitation of Liability",
      icon: AlertTriangle,
      content: [
        'The Platform is provided "as is" without warranties of any kind, express or implied.',
        "We do not guarantee job placement, interview success, or specific employment outcomes.",
        "We are not responsible for the accuracy of job postings or employer information.",
        "Our liability is limited to the amount paid for our services in the 12 months preceding the claim.",
        "We exclude liability for indirect, consequential, or punitive damages to the maximum extent permitted by law.",
      ],
    },
    {
      id: "termination",
      title: "9. Termination",
      icon: Clock,
      content: [
        "You may terminate your account at any time through your account settings.",
        "We may suspend or terminate accounts for violations of these Terms or applicable laws.",
        "Upon termination, your right to use the Platform ceases immediately.",
        "Data deletion follows our Privacy Policy retention schedules.",
        "Provisions regarding intellectual property, disclaimers, and governing law survive termination.",
      ],
    },
    {
      id: "governing-law",
      title: "10. Governing Law and Dispute Resolution",
      icon: Scale,
      content: [
        "These Terms are governed by Swiss law, excluding conflict of law principles.",
        "Disputes will be resolved through binding arbitration under Swiss Arbitration Rules.",
        "Arbitration proceedings will be conducted in English in Zurich, Switzerland.",
        "Swiss courts in Zurich have exclusive jurisdiction for injunctive relief.",
        "EU residents may also bring claims in their country of residence under EU consumer protection laws.",
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
            <Scale className="w-12 h-12 text-jobequal-green mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white">
              Terms of Service
            </h1>
          </div>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            These terms govern your use of JobEqual's platform and services.
            Please read them carefully to understand your rights and
            obligations.
          </p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-jobequal-text-muted dark:text-gray-400">
            <div className="flex items-center">
              <Globe className="w-4 h-4 text-blue-500 mr-2" />
              Swiss Law
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-green-500 mr-2" />
              Effective: January 1, 2024
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-purple-500 mr-2" />
              Version 2.1
            </div>
          </div>
        </motion.div>

        {/* Key Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light dark:from-jobequal-green/20 dark:to-jobequal-blue/20 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
            Key Points at a Glance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Fair Usage
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                Clear guidelines for respectful platform use
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Data Rights
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                You own your content and control its visibility
              </p>
            </div>
            <div className="text-center">
              <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Transparent Billing
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                No hidden fees, 30-day refund policy
              </p>
            </div>
            <div className="text-center">
              <Scale className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Swiss Law
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                Governed by Swiss legal framework
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
              transition={{ delay: 0.1 + index * 0.03 }}
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
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start text-jobequal-text dark:text-white"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Special Provisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">
                International Users
              </h3>
            </div>
            <div className="space-y-3 text-blue-700 dark:text-blue-300 text-sm">
              <p>
                <strong>EU Residents:</strong> Additional consumer protection
                rights apply under EU law. You may bring claims in your country
                of residence.
              </p>
              <p>
                <strong>Non-Swiss Residents:</strong> Local employment laws may
                affect job applications and recruitment activities in your
                jurisdiction.
              </p>
              <p>
                <strong>Cross-Border Services:</strong> International job
                applications are subject to destination country laws and
                employer requirements.
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                Billing & Refunds
              </h3>
            </div>
            <div className="space-y-3 text-green-700 dark:text-green-300 text-sm">
              <p>
                <strong>Subscription Billing:</strong> Automatic renewal unless
                cancelled. Cancel anytime with immediate effect on next billing
                period.
              </p>
              <p>
                <strong>Refund Policy:</strong> 30-day money-back guarantee for
                annual plans. Partial refunds calculated on pro-rata basis.
              </p>
              <p>
                <strong>Payment Security:</strong> All transactions processed
                through PCI DSS compliant payment processors.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
            Legal Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-4">
                Company Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-jobequal-green mt-1" />
                  <div className="text-jobequal-text dark:text-white">
                    <div className="font-medium">JobEqual AG</div>
                    <div>CHE-123.456.789 (Commercial Registry)</div>
                    <div>Bahnhofstrasse 123</div>
                    <div>8001 Zurich, Switzerland</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-jobequal-green" />
                  <a
                    href="mailto:legal@jobequal.ch"
                    className="text-jobequal-green hover:text-jobequal-green-hover"
                  >
                    legal@jobequal.ch
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-jobequal-green" />
                  <span className="text-jobequal-text dark:text-white">
                    +41 44 123 45 67
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-4">
                Legal Resources
              </h3>
              <div className="space-y-3">
                <a
                  href="/privacy-policy"
                  className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-hover"
                >
                  <FileText className="w-4 h-4" />
                  <span>Privacy Policy</span>
                </a>
                <a
                  href="/cookie-policy"
                  className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-hover"
                >
                  <FileText className="w-4 h-4" />
                  <span>Cookie Policy</span>
                </a>
                <a
                  href="https://www.fedlex.admin.ch/eli/fga/2022/2273/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-hover"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Swiss Data Protection Act</span>
                </a>
                <a
                  href="https://gdpr.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-hover"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GDPR Information</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Amendment Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Updates to These Terms
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                We may update these Terms of Service periodically. Material
                changes will be communicated via email to registered users at
                least 30 days before taking effect. Non-material changes (such
                as clarifications or formatting updates) may be implemented
                immediately. Your continued use of the Platform after changes
                take effect constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
