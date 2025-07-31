import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { 
  Building, 
  Users, 
  MapPin, 
  Globe, 
  TrendingUp, 
  Award, 
  Star,
  Search,
  Filter,
  ExternalLink,
  Briefcase,
  Heart,
  Target,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Crown,
  Gem,
  Mountain
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website: string;
  openJobs: number;
  founded: string;
  rating: number;
  employees: string;
  specialties: string[];
  featured: boolean;
  verified: boolean;
  swissMade: boolean;
}

const featuredCompanies: Company[] = [
  {
    id: '1',
    name: 'UBS',
    logo: '🏦',
    industry: 'Financial Services',
    size: 'Enterprise',
    location: 'Zurich',
    description: 'Global financial services firm providing wealth management, asset management and investment banking services to private, corporate and institutional clients.',
    website: 'https://ubs.com',
    openJobs: 47,
    founded: '1862',
    rating: 4.8,
    employees: '70,000+',
    specialties: ['Investment Banking', 'Wealth Management', 'Asset Management'],
    featured: true,
    verified: true,
    swissMade: true
  },
  {
    id: '2',
    name: 'Nestlé',
    logo: '🥛',
    industry: 'Food & Beverages',
    size: 'Enterprise',
    location: 'Vevey',
    description: 'World\'s largest food and beverage company, committed to unlocking the power of food to enhance quality of life for everyone.',
    website: 'https://nestle.com',
    openJobs: 89,
    founded: '1866',
    rating: 4.7,
    employees: '280,000+',
    specialties: ['Food Technology', 'Brand Management', 'Supply Chain'],
    featured: true,
    verified: true,
    swissMade: true
  },
  {
    id: '3',
    name: 'Roche',
    logo: '💊',
    industry: 'Pharmaceuticals',
    size: 'Enterprise',
    location: 'Basel',
    description: 'Pioneer in pharmaceuticals and diagnostics focused on advancing science to improve people\'s lives.',
    website: 'https://roche.com',
    openJobs: 156,
    founded: '1896',
    rating: 4.9,
    employees: '100,000+',
    specialties: ['Drug Development', 'Biotechnology', 'Medical Devices'],
    featured: true,
    verified: true,
    swissMade: true
  },
  {
    id: '4',
    name: 'ABB',
    logo: '⚡',
    industry: 'Technology',
    size: 'Enterprise',
    location: 'Baden',
    description: 'Technology leader in electrification and automation, enabling a more sustainable and resource-efficient future.',
    website: 'https://abb.com',
    openJobs: 203,
    founded: '1988',
    rating: 4.6,
    employees: '110,000+',
    specialties: ['Automation', 'Electrification', 'Robotics'],
    featured: true,
    verified: true,
    swissMade: true
  },
  {
    id: '5',
    name: 'Novartis',
    logo: '🧬',
    industry: 'Pharmaceuticals',
    size: 'Enterprise',
    location: 'Basel',
    description: 'Global healthcare company using science and digital technologies to create transformative treatments.',
    website: 'https://novartis.com',
    openJobs: 124,
    founded: '1996',
    rating: 4.8,
    employees: '108,000+',
    specialties: ['Gene Therapy', 'Digital Health', 'Oncology'],
    featured: true,
    verified: true,
    swissMade: true
  },
  {
    id: '6',
    name: 'Credit Suisse',
    logo: '🏛️',
    industry: 'Financial Services',
    size: 'Enterprise',
    location: 'Zurich',
    description: 'Leading global financial services company headquartered in Zurich, Switzerland.',
    website: 'https://credit-suisse.com',
    openJobs: 67,
    founded: '1856',
    rating: 4.5,
    employees: '50,000+',
    specialties: ['Private Banking', 'Investment Banking', 'Asset Management'],
    featured: true,
    verified: true,
    swissMade: true
  }
];

const industries = [
  'Financial Services',
  'Pharmaceuticals',
  'Technology',
  'Food & Beverages',
  'Manufacturing',
  'Healthcare',
  'Consulting',
  'Insurance'
];

function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:scale-105">
      {/* Swiss Made Badge */}
      {company.swissMade && (
        <div className="flex justify-end mb-4">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
            <Mountain className="w-4 h-4" />
            <span>Swiss Made</span>
          </div>
        </div>
      )}

      <div className="flex items-start space-x-6 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl flex items-center justify-center text-4xl shadow-lg">
          {company.logo}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-bold text-jobequal-text group-hover:text-jobequal-green transition-colors">
              {company.name}
            </h3>
            {company.verified && (
              <div className="bg-jobequal-green text-white rounded-full p-1">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
            {company.featured && (
              <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>Premium</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-jobequal-green font-semibold">{company.industry}</span>
            <div className="flex items-center text-jobequal-text-muted">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center text-jobequal-text-muted">
              <Users className="w-4 h-4 mr-1" />
              <span>{company.employees}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(company.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-jobequal-neutral-dark'
                  }`}
                />
              ))}
              <span className="text-sm text-jobequal-text-muted ml-2">
                {company.rating} • Founded {company.founded}
              </span>
            </div>
          </div>

          <p className="text-jobequal-text-muted leading-relaxed mb-4">
            {company.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {company.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="bg-jobequal-green-light text-jobequal-green-dark px-3 py-1 rounded-full text-sm font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-jobequal-neutral-dark">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-jobequal-green">{company.openJobs}</div>
            <div className="text-sm text-jobequal-text-muted">Open Positions</div>
          </div>
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>Visit Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200">
            <Heart className="w-5 h-5" />
          </button>
          <Link
            to={`/company/${company.id}`}
            className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-6 py-3 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            View Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <Mountain className="w-12 h-12 text-red-600 mr-4" />
            <div className="text-red-600 font-bold text-lg tracking-wide uppercase">Swiss Excellence</div>
            <Mountain className="w-12 h-12 text-red-600 ml-4" />
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-jobequal-text mb-8 leading-tight">
            Premium Swiss
            <span className="block text-jobequal-green">Companies</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed mb-12">
            Discover opportunities with Switzerland's most prestigious companies. 
            Experience Swiss quality, precision, and excellence in every career opportunity.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-jobequal-text mb-2">Verified Companies</h3>
              <p className="text-jobequal-text-muted">All companies undergo rigorous Swiss-quality verification</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-jobequal-text mb-2">Premium Employers</h3>
              <p className="text-jobequal-text-muted">Access to Switzerland's most prestigious organizations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-jobequal-text mb-2">Perfect Matching</h3>
              <p className="text-jobequal-text-muted">AI-powered matching with Swiss precision</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-jobequal-neutral rounded-3xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-jobequal-text mb-8 text-center">
              Find Your Perfect Swiss Employer
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              >
                <option value="">Company Size</option>
                <option value="startup">Startup (1-50)</option>
                <option value="medium">Medium (51-500)</option>
                <option value="large">Large (501-5000)</option>
                <option value="enterprise">Enterprise (5000+)</option>
              </select>
              
              <button className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 px-8 rounded-xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200">
                Search Companies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-20 bg-gradient-to-b from-white to-jobequal-neutral">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Gem className="w-8 h-8 text-jobequal-green mr-3" />
              <span className="text-jobequal-text-muted font-medium text-lg tracking-wide uppercase">
                Premium Partners
              </span>
              <Gem className="w-8 h-8 text-jobequal-green ml-3" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-jobequal-text mb-8 leading-tight">
              Switzerland's Finest
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Discover career opportunities with companies that define Swiss excellence, 
              innovation, and quality worldwide.
            </p>
          </div>

          <div className="space-y-8">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/job-search"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <span>Explore All Opportunities</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Employers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-6">
              Join Switzerland's Premier Talent Network
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Connect with top Swiss talent through our premium recruitment platform. 
              Experience the precision and quality that defines Swiss business excellence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-jobequal-text mb-2">AI-Powered Matching</h3>
                  <p className="text-jobequal-text-muted leading-relaxed">
                    Our Swiss-engineered AI matches your openings with the most qualified candidates, 
                    ensuring precision in every hire.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-jobequal-text mb-2">Verified Talent Pool</h3>
                  <p className="text-jobequal-text-muted leading-relaxed">
                    Access Switzerland's most qualified professionals, all verified through 
                    our rigorous quality assurance process.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-jobequal-text mb-2">Premium Service</h3>
                  <p className="text-jobequal-text-muted leading-relaxed">
                    Enjoy white-glove service with dedicated account management and 
                    personalized recruitment strategies.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl p-10 text-center">
              <Crown className="w-16 h-16 text-jobequal-green mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-jobequal-text mb-4">
                Ready to Find Swiss Excellence?
              </h3>
              <p className="text-jobequal-text-muted mb-8 leading-relaxed">
                Join leading Swiss companies in discovering exceptional talent through 
                our premium recruitment platform.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 bg-jobequal-green text-white px-8 py-4 rounded-2xl font-bold hover:bg-jobequal-green-hover shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <span>Start Hiring Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
