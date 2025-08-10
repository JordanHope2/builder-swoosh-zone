import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '../components/Navigation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BarChart3,
  Users,
  Building,
  TrendingUp,
  DollarSign,
  Eye,
  Activity,
  Shield,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  MapPin,
  Calendar,
  Star,
  Award,
  Target,
  Zap,
  PieChart,
  LineChart,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  Image,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Globe,
  Monitor,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Link,
  ExternalLink,
  Share2,
  Copy,
  Archive,
  Lock,
  Unlock,
  Key,
  UserPlus,
  Crown,
  Calculator,
  Percent,
  Receipt,
  CreditCard,
  Banknote,
  Wallet,
  TrendingDown,
  AlertCircle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

interface RevenueMetrics {
  totalRevenue: number;
  recurringRevenue: number;
  oneTimeRevenue: number;
  growth: number;
  churn: number;
  arpu: number;
  ltv: number;
  cac: number;
  monthlyGrowthRate: number;
  revenueByPlan: { [key: string]: number };
  revenueByRegion: { [key: string]: number };
  forecastedRevenue: number;
}

interface CostStructure {
  totalCosts: number;
  serverCosts: number;
  staffCosts: number;
  marketingCosts: number;
  operationalCosts: number;
  customerSupportCosts: number;
  developmentCosts: number;
  costPerCustomer: number;
  grossMargin: number;
  netMargin: number;
}

interface SecurityMetrics {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  blockedAttacks: number;
  activeThreats: number;
  vulnerabilities: number;
  securityScore: number;
  lastSecurityAudit: string;
  failedLogins: number;
  suspiciousActivities: number;
  dataBreaches: number;
  complianceScore: number;
}

interface SystemHealth {
  uptime: number;
  avgResponseTime: number;
  errorRate: number;
  activeUsers: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  databaseConnections: number;
  cacheHitRate: number;
}

const mockRevenueMetrics: RevenueMetrics = {
  totalRevenue: 2456780,
  recurringRevenue: 2198450,
  oneTimeRevenue: 258330,
  growth: 18.5,
  churn: 2.3,
  arpu: 187,
  ltv: 8940,
  cac: 285,
  monthlyGrowthRate: 12.4,
  revenueByPlan: {
    'Candidate Premium': 345600,
    'Recruiter Professional': 987650,
    'Recruiter Enterprise': 645800,
    'Company Growth': 387900,
    'Company Enterprise': 89830
  },
  revenueByRegion: {
    'Zurich': 856700,
    'Geneva': 567800,
    'Basel': 445600,
    'Bern': 334500,
    'Lausanne': 252180
  },
  forecastedRevenue: 2987600
};

const mockCostStructure: CostStructure = {
  totalCosts: 1789600,
  serverCosts: 234500,
  staffCosts: 987600,
  marketingCosts: 234800,
  operationalCosts: 145700,
  customerSupportCosts: 89500,
  developmentCosts: 97500,
  costPerCustomer: 14.7,
  grossMargin: 72.8,
  netMargin: 27.2
};

const mockSecurityMetrics: SecurityMetrics = {
  threatLevel: 'low',
  blockedAttacks: 1247,
  activeThreats: 3,
  vulnerabilities: 12,
  securityScore: 94,
  lastSecurityAudit: '2024-01-10T00:00:00Z',
  failedLogins: 234,
  suspiciousActivities: 18,
  dataBreaches: 0,
  complianceScore: 98
};

const mockSystemHealth: SystemHealth = {
  uptime: 99.97,
  avgResponseTime: 145,
  errorRate: 0.12,
  activeUsers: 12847,
  cpuUsage: 68,
  memoryUsage: 74,
  diskUsage: 45,
  networkLatency: 23,
  databaseConnections: 156,
  cacheHitRate: 94
};

export default function EnhancedOwnerDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
    { id: 'costs', label: 'Cost Analysis', icon: Calculator },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security & Compliance', icon: Shield },
    { id: 'system', label: 'System Health', icon: Server },
    { id: 'reports', label: 'Advanced Reports', icon: FileText }
  ];

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  const exportData = async () => {
    // Simulate data export
    const data = {
      revenue: mockRevenueMetrics,
      costs: mockCostStructure,
      security: mockSecurityMetrics,
      system: mockSystemHealth,
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(mockRevenueMetrics.totalRevenue)}
          icon={DollarSign}
          description="This month"
          change={`+${formatPercent(mockRevenueMetrics.growth)}`}
          changeType="positive"
          index={0}
        />
        <StatsCard
          title="Net Profit Margin"
          value={formatPercent(mockCostStructure.netMargin)}
          icon={TrendingUp}
          description="Above industry avg"
          change="+2.4%"
          changeType="positive"
          index={1}
        />
        <StatsCard
          title="Active Users"
          value={mockSystemHealth.activeUsers.toLocaleString()}
          icon={Users}
          description="Currently online"
          change="+8.7%"
          changeType="positive"
          index={2}
        />
        <StatsCard
          title="System Uptime"
          value={formatPercent(mockSystemHealth.uptime)}
          icon={Activity}
          description="This month"
          change="+0.02%"
          changeType="positive"
          index={3}
        />
      </div>

      {/* Revenue Breakdown */}
      <DashboardCard title="Revenue Breakdown">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
              Revenue Sources
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-jobequal-text dark:text-white">Recurring Revenue</span>
                <span className="text-sm font-bold text-green-600">{formatCurrency(mockRevenueMetrics.recurringRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-jobequal-text dark:text-white">One-time Revenue</span>
                <span className="text-sm font-bold text-blue-600">{formatCurrency(mockRevenueMetrics.oneTimeRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium text-jobequal-text dark:text-white">Forecasted (Next Month)</span>
                <span className="text-sm font-bold text-purple-600">{formatCurrency(mockRevenueMetrics.forecastedRevenue)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
              Key Metrics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(mockRevenueMetrics.arpu)}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">ARPU</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(mockRevenueMetrics.ltv)}</div>
                <div className="text-sm text-green-600 dark:text-green-400">LTV</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(mockRevenueMetrics.cac)}</div>
                <div className="text-sm text-orange-600 dark:text-orange-400">CAC</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{formatPercent(mockRevenueMetrics.churn)}</div>
                <div className="text-sm text-red-600 dark:text-red-400">Churn Rate</div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Cost vs Revenue */}
      <DashboardCard title="Financial Health">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-jobequal-text dark:text-white">Revenue</h4>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(mockRevenueMetrics.totalRevenue)}
            </div>
            <div className="text-sm text-green-600">
              ↗ +{formatPercent(mockRevenueMetrics.growth)} from last month
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-jobequal-text dark:text-white">Total Costs</h4>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrency(mockCostStructure.totalCosts)}
            </div>
            <div className="text-sm text-red-600">
              Cost per customer: {formatCurrency(mockCostStructure.costPerCustomer)}
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-jobequal-text dark:text-white">Net Profit</h4>
            <div className="text-3xl font-bold text-jobequal-green">
              {formatCurrency(mockRevenueMetrics.totalRevenue - mockCostStructure.totalCosts)}
            </div>
            <div className="text-sm text-jobequal-green">
              Margin: {formatPercent(mockCostStructure.netMargin)}
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-8">
      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(mockRevenueMetrics.recurringRevenue)}
          icon={DollarSign}
          description="89% of total revenue"
          change={`+${formatPercent(mockRevenueMetrics.monthlyGrowthRate)}`}
          changeType="positive"
        />
        <StatsCard
          title="Average Revenue Per User"
          value={formatCurrency(mockRevenueMetrics.arpu)}
          icon={TrendingUp}
          description="Per month"
          change="+$12"
          changeType="positive"
        />
        <StatsCard
          title="Customer Lifetime Value"
          value={formatCurrency(mockRevenueMetrics.ltv)}
          icon={Target}
          description="31x CAC ratio"
          change="+15%"
          changeType="positive"
        />
        <StatsCard
          title="Growth Rate"
          value={formatPercent(mockRevenueMetrics.growth)}
          icon={BarChart3}
          description="Month over month"
          change="+2.3%"
          changeType="positive"
        />
      </div>

      {/* Revenue by Plan */}
      <DashboardCard title="Revenue by Subscription Plan">
        <div className="space-y-4">
          {Object.entries(mockRevenueMetrics.revenueByPlan).map(([plan, revenue]) => {
            const percentage = (revenue / mockRevenueMetrics.totalRevenue) * 100;
            return (
              <div key={plan} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-jobequal-text dark:text-white">{plan}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-jobequal-text dark:text-white">
                      {formatCurrency(revenue)}
                    </div>
                    <div className="text-xs text-jobequal-text-muted dark:text-gray-400">
                      {formatPercent(percentage)}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-jobequal-green h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </DashboardCard>

      {/* Revenue by Region */}
      <DashboardCard title="Revenue by Region">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(mockRevenueMetrics.revenueByRegion).map(([region, revenue]) => (
            <div key={region} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-jobequal-text dark:text-white">
                {formatCurrency(revenue)}
              </div>
              <div className="text-sm text-jobequal-text-muted dark:text-gray-400">{region}</div>
              <div className="text-xs text-jobequal-green">
                {formatPercent((revenue / mockRevenueMetrics.totalRevenue) * 100)}
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );

  const renderCosts = () => (
    <div className="space-y-8">
      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Monthly Costs"
          value={formatCurrency(mockCostStructure.totalCosts)}
          icon={Calculator}
          description="All operational costs"
          change="+5.2%"
          changeType="negative"
        />
        <StatsCard
          title="Cost Per Customer"
          value={formatCurrency(mockCostStructure.costPerCustomer)}
          icon={Users}
          description="Including all expenses"
          change="-$2.1"
          changeType="positive"
        />
        <StatsCard
          title="Gross Margin"
          value={formatPercent(mockCostStructure.grossMargin)}
          icon={TrendingUp}
          description="Revenue minus COGS"
          change="+1.8%"
          changeType="positive"
        />
        <StatsCard
          title="Operational Efficiency"
          value="94.2%"
          icon={Target}
          description="Cost optimization score"
          change="+2.4%"
          changeType="positive"
        />
      </div>

      {/* Cost Breakdown */}
      <DashboardCard title="Detailed Cost Analysis">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
              Cost Categories
            </h4>
            <div className="space-y-3">
              {[
                { name: 'Staff Costs', amount: mockCostStructure.staffCosts, color: 'bg-blue-500' },
                { name: 'Marketing', amount: mockCostStructure.marketingCosts, color: 'bg-green-500' },
                { name: 'Server Infrastructure', amount: mockCostStructure.serverCosts, color: 'bg-purple-500' },
                { name: 'Operations', amount: mockCostStructure.operationalCosts, color: 'bg-orange-500' },
                { name: 'Development', amount: mockCostStructure.developmentCosts, color: 'bg-red-500' },
                { name: 'Customer Support', amount: mockCostStructure.customerSupportCosts, color: 'bg-yellow-500' }
              ].map((cost, index) => {
                const percentage = (cost.amount / mockCostStructure.totalCosts) * 100;
                return (
                  <div key={cost.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-jobequal-text dark:text-white">{cost.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-jobequal-text dark:text-white">
                          {formatCurrency(cost.amount)}
                        </div>
                        <div className="text-xs text-jobequal-text-muted dark:text-gray-400">
                          {formatPercent(percentage)}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${cost.color} h-2 rounded-full transition-all duration-300`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
              Cost Optimization Opportunities
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-green-800 dark:text-green-400">Server Optimization</h5>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Potential savings: {formatCurrency(35000)}/month by optimizing cloud resources
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-800 dark:text-blue-400">Marketing Efficiency</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Optimize ad spend to reduce CAC by 15% ({formatCurrency(43)}/customer)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-purple-800 dark:text-purple-400">Automation</h5>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Automate support tasks to save {formatCurrency(28000)}/month in labor costs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Security Score"
          value={`${mockSecurityMetrics.securityScore}/100`}
          icon={Shield}
          description="Overall security rating"
          change="+2 points"
          changeType="positive"
        />
        <StatsCard
          title="Threats Blocked"
          value={mockSecurityMetrics.blockedAttacks.toLocaleString()}
          icon={AlertTriangle}
          description="This month"
          change="+12%"
          changeType="positive"
        />
        <StatsCard
          title="Active Threats"
          value={mockSecurityMetrics.activeThreats.toString()}
          icon={XCircle}
          description="Requiring attention"
          change="-5"
          changeType="positive"
        />
        <StatsCard
          title="Compliance Score"
          value={`${mockSecurityMetrics.complianceScore}%`}
          icon={CheckCircle}
          description="GDPR, SOC2, ISO27001"
          change="+1%"
          changeType="positive"
        />
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="Threat Analysis">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm font-medium">Current Threat Level</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSecurityColor(mockSecurityMetrics.threatLevel)}`}>
                {mockSecurityMetrics.threatLevel.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Failed Login Attempts</span>
                <span className="font-medium text-jobequal-text dark:text-white">{mockSecurityMetrics.failedLogins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Suspicious Activities</span>
                <span className="font-medium text-jobequal-text dark:text-white">{mockSecurityMetrics.suspiciousActivities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Vulnerabilities</span>
                <span className="font-medium text-jobequal-text dark:text-white">{mockSecurityMetrics.vulnerabilities}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-jobequal-text-muted dark:text-gray-400">Data Breaches</span>
                <span className="font-medium text-green-600">{mockSecurityMetrics.dataBreaches}</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Security Compliance">
          <div className="space-y-4">
            {[
              { name: 'GDPR Compliance', score: 98, requirement: 'Required' },
              { name: 'SOC 2 Type II', score: 95, requirement: 'Required' },
              { name: 'ISO 27001', score: 92, requirement: 'Recommended' },
              { name: 'PCI DSS', score: 89, requirement: 'Required' },
              { name: 'Swiss DPA', score: 97, requirement: 'Required' }
            ].map((compliance, index) => (
              <div key={compliance.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-jobequal-text dark:text-white">{compliance.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-jobequal-text dark:text-white">{compliance.score}%</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      compliance.requirement === 'Required' 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {compliance.requirement}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      compliance.score >= 95 ? 'bg-green-500' :
                      compliance.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${compliance.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );

  const renderSystemHealth = () => (
    <div className="space-y-8">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="System Uptime"
          value={formatPercent(mockSystemHealth.uptime)}
          icon={Activity}
          description="This month"
          change="+0.02%"
          changeType="positive"
        />
        <StatsCard
          title="Response Time"
          value={`${mockSystemHealth.avgResponseTime}ms`}
          icon={Zap}
          description="Average response"
          change="-12ms"
          changeType="positive"
        />
        <StatsCard
          title="Active Users"
          value={mockSystemHealth.activeUsers.toLocaleString()}
          icon={Users}
          description="Currently online"
          change="+8.7%"
          changeType="positive"
        />
        <StatsCard
          title="Error Rate"
          value={formatPercent(mockSystemHealth.errorRate)}
          icon={AlertCircle}
          description="Last 24 hours"
          change="-0.05%"
          changeType="positive"
        />
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="Server Resources">
          <div className="space-y-4">
            {[
              { name: 'CPU Usage', value: mockSystemHealth.cpuUsage, max: 100, unit: '%', color: 'bg-blue-500' },
              { name: 'Memory Usage', value: mockSystemHealth.memoryUsage, max: 100, unit: '%', color: 'bg-green-500' },
              { name: 'Disk Usage', value: mockSystemHealth.diskUsage, max: 100, unit: '%', color: 'bg-purple-500' },
              { name: 'Network Latency', value: mockSystemHealth.networkLatency, max: 100, unit: 'ms', color: 'bg-orange-500' }
            ].map((resource, index) => (
              <div key={resource.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-jobequal-text dark:text-white">{resource.name}</span>
                  <span className="text-sm font-bold text-jobequal-text dark:text-white">
                    {resource.value}{resource.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`${resource.color} h-2 rounded-full transition-all duration-300`} 
                    style={{ width: `${(resource.value / resource.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Database & Performance">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockSystemHealth.databaseConnections}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">DB Connections</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatPercent(mockSystemHealth.cacheHitRate)}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Cache Hit Rate</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="font-medium text-jobequal-text dark:text-white">Performance Insights</h5>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-400">All systems operational</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800 dark:text-blue-400">CDN performance optimized</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );

  return (
    <DashboardContainer>
      <Navigation />
      
      <SectionHeader
        title="Platform Administration"
        subtitle="Comprehensive analytics, monitoring, and management for JobEqual platform"
        actions={
          <>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(SecurityUtils.sanitizeText(e.target.value))}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-jobequal-neutral-dark dark:border-gray-600 rounded-xl text-jobequal-text dark:text-white focus:outline-none focus:ring-2 focus:ring-jobequal-green"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <ActionButton
              variant="primary"
              onClick={refreshData}
              loading={loading}
              icon={RefreshCw}
            >
              Refresh
            </ActionButton>
            <ActionButton
              variant="secondary"
              icon={Download}
              onClick={exportData}
            >
              Export
            </ActionButton>
          </>
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
          {activeTab === 'revenue' && renderRevenue()}
          {activeTab === 'costs' && renderCosts()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'system' && renderSystemHealth()}
          {/* Add other tab content here */}
        </motion.div>
      </AnimatePresence>
    </DashboardContainer>
  );
}
