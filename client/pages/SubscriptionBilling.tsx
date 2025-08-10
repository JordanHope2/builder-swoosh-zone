import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Package, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Receipt,
  Zap,
  Crown,
  Building,
  Users,
  TrendingUp,
  Star,
  Shield,
  Globe,
  Headphones,
  FileText,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  CreditCard as CardIcon,
<<<<<<< HEAD
  
=======
  Wallet as PaymentMethod,
>>>>>>> e0028992b1c60b73edbdc5c07fbcd0e8ba9bad83
  Banknote,
  Wallet,
  Calculator,
  BarChart3,
  PieChart,
  Target,
  Briefcase
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  DashboardContainer,
  StatsCard,
  SectionHeader,
  ActionButton,
  DashboardCard,
  LoadingSpinner,
  fadeInUp,
  slideInLeft
} from '../components/ui/unified-dashboard';
import SecurityUtils from '../lib/security';

interface PricingPlan {
  id: string;
  name: string;
  type: 'candidate' | 'recruiter' | 'company';
  price: number;
  currency: string;
  billing: 'monthly' | 'yearly';
  features: string[];
  limits: {
    jobPosts?: number;
    candidateViews?: number;
    users?: number;
    storage?: string;
    support?: string;
  };
  popular?: boolean;
  enterprise?: boolean;
}

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  priceId: string;
  amount: number;
  currency: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  date: string;
  dueDate: string;
  pdfUrl: string;
  description: string;
}

const pricingPlans: PricingPlan[] = [
  // Candidate Plans
  {
    id: 'candidate-free',
    name: 'JobSeeker Free',
    type: 'candidate',
    price: 0,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      '5 job applications per month',
      'Basic profile',
      'Job search & filtering',
      'Email notifications',
      'Mobile app access'
    ],
    limits: {
      candidateViews: 50,
      storage: '100MB',
      support: 'Community'
    }
  },
  {
    id: 'candidate-premium',
    name: 'JobSeeker Premium',
    type: 'candidate',
    price: 19,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      'Unlimited job applications',
      'Premium profile with video intro',
      'Advanced job matching AI',
      'Priority in search results',
      'CV review service',
      'Interview coaching',
      'Salary insights',
      'Direct messaging with recruiters'
    ],
    limits: {
      candidateViews: -1,
      storage: '5GB',
      support: 'Email & Chat'
    },
    popular: true
  },
  // Recruiter Plans
  {
    id: 'recruiter-starter',
    name: 'Recruiter Starter',
    type: 'recruiter',
    price: 89,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      '10 active job posts',
      '100 candidate contacts/month',
      'Basic candidate search',
      'Application tracking',
      'Email templates',
      'Basic analytics'
    ],
    limits: {
      jobPosts: 10,
      candidateViews: 100,
      users: 1,
      storage: '1GB',
      support: 'Email'
    }
  },
  {
    id: 'recruiter-professional',
    name: 'Recruiter Professional',
    type: 'recruiter',
    price: 189,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      '50 active job posts',
      '500 candidate contacts/month',
      'Advanced search & filters',
      'AI candidate matching',
      'Interview scheduling',
      'Team collaboration',
      'Advanced analytics',
      'Custom branding',
      'Priority support'
    ],
    limits: {
      jobPosts: 50,
      candidateViews: 500,
      users: 3,
      storage: '10GB',
      support: 'Email & Phone'
    },
    popular: true
  },
  {
    id: 'recruiter-enterprise',
    name: 'Recruiter Enterprise',
    type: 'recruiter',
    price: 399,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      'Unlimited job posts',
      'Unlimited candidate contacts',
      'AI-powered sourcing',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced team management',
      'Custom analytics dashboard',
      'White-label solution',
      'API access',
      '24/7 priority support'
    ],
    limits: {
      jobPosts: -1,
      candidateViews: -1,
      users: -1,
      storage: '100GB',
      support: '24/7 Priority'
    },
    enterprise: true
  },
  // Company Plans
  {
    id: 'company-startup',
    name: 'Company Startup',
    type: 'company',
    price: 149,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      '20 active job posts',
      '200 candidate views/month',
      'Company profile page',
      'Basic applicant tracking',
      'Team collaboration (5 users)',
      'Email notifications',
      'Basic reporting'
    ],
    limits: {
      jobPosts: 20,
      candidateViews: 200,
      users: 5,
      storage: '5GB',
      support: 'Email'
    }
  },
  {
    id: 'company-growth',
    name: 'Company Growth',
    type: 'company',
    price: 299,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      '100 active job posts',
      '1000 candidate views/month',
      'Enhanced company branding',
      'Advanced applicant tracking',
      'Team collaboration (15 users)',
      'Interview scheduling',
      'Advanced analytics',
      'Custom workflows',
      'Integration support'
    ],
    limits: {
      jobPosts: 100,
      candidateViews: 1000,
      users: 15,
      storage: '25GB',
      support: 'Email & Phone'
    },
    popular: true
  },
  {
    id: 'company-enterprise',
    name: 'Company Enterprise',
    type: 'company',
    price: 599,
    currency: 'CHF',
    billing: 'monthly',
    features: [
      'Unlimited job posts',
      'Unlimited candidate views',
      'Full white-label solution',
      'Custom integrations (HRIS/ATS)',
      'Unlimited team members',
      'Dedicated success manager',
      'Custom analytics & reporting',
      'API access',
      'SSO integration',
      'Compliance & security features',
      '24/7 priority support'
    ],
    limits: {
      jobPosts: -1,
      candidateViews: -1,
      users: -1,
      storage: 'Unlimited',
      support: '24/7 Dedicated'
    },
    enterprise: true
  }
];

const mockSubscription: Subscription = {
  id: 'sub_1234567890',
  planId: 'company-growth',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-02-01T00:00:00Z',
  cancelAtPeriodEnd: false,
  priceId: 'price_299_monthly',
  amount: 299,
  currency: 'CHF'
};

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1234567890',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expMonth: 12,
    expYear: 2026,
    isDefault: true
  },
  {
    id: 'pm_0987654321',
    type: 'card',
    last4: '0005',
    brand: 'mastercard',
    expMonth: 8,
    expYear: 2025,
    isDefault: false
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv_2024_001',
    number: 'INV-2024-001',
    amount: 299,
    currency: 'CHF',
    status: 'paid',
    date: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-15T00:00:00Z',
    pdfUrl: '/invoices/inv_2024_001.pdf',
    description: 'Company Growth Plan - January 2024'
  },
  {
    id: 'inv_2023_012',
    number: 'INV-2023-012',
    amount: 299,
    currency: 'CHF',
    status: 'paid',
    date: '2023-12-01T00:00:00Z',
    dueDate: '2023-12-15T00:00:00Z',
    pdfUrl: '/invoices/inv_2023_012.pdf',
    description: 'Company Growth Plan - December 2023'
  }
];

export default function SubscriptionBilling() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentPlan = pricingPlans.find(plan => plan.id === mockSubscription.planId);
  
  const tabs = [
    { id: 'overview', label: 'Subscription Overview', icon: Package },
    { id: 'plans', label: 'Plans & Pricing', icon: DollarSign },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'usage', label: 'Usage Analytics', icon: BarChart3 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'trialing':
      case 'pending':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'past_due':
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'CHF') => {
    return new Intl.NumberFormat('de-CH', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('de-CH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(dateString));
  };

  const handlePlanUpgrade = async (planId: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSelectedPlan(planId);
    setShowUpgradeModal(false);
    setLoading(false);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Current Subscription */}
      <DashboardCard title="Current Subscription">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-jobequal-text dark:text-white">
                  {currentPlan?.name}
                </h3>
                <p className="text-sm text-jobequal-text-muted dark:text-gray-400">
                  {currentPlan?.type === 'company' ? 'Company Plan' : 
                   currentPlan?.type === 'recruiter' ? 'Recruiter Plan' : 'Candidate Plan'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-jobequal-text dark:text-white">
                  {formatCurrency(mockSubscription.amount)}
                </div>
                <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                  per month
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mockSubscription.status)}`}>
                {mockSubscription.status.toUpperCase()}
              </span>
              {currentPlan?.popular && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  POPULAR
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-jobequal-text-muted dark:text-gray-400">Current period:</span>
                <span className="text-jobequal-text dark:text-white">
                  {formatDate(mockSubscription.currentPeriodStart)} - {formatDate(mockSubscription.currentPeriodEnd)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-jobequal-text-muted dark:text-gray-400">Next billing:</span>
                <span className="text-jobequal-text dark:text-white">
                  {formatDate(mockSubscription.currentPeriodEnd)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-jobequal-text dark:text-white">Plan Features</h4>
            <div className="space-y-2">
              {currentPlan?.features.slice(0, 5).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-jobequal-text-muted dark:text-gray-400">{feature}</span>
                </div>
              ))}
              {currentPlan && currentPlan.features.length > 5 && (
                <div className="text-sm text-jobequal-green font-medium">
                  +{currentPlan.features.length - 5} more features
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <ActionButton
            variant="primary"
            onClick={() => setShowUpgradeModal(true)}
            icon={TrendingUp}
          >
            Upgrade Plan
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => setActiveTab('plans')}
            icon={Package}
          >
            View All Plans
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => setActiveTab('usage')}
            icon={BarChart3}
          >
            View Usage
          </ActionButton>
        </div>
      </DashboardCard>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Job Posts Used"
          value="23"
          icon={Briefcase}
          description={`of ${currentPlan?.limits.jobPosts === -1 ? 'unlimited' : currentPlan?.limits.jobPosts}`}
          change="85%"
          changeType="neutral"
        />
        <StatsCard
          title="Candidate Views"
          value="687"
          icon={Users}
          description={`of ${currentPlan?.limits.candidateViews === -1 ? 'unlimited' : currentPlan?.limits.candidateViews}`}
          change="68.7%"
          changeType="neutral"
        />
        <StatsCard
          title="Team Members"
          value="8"
          icon={Users}
          description={`of ${currentPlan?.limits.users === -1 ? 'unlimited' : currentPlan?.limits.users}`}
          change="53%"
          changeType="neutral"
        />
        <StatsCard
          title="Storage Used"
          value="12.5 GB"
          icon={Globe}
          description={`of ${currentPlan?.limits.storage}`}
          change="50%"
          changeType="positive"
        />
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-8">
      {/* Plan Categories */}
      {['candidate', 'recruiter', 'company'].map((type) => (
        <div key={type} className="space-y-6">
          <SectionHeader 
            title={`${type.charAt(0).toUpperCase() + type.slice(1)} Plans`}
            subtitle={
              type === 'candidate' ? 'Perfect for job seekers looking to advance their careers' :
              type === 'recruiter' ? 'Comprehensive solutions for talent acquisition professionals' :
              'Enterprise-grade hiring solutions for growing companies'
            }
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.filter(plan => plan.type === type).map((plan) => (
              <motion.div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-jobequal-green shadow-lg' 
                    : plan.enterprise
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-jobequal-green hover:shadow-lg'
                } ${plan.id === currentPlan?.id ? 'ring-2 ring-blue-500' : ''}`}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-jobequal-green text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.enterprise && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Enterprise
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-jobequal-text dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-jobequal-text dark:text-white">
                        {formatCurrency(plan.price)}
                      </span>
                      <span className="text-jobequal-text-muted dark:text-gray-400 ml-1">
                        /{plan.billing === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {plan.price === 0 && (
                      <div className="text-sm text-green-600 font-medium">Free Forever</div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                    <div className="space-y-2 text-sm">
                      {plan.limits.jobPosts && (
                        <div className="flex justify-between">
                          <span className="text-jobequal-text-muted dark:text-gray-400">Job Posts:</span>
                          <span className="text-jobequal-text dark:text-white">
                            {plan.limits.jobPosts === -1 ? 'Unlimited' : plan.limits.jobPosts}
                          </span>
                        </div>
                      )}
                      {plan.limits.candidateViews && (
                        <div className="flex justify-between">
                          <span className="text-jobequal-text-muted dark:text-gray-400">Candidate Views:</span>
                          <span className="text-jobequal-text dark:text-white">
                            {plan.limits.candidateViews === -1 ? 'Unlimited' : plan.limits.candidateViews}
                          </span>
                        </div>
                      )}
                      {plan.limits.users && (
                        <div className="flex justify-between">
                          <span className="text-jobequal-text-muted dark:text-gray-400">Team Members:</span>
                          <span className="text-jobequal-text dark:text-white">
                            {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-jobequal-text-muted dark:text-gray-400">Support:</span>
                        <span className="text-jobequal-text dark:text-white">{plan.limits.support}</span>
                      </div>
                    </div>
                  </div>

                  <ActionButton
                    variant={plan.id === currentPlan?.id ? 'secondary' : plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                    onClick={() => plan.id !== currentPlan?.id && handlePlanUpgrade(plan.id)}
                    disabled={plan.id === currentPlan?.id}
                    loading={loading && selectedPlan === plan.id}
                  >
                    {plan.id === currentPlan?.id ? 'Current Plan' : 
                     plan.price === 0 ? 'Get Started Free' : 'Upgrade Now'}
                  </ActionButton>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8">
      {/* Billing Information */}
      <DashboardCard title="Billing Information">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Company Name
              </label>
              <input
                type="text"
                value="TechCorp Zurich"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value="billing@techcorp.ch"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Tax ID
              </label>
              <input
                type="text"
                value="CHE-123.456.789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white"
                readOnly
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jobequal-text dark:text-white mb-2">
                Address
              </label>
              <textarea
                value="Bahnhofstrasse 1&#10;8001 Zurich&#10;Switzerland"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-jobequal-text dark:text-white h-24"
                readOnly
              />
            </div>
            <ActionButton variant="secondary" icon={Edit} className="w-full">
              Update Billing Information
            </ActionButton>
          </div>
        </div>
      </DashboardCard>

      {/* Invoice History */}
      <DashboardCard title="Invoice History">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-jobequal-text dark:text-white">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-jobequal-text dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-medium text-jobequal-text dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-jobequal-text dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium text-jobequal-text dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-jobequal-text dark:text-white">{invoice.number}</div>
                      <div className="text-sm text-jobequal-text-muted dark:text-gray-400">{invoice.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-jobequal-text-muted dark:text-gray-400">
                    {formatDate(invoice.date)}
                  </td>
                  <td className="py-3 px-4 font-medium text-jobequal-text dark:text-white">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      icon={Download}
                      onClick={() => window.open(invoice.pdfUrl, '_blank')}
                    >
                      Download
                    </ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-8">
      <DashboardCard title="Payment Methods">
        <div className="space-y-6">
          {mockPaymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg ${
                method.isDefault ? 'border-jobequal-green bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <CardIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <div className="font-medium text-jobequal-text dark:text-white">
                      {method.brand?.toUpperCase()} •••• {method.last4}
                    </div>
                    <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                      Expires {method.expMonth}/{method.expYear}
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="px-3 py-1 bg-jobequal-green text-white rounded-full text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <ActionButton variant="secondary" size="sm" icon={Edit}>
                    Edit
                  </ActionButton>
                  <ActionButton variant="danger" size="sm" icon={Trash2}>
                    Remove
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
          
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowPaymentModal(true)}
          >
            Add Payment Method
          </ActionButton>
        </div>
      </DashboardCard>
    </div>
  );

  const renderUsage = () => (
    <div className="space-y-8">
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Job Posts This Month"
          value="23"
          icon={Briefcase}
          description="7 more than last month"
          change="+43%"
          changeType="positive"
        />
        <StatsCard
          title="Candidate Views"
          value="687"
          icon={Users}
          description="213 remaining this month"
          change="+15%"
          changeType="positive"
        />
        <StatsCard
          title="Applications Received"
          value="156"
          icon={FileText}
          description="23 pending review"
          change="+8%"
          changeType="positive"
        />
        <StatsCard
          title="Team Collaboration"
          value="8 users"
          icon={Users}
          description="7 slots remaining"
          change="+2"
          changeType="positive"
        />
      </div>

      {/* Detailed Usage Analytics */}
      <DashboardCard title="Usage Analytics">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-jobequal-text dark:text-white mb-4">Plan Limits</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Job Posts</span>
                    <span>23/100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-jobequal-green h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Candidate Views</span>
                    <span>687/1000</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68.7%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Team Members</span>
                    <span>8/15</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Storage</span>
                    <span>12.5 GB/25 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-jobequal-text dark:text-white mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Base Plan</span>
                  <span className="font-medium text-jobequal-text dark:text-white">{formatCurrency(299)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Additional Storage (5GB)</span>
                  <span className="font-medium text-jobequal-text dark:text-white">{formatCurrency(15)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Premium Support</span>
                  <span className="font-medium text-jobequal-text dark:text-white">{formatCurrency(25)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-jobequal-text dark:text-white">Total Monthly</span>
                    <span className="text-xl font-bold text-jobequal-green">{formatCurrency(339)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );

  return (
    <DashboardContainer>
      <Navigation />
      
      <SectionHeader
        title="Subscription & Billing"
        subtitle="Manage your subscription, billing information, and payment methods"
        actions={
          <div className="flex items-center space-x-3">
            <ActionButton variant="secondary" icon={Calculator}>
              Cost Calculator
            </ActionButton>
            <ActionButton variant="secondary" icon={Headphones}>
              Contact Support
            </ActionButton>
          </div>
        }
      />

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-jobequal-green text-jobequal-green'
                      : 'border-transparent text-jobequal-text-muted hover:text-jobequal-text hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'plans' && renderPlans()}
          {activeTab === 'billing' && renderBilling()}
          {activeTab === 'payment' && renderPaymentMethods()}
          {activeTab === 'usage' && renderUsage()}
        </motion.div>
      </AnimatePresence>
    </DashboardContainer>
  );
}
