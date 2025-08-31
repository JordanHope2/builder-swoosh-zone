import { Navigation } from "@components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  Briefcase,
  Shield,
  Zap,
  MapPin,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

import { useLanguage } from "../contexts/LanguageContext";


interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "1",
    question: "How do I create an account on JobEqual?",
    answer:
      'Creating an account is simple! Click "Sign Up" on our homepage, enter your email, create a password, and complete the onboarding wizard. You can also sign up using your LinkedIn account for faster registration. The entire process takes less than 5 minutes.',
    category: "getting-started",
  },
  {
    id: "2",
    question: "Is JobEqual free to use for job seekers?",
    answer:
      "Yes! Job seekers can use JobEqual completely free, including creating profiles, browsing jobs, applying to positions, and receiving basic job matches. We also offer premium services like detailed CV reviews, advanced analytics, and priority support for enhanced job searching.",
    category: "getting-started",
  },
  {
    id: "3",
    question: "How does the AI job matching work?",
    answer:
      "Our AI analyzes your profile, skills, experience, and preferences to match you with relevant opportunities. It considers factors like location, salary expectations, company culture, and career goals. The more complete your profile, the better our matches become.",
    category: "getting-started",
  },

  // Swiss Employment
  {
    id: "4",
    question: "Do I need a work permit to work in Switzerland?",
    answer:
      "EU/EFTA citizens can work in Switzerland without a permit but must register with authorities within 8 days. Non-EU citizens need a work permit sponsored by an employer. The process varies by canton and profession. We recommend consulting the State Secretariat for Migration (SEM) for specific requirements.",
    category: "swiss-employment",
  },
  {
    id: "5",
    question: "What are typical Swiss salary expectations?",
    answer:
      "Swiss salaries are among the highest globally but vary by industry and location. Technology roles in Zurich typically range from CHF 85,000-180,000+ annually. Use our Salary Guide for detailed breakdowns by role, location, and experience level. Remember to consider the high cost of living.",
    category: "swiss-employment",
  },
  {
    id: "6",
    question: "How important are language skills for jobs in Switzerland?",
    answer:
      "Language requirements vary by role and location. German is most common, followed by French and Italian. Many international companies operate in English. For client-facing roles, local language skills are often essential. Our platform allows filtering by language requirements.",
    category: "swiss-employment",
  },
  {
    id: "7",
    question: "What is the standard notice period in Switzerland?",
    answer:
      "During probation (1-3 months), notice is typically 7 days. After probation, it's usually 1 month during the first year, then 2-3 months. Senior positions may have longer notice periods. Always check your specific contract as terms can vary.",
    category: "swiss-employment",
  },

  // Job Applications
  {
    id: "8",
    question: "How should I format my CV for Swiss employers?",
    answer:
      "Swiss CVs typically include a professional photo, are 2-3 pages long, and follow a chronological format. Include personal details, education, work experience, languages, and skills. Our CV review service provides personalized feedback for Swiss market optimization.",
    category: "applications",
  },
  {
    id: "9",
    question: "Should I include a cover letter with my application?",
    answer:
      "Yes, cover letters are highly valued in Switzerland. Keep it to one page, personalize it for each application, and highlight why you're interested in the specific company and role. Our AI assistant can help you craft compelling cover letters.",
    category: "applications",
  },
  {
    id: "10",
    question: "How long does the typical hiring process take in Switzerland?",
    answer:
      "The Swiss hiring process typically takes 4-8 weeks. It usually includes: application review (1-2 weeks), initial interview (phone/video), on-site interviews (may include multiple rounds), reference checks, and offer negotiation. Some companies may have longer processes.",
    category: "applications",
  },

  // Platform Features
  {
    id: "11",
    question: "How do I improve my job match score?",
    answer:
      "Complete your profile thoroughly, keep your skills updated, add relevant work experience, specify your preferences clearly, and regularly update your availability. Our AI learns from your activity and improves matches over time.",
    category: "platform",
  },
  {
    id: "12",
    question: "Can I control who sees my profile?",
    answer:
      "Absolutely! You have full control over your profile visibility. You can set it to public, private, or visible only to specific employers. You can also hide your profile from your current employer and control what information is shared.",
    category: "platform",
  },
  {
    id: "13",
    question: "How do I book a CV review session?",
    answer:
      "Visit our CV Review page, select your preferred time slot, choose from standard, premium, or video consultation options, and complete the booking form. You'll receive confirmation with meeting details and a secure upload link for your CV.",
    category: "platform",
  },

  // For Employers
  {
    id: "14",
    question: "How much does it cost to post a job?",
    answer:
      "We offer flexible pricing: CHF 300 for a 30-day standard listing, or subscription plans starting at CHF 200/month for multiple postings. Premium features include AI screening and candidate sourcing. Contact sales for enterprise pricing.",
    category: "employers",
  },
  {
    id: "15",
    question: "How does candidate screening work?",
    answer:
      "Our AI pre-screens candidates based on your requirements, providing match scores and highlighting relevant skills. You receive a ranked list of candidates with detailed profiles, making it easier to identify the best fits for your role.",
    category: "employers",
  },
  {
    id: "16",
    question: "Can I integrate JobEqual with our ATS?",
    answer:
      "Yes! We offer API integrations with popular ATS platforms like Greenhouse, Workday, and BambooHR. Custom integrations are available for enterprise clients. Contact our technical team for integration support.",
    category: "employers",
  },

  // Technical Support
  {
    id: "17",
    question: "I forgot my password. How do I reset it?",
    answer:
      "Click \"Forgot Password\" on the login page, enter your email address, and we'll send you a secure reset link. If you don't receive the email within 5 minutes, check your spam folder or contact support.",
    category: "technical",
  },
  {
    id: "18",
    question: "Is my data secure on JobEqual?",
    answer:
      "Yes! We use enterprise-grade security including AES-256 encryption, multi-factor authentication, and Swiss data centers. We're GDPR and Swiss Data Protection Act compliant. Your data is never sold to third parties.",
    category: "technical",
  },
  {
    id: "19",
    question: "Can I delete my account and data?",
    answer:
      "Yes, you can delete your account anytime through account settings. This removes all personal data within 30 days, though some anonymized analytics may be retained. Contact privacy@jobequal.ch for data deletion requests.",
    category: "technical",
  },
];

const categories = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "getting-started", label: "Getting Started", icon: Users },
  { id: "swiss-employment", label: "Swiss Employment", icon: MapPin },
  { id: "applications", label: "Job Applications", icon: Briefcase },
  { id: "platform", label: "Platform Features", icon: Zap },
  { id: "employers", label: "For Employers", icon: Star },
  { id: "technical", label: "Technical Support", icon: Shield },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-jobequal-green mr-4" />
            <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white">
              Frequently Asked Questions
            </h1>
          </div>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about JobEqual, Swiss employment,
            and our platform features. Can't find what you're looking for?
            Contact our support team.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-jobequal-neutral-dark dark:border-gray-600 rounded-2xl text-jobequal-text dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-jobequal-green focus:border-transparent shadow-lg"
          />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? "bg-jobequal-green text-white shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 text-jobequal-text dark:text-white border border-jobequal-neutral-dark dark:border-gray-600 hover:bg-jobequal-green-light dark:hover:bg-jobequal-green/20"
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm">{category.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <p className="text-jobequal-text-muted dark:text-gray-400">
            Showing {filteredFAQs.length}{" "}
            {filteredFAQs.length === 1 ? "question" : "questions"}
            {searchQuery && ` for "${searchQuery}"`}
            {activeCategory !== "all" &&
              ` in ${categories.find((c) => c.id === activeCategory)?.label}`}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-jobequal-text dark:text-white pr-4">
                      {item.question}
                    </h3>
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-jobequal-text-muted dark:text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedItems.has(item.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-6"
                    >
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <p className="text-jobequal-text dark:text-white leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <HelpCircle className="w-16 h-16 text-jobequal-text-muted dark:text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-jobequal-text dark:text-white mb-2">
              No questions found
            </h3>
            <p className="text-jobequal-text-muted dark:text-gray-400 mb-6">
              Try adjusting your search or browse a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="bg-jobequal-green hover:bg-jobequal-green-hover text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Show All Questions
            </button>
          </motion.div>
        )}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-jobequal-green-light to-jobequal-blue-light dark:from-jobequal-green/20 dark:to-jobequal-blue/20 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-jobequal-text-muted dark:text-gray-400 max-w-2xl mx-auto">
              Our support team is here to help! Get in touch and we'll respond
              within 24 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageCircle className="w-8 h-8 text-jobequal-green" />
              </div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Live Chat
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">
                Chat with our support team in real-time
              </p>
              <button className="bg-jobequal-green hover:bg-jobequal-green-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Start Chat
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Email Support
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">
                Send us a detailed message
              </p>
              <a
                href="mailto:support@jobequal.ch"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Email Us
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                Phone Support
              </h3>
              <p className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">
                Call us during business hours
              </p>
              <a
                href="tel:+41441234567"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                +41 44 123 45 67
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-jobequal-text-muted dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Mon-Fri: 9:00-18:00 CET
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Average response: 2 hours
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
