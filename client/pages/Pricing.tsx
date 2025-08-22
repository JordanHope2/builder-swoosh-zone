import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Users,
  Briefcase,
  BarChart3,
  Shield,
  Clock,
  DollarSign,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Globe,
  HeadphonesIcon,
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  popular?: boolean;
  category: "job_seekers" | "employers" | "enterprise";
  features: {
    included: string[];
    excluded?: string[];
  };
  cta: string;
  badge?: string;
}

const jobSeekerPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free Explorer",
    description: "Perfect for getting started with your Swiss job search",
    price: 0,
    period: "month",
    category: "job_seekers",
    features: {
      included: [
        "Basic job search and filtering",
        "Apply to unlimited positions",
        "Basic AI job matching",
        "Profile creation and management",
        "Email job alerts (weekly)",
        "Access to salary guide",
        "Community forum access",
      ],
      excluded: [
        "Advanced AI matching",
        "CV review sessions",
        "Priority support",
        "Analytics dashboard",
      ],
    },
    cta: "Get Started Free",
  },
  {
    id: "premium",
    name: "Career Accelerator",
    description: "Advanced tools for serious job seekers",
    price: 29,
    period: "month",
    popular: true,
    category: "job_seekers",
    features: {
      included: [
        "Everything in Free",
        "Advanced AI job matching",
        "Daily personalized job alerts",
        "CV analysis and optimization tips",
        "1 Professional CV review session",
        "Interview preparation resources",
        "Salary negotiation guide",
        "Priority customer support",
        "Application tracking dashboard",
        "Company culture insights",
      ],
    },
    cta: "Start 7-Day Free Trial",
    badge: "Most Popular",
  },
  {
    id: "executive",
    name: "Executive Plus",
    description: "Premium service for senior professionals",
    price: 99,
    period: "month",
    category: "job_seekers",
    features: {
      included: [
        "Everything in Career Accelerator",
        "Dedicated career coach",
        "Monthly strategy sessions",
        "Executive search access",
        "LinkedIn profile optimization",
        "Personal branding consultation",
        "Network introduction service",
        "Confidential job search",
        "White-glove application service",
        "Salary benchmarking report",
      ],
    },
    cta: "Contact Sales",
    badge: "Premium",
  },
];

const employerPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Startup Package",
    description: "Essential recruiting tools for growing companies",
    price: 200,
    period: "month",
    category: "employers",
    features: {
      included: [
        "5 active job postings",
        "Basic applicant tracking",
        "AI candidate screening",
        "Email support",
        "Candidate database access",
        "Basic analytics",
        "Standard job board distribution",
      ],
    },
    cta: "Start Free Trial",
  },
  {
    id: "professional",
    name: "Growth Suite",
    description: "Comprehensive hiring solution for established companies",
    price: 500,
    period: "month",
    popular: true,
    category: "employers",
    features: {
      included: [
        "Unlimited job postings",
        "Advanced applicant tracking",
        "AI-powered candidate sourcing",
        "Video interview scheduling",
        "Advanced analytics dashboard",
        "Priority job placement",
        "Dedicated account manager",
        "Custom branding",
        "API integrations",
        "Phone and email support",
      ],
    },
    cta: "Get Started",
    badge: "Recommended",
  },
  {
    id: "enterprise",
    name: "Enterprise Solution",
    description: "Full-scale recruitment platform for large organizations",
    price: 0, // Custom pricing
    period: "custom",
    category: "employers",
    features: {
      included: [
        "Everything in Growth Suite",
        "Custom integrations",
        "White-label platform",
        "Dedicated success team",
        "SLA guarantees",
        "Advanced security features",
        "Custom reporting",
        "Multi-location management",
        "Volume pricing discounts",
        "24/7 priority support",
      ],
    },
    cta: "Contact Sales",
  },
];

const oneTimeServices = [
  {
    name: "CV Review Session",
    description: "Professional CV review and optimization",
    price: 149,
    duration: "45 minutes",
    features: [
      "Swiss market optimization",
      "ATS compatibility check",
      "Written feedback report",
      "Industry-specific recommendations",
    ],
  },
  {
    name: "Premium CV + Interview Prep",
    description: "Complete career preparation package",
    price: 299,
    duration: "90 minutes",
    features: [
      "Everything in CV Review",
      "Mock interview session",
      "Interview strategy guide",
      "Follow-up consultation",
    ],
  },
  {
    name: "Single Job Posting",
    description: "One-time job posting with AI screening",
    price: 300,
    duration: "30 days",
    features: [
      "30-day job listing",
      "AI candidate screening",
      "Applicant management",
      "Basic analytics",
    ],
  },
];

export default function Pricing() {
  const [activeCategory, setActiveCategory] = useState<
    "job_seekers" | "employers" | "services"
  >("job_seekers");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const { t } = useLanguage();

  const categories = [
    { id: "job_seekers" as const, label: "Job Seekers", icon: Users },
    { id: "employers" as const, label: "Employers", icon: Briefcase },
    { id: "services" as const, label: "One-Time Services", icon: Target },
  ];

  const getDisplayPrice = (price: number) => {
    if (price === 0) return "Free";
    const adjustedPrice =
      billingPeriod === "yearly" ? Math.floor(price * 0.83) : price; // 17% discount for yearly
    return `CHF ${adjustedPrice}`;
  };

  const getYearlyDiscount = (price: number) => {
    if (price === 0) return 0;
    return Math.floor(price * 12 * 0.17); // 17% annual discount
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white mb-4">
            Transparent Pricing for Everyone
          </h1>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            No hidden fees, no surprises. Choose the plan that fits your needs
            and budget. Start free and upgrade anytime.
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-jobequal-green text-white shadow-lg"
                    : "text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Billing Period Toggle (for job seekers and employers) */}
        {(activeCategory === "job_seekers" ||
          activeCategory === "employers") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-1 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    billingPeriod === "monthly"
                      ? "bg-jobequal-green text-white"
                      : "text-jobequal-text dark:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
                    billingPeriod === "yearly"
                      ? "bg-jobequal-green text-white"
                      : "text-jobequal-text dark:text-white"
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Job Seekers Plans */}
        {activeCategory === "job_seekers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {jobSeekerPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 shadow-lg ${
                  plan.popular
                    ? "border-jobequal-green shadow-2xl scale-105"
                    : "border-jobequal-neutral-dark dark:border-gray-600"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-jobequal-green text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-jobequal-text-muted dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-jobequal-text dark:text-white">
                      {getDisplayPrice(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-jobequal-text-muted dark:text-gray-400">
                        /{billingPeriod === "yearly" ? "year" : plan.period}
                      </span>
                    )}
                  </div>
                  {billingPeriod === "yearly" && plan.price > 0 && (
                    <p className="text-green-600 text-sm font-medium">
                      Save CHF {getYearlyDiscount(plan.price)} per year
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.included.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-jobequal-text dark:text-white text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.features.excluded?.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 opacity-50"
                    >
                      <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400 text-sm line-through">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-jobequal-green hover:bg-jobequal-green-hover text-white"
                      : "border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Employer Plans */}
        {activeCategory === "employers" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {employerPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 shadow-lg ${
                  plan.popular
                    ? "border-jobequal-green shadow-2xl scale-105"
                    : "border-jobequal-neutral-dark dark:border-gray-600"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-jobequal-green text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-jobequal-text-muted dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-jobequal-text dark:text-white">
                      {plan.period === "custom"
                        ? "Custom"
                        : getDisplayPrice(plan.price)}
                    </span>
                    {plan.period !== "custom" && (
                      <span className="text-jobequal-text-muted dark:text-gray-400">
                        /{billingPeriod === "yearly" ? "year" : plan.period}
                      </span>
                    )}
                  </div>
                  {billingPeriod === "yearly" &&
                    plan.price > 0 &&
                    plan.period !== "custom" && (
                      <p className="text-green-600 text-sm font-medium">
                        Save CHF {getYearlyDiscount(plan.price)} per year
                      </p>
                    )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.included.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-jobequal-text dark:text-white text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? "bg-jobequal-green hover:bg-jobequal-green-hover text-white"
                      : "border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* One-Time Services */}
        {activeCategory === "services" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {oneTimeServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-jobequal-text-muted dark:text-gray-400 mb-4">
                    {service.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-jobequal-text dark:text-white">
                      CHF {service.price}
                    </span>
                    <p className="text-jobequal-text-muted dark:text-gray-400 text-sm mt-1">
                      {service.duration}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-jobequal-text dark:text-white text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-jobequal-green hover:bg-jobequal-green-hover text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200">
                  Book Now
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-12"
        >
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                  Yes, you can cancel your subscription at any time. Your access
                  continues until the end of your billing period.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                  We offer a 30-day money-back guarantee for annual
                  subscriptions and a 7-day free trial for premium plans.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  Are there any hidden fees?
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                  No hidden fees, ever. All prices are transparent and include
                  VAT where applicable.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  How does the free trial work?
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                  Start with a 7-day free trial of our premium features. No
                  credit card required. Upgrade anytime.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                  We accept all major credit cards, bank transfers, and PayPal.
                  Enterprise clients can pay via invoice.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-jobequal-text dark:text-white mb-2">
                  Need a custom solution?
                </h3>
                <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                  Contact our sales team for custom pricing and enterprise
                  solutions tailored to your needs.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Sales CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-lg mb-6 opacity-90">
            Large organization? Special requirements? Let's create a plan that
            works for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sales@jobequal.ch"
              className="bg-white text-jobequal-green px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Sales Team
            </a>
            <a
              href="tel:+41441234567"
              className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call +41 44 123 45 67
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
