import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  TrendingUp,
  MapPin,
  Briefcase,
  GraduationCap,
  BarChart3,
  Download,
  Filter,
  Search,
  ChevronDown,
  DollarSign,
  Users,
  Building,
  Award,
  Clock,
  Target,
} from "lucide-react";

interface SalaryData {
  role: string;
  minSalary: number;
  maxSalary: number;
  medianSalary: number;
  growth: number;
  demand: "high" | "medium" | "low";
  experience: string;
  location: string;
  industry: string;
}

const salaryData: SalaryData[] = [
  {
    role: "Software Engineer",
    minSalary: 85000,
    maxSalary: 140000,
    medianSalary: 110000,
    growth: 8.5,
    demand: "high",
    experience: "Mid-level",
    location: "Zurich",
    industry: "Technology",
  },
  {
    role: "Senior Software Engineer",
    minSalary: 120000,
    maxSalary: 180000,
    medianSalary: 150000,
    growth: 12.3,
    demand: "high",
    experience: "Senior",
    location: "Zurich",
    industry: "Technology",
  },
  {
    role: "Data Scientist",
    minSalary: 95000,
    maxSalary: 160000,
    medianSalary: 125000,
    growth: 15.2,
    demand: "high",
    experience: "Mid-level",
    location: "Zurich",
    industry: "Technology",
  },
  {
    role: "Product Manager",
    minSalary: 110000,
    maxSalary: 170000,
    medianSalary: 140000,
    growth: 10.1,
    demand: "high",
    experience: "Senior",
    location: "Zurich",
    industry: "Technology",
  },
  {
    role: "UX Designer",
    minSalary: 75000,
    maxSalary: 120000,
    medianSalary: 95000,
    growth: 6.8,
    demand: "medium",
    experience: "Mid-level",
    location: "Zurich",
    industry: "Design",
  },
  {
    role: "Marketing Manager",
    minSalary: 85000,
    maxSalary: 130000,
    medianSalary: 105000,
    growth: 5.2,
    demand: "medium",
    experience: "Mid-level",
    location: "Zurich",
    industry: "Marketing",
  },
  {
    role: "Financial Analyst",
    minSalary: 80000,
    maxSalary: 120000,
    medianSalary: 100000,
    growth: 4.1,
    demand: "medium",
    experience: "Mid-level",
    location: "Zurich",
    industry: "Finance",
  },
  {
    role: "HR Manager",
    minSalary: 90000,
    maxSalary: 140000,
    medianSalary: 115000,
    growth: 3.8,
    demand: "medium",
    experience: "Senior",
    location: "Zurich",
    industry: "HR",
  },
  {
    role: "Operations Manager",
    minSalary: 95000,
    maxSalary: 145000,
    medianSalary: 120000,
    growth: 4.5,
    demand: "medium",
    experience: "Senior",
    location: "Zurich",
    industry: "Operations",
  },
  {
    role: "Sales Manager",
    minSalary: 100000,
    maxSalary: 180000,
    medianSalary: 135000,
    growth: 7.2,
    demand: "high",
    experience: "Senior",
    location: "Zurich",
    industry: "Sales",
  },
];

const locationFactors = {
  Zurich: 1.0,
  Geneva: 0.95,
  Basel: 0.92,
  Bern: 0.85,
  Lausanne: 0.88,
  Remote: 0.9,
};

const industryInsights = [
  {
    name: "Technology",
    growth: 12.5,
    topRoles: ["Software Engineer", "Data Scientist", "DevOps Engineer"],
    averageSalary: 125000,
    description:
      "Switzerland's tech sector continues to boom with major companies like Google, Microsoft, and Facebook establishing significant presence.",
  },
  {
    name: "Finance",
    growth: 6.2,
    topRoles: ["Investment Banker", "Risk Analyst", "Portfolio Manager"],
    averageSalary: 140000,
    description:
      "Swiss financial services remain globally competitive, with traditional banking evolving towards fintech innovation.",
  },
  {
    name: "Pharmaceuticals",
    growth: 8.8,
    topRoles: [
      "Research Scientist",
      "Clinical Trial Manager",
      "Regulatory Affairs",
    ],
    averageSalary: 135000,
    description:
      "Home to Novartis and Roche, Switzerland leads global pharmaceutical innovation with strong R&D investment.",
  },
  {
    name: "Consulting",
    growth: 7.1,
    topRoles: [
      "Management Consultant",
      "Strategy Consultant",
      "Business Analyst",
    ],
    averageSalary: 120000,
    description:
      "Major consulting firms maintain strong presence in Switzerland, serving multinational corporations across Europe.",
  },
];

export default function SalaryGuide() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Zurich");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const filteredData = salaryData.filter((item) => {
    const matchesSearch = item.role
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || item.role === selectedRole;
    const matchesLocation =
      !selectedLocation || item.location === selectedLocation;
    const matchesIndustry =
      !selectedIndustry || item.industry === selectedIndustry;

    return matchesSearch && matchesRole && matchesLocation && matchesIndustry;
  });

  const formatSalary = (amount: number, location: string = "Zurich") => {
    const factor =
      locationFactors[location as keyof typeof locationFactors] || 1;
    const adjustedAmount = Math.round(amount * factor);
    return `CHF ${adjustedAmount.toLocaleString()}`;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "high":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "low":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-700";
    }
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
            Swiss Salary Guide 2024
          </h1>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive salary insights for professionals in Switzerland. Get
            accurate, up-to-date compensation data across industries and
            locations.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              title: "Average Salary",
              value: "CHF 125,000",
              change: "+8.2%",
              icon: DollarSign,
            },
            {
              title: "Top Industry",
              value: "Technology",
              change: "+12.5%",
              icon: TrendingUp,
            },
            {
              title: "Highest Demand",
              value: "Software Engineers",
              change: "+15.3%",
              icon: Users,
            },
            {
              title: "Growth Rate",
              value: "7.8%",
              change: "YoY",
              icon: BarChart3,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-jobequal-green" />
                <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-jobequal-text dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
            >
              <option value="">All Locations</option>
              <option value="Zurich">Zurich</option>
              <option value="Geneva">Geneva</option>
              <option value="Basel">Basel</option>
              <option value="Bern">Bern</option>
              <option value="Lausanne">Lausanne</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-jobequal-text dark:text-white focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="HR">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
            </select>

            <button className="flex items-center justify-center space-x-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white px-4 py-3 rounded-xl font-medium transition-colors">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </motion.div>

        {/* Industry Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
            Industry Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryInsights.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-jobequal-text dark:text-white">
                    {industry.name}
                  </h3>
                  <span className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                    +{industry.growth}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-jobequal-green mb-2">
                  {formatSalary(industry.averageSalary)}
                </div>
                <div className="text-sm text-jobequal-text-muted dark:text-gray-400 mb-4">
                  Average Salary
                </div>
                <div className="space-y-1 mb-4">
                  <div className="text-sm font-medium text-jobequal-text dark:text-white">
                    Top Roles:
                  </div>
                  {industry.topRoles.slice(0, 2).map((role, roleIndex) => (
                    <div
                      key={roleIndex}
                      className="text-xs text-jobequal-text-muted dark:text-gray-400"
                    >
                      • {role}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-jobequal-text-muted dark:text-gray-400">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Salary Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-jobequal-text dark:text-white">
              Salary Breakdown by Role
            </h2>
            <p className="text-jobequal-text-muted dark:text-gray-400 mt-2">
              Detailed compensation data for {filteredData.length} roles in
              Switzerland
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Salary Range
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Median
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Growth
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Demand
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Experience
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.02 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-jobequal-text dark:text-white">
                          {item.role}
                        </div>
                        <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
                          {item.industry}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-jobequal-text dark:text-white">
                        {formatSalary(item.minSalary, selectedLocation)} -{" "}
                        {formatSalary(item.maxSalary, selectedLocation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-jobequal-green">
                        {formatSalary(item.medianSalary, selectedLocation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          +{item.growth}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDemandColor(item.demand)}`}
                      >
                        {item.demand}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-jobequal-text-muted dark:text-gray-400">
                      {item.experience}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Additional Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">
                Location Impact
              </h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              Zurich typically offers the highest salaries, followed by Geneva
              and Basel. Remote positions often come with 10% lower compensation
              but significant cost savings.
            </p>
            <div className="space-y-2">
              {Object.entries(locationFactors).map(([location, factor]) => (
                <div key={location} className="flex justify-between text-sm">
                  <span className="text-blue-700 dark:text-blue-300">
                    {location}
                  </span>
                  <span className="font-medium text-blue-800 dark:text-blue-200">
                    {factor === 1
                      ? "Baseline"
                      : `${Math.round((factor - 1) * 100)}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Award className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                Benefits Package
              </h3>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm mb-4">
              Swiss employers typically offer comprehensive benefits beyond base
              salary:
            </p>
            <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
              <div>• 13th month salary (standard)</div>
              <div>• 4-6 weeks vacation</div>
              <div>• Pension contributions (2nd pillar)</div>
              <div>• Health insurance subsidies</div>
              <div>• Professional development budget</div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200">
                Negotiation Tips
              </h3>
            </div>
            <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
              Key strategies for salary negotiations in Switzerland:
            </p>
            <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
              <div>• Research market rates thoroughly</div>
              <div>• Highlight unique skills/experience</div>
              <div>• Consider total compensation package</div>
              <div>• Time negotiations strategically</div>
              <div>• Be prepared to justify requests</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">
            Ready to Find Your Perfect Role?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Use our AI-powered matching to discover opportunities that match
            your salary expectations and career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-jobequal-green px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Browse Jobs
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Get Salary Report
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
