import { Navigation } from '../components/Navigation';
import { 
  Target, 
  Heart, 
  Award, 
  Users, 
  TrendingUp, 
  Shield,
  Mountain,
  Clock,
  Globe,
  CheckCircle,
  Zap,
  Crown,
  Star,
  Gem,
  Compass,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const teamMembers = [
  {
    name: 'Dr. Sarah Müller',
    role: 'Founder & CEO',
    avatar: '👩‍💼',
    bio: 'Former McKinsey partner with 15 years in talent acquisition. ETH Zurich alumna passionate about revolutionizing career matching.',
    linkedin: 'https://linkedin.com/in/sarahmuller'
  },
  {
    name: 'Thomas Weber',
    role: 'CTO & Co-Founder',
    avatar: '👨‍💻',
    bio: 'AI researcher from EPFL with expertise in machine learning and natural language processing. Previously at Google Research.',
    linkedin: 'https://linkedin.com/in/thomasweber'
  },
  {
    name: 'Marie Dubois',
    role: 'Head of Design',
    avatar: '👩‍🎨',
    bio: 'Swiss design expert with background in luxury brands. Believes in creating experiences that reflect Swiss precision and elegance.',
    linkedin: 'https://linkedin.com/in/mariedubois'
  },
  {
    name: 'Marco Rossi',
    role: 'Head of Business Development',
    avatar: '👨‍💼',
    bio: 'Former head of partnerships at LinkedIn Europe. Specializes in building relationships with Switzerland\'s leading employers.',
    linkedin: 'https://linkedin.com/in/marcorossi'
  }
];

const stats = [
  { label: 'Companies Trust Us', value: '2,500+', icon: Building },
  { label: 'Successful Placements', value: '50,000+', icon: CheckCircle },
  { label: 'AI Match Accuracy', value: '96%', icon: Target },
  { label: 'User Satisfaction', value: '4.9/5', icon: Star }
];

const values = [
  {
    title: 'Swiss Precision',
    description: 'Every algorithm, every match, every interaction is crafted with the meticulous attention to detail that defines Swiss excellence.',
    icon: Target,
    color: 'from-jobequal-green to-jobequal-teal'
  },
  {
    title: 'Quality First',
    description: 'We believe in quality over quantity. Every candidate and company on our platform undergoes rigorous verification.',
    icon: Award,
    color: 'from-jobequal-blue-dark to-jobequal-green'
  },
  {
    title: 'Innovation',
    description: 'Combining cutting-edge AI with human expertise to create the most sophisticated job matching platform in Europe.',
    icon: Zap,
    color: 'from-jobequal-teal to-jobequal-blue'
  },
  {
    title: 'Trust & Integrity',
    description: 'Building lasting relationships based on transparency, reliability, and the Swiss values of honesty and dependability.',
    icon: Shield,
    color: 'from-yellow-400 to-orange-500'
  }
];

function TeamMemberCard({ member }: { member: typeof teamMembers[0] }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-full flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
        {member.avatar}
      </div>
      
      <h3 className="text-xl font-bold text-jobequal-text mb-2">{member.name}</h3>
      <p className="text-jobequal-green font-semibold mb-4">{member.role}</p>
      <p className="text-jobequal-text-muted leading-relaxed mb-6">{member.bio}</p>
      
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
      >
        <Linkedin className="w-4 h-4" />
        <span>Connect</span>
      </a>
    </div>
  );
}

function ValueCard({ value }: { value: typeof values[0] }) {
  return (
    <div className="group">
      <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <value.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-jobequal-text mb-4">{value.title}</h3>
      <p className="text-jobequal-text-muted leading-relaxed">{value.description}</p>
    </div>
  );
}

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <Mountain className="w-12 h-12 text-red-600 mr-4" />
              <div className="text-red-600 font-bold text-lg tracking-wide uppercase">Swiss Made Excellence</div>
              <Mountain className="w-12 h-12 text-red-600 ml-4" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-jobequal-text mb-8 leading-tight">
              Crafted in Switzerland
              <span className="block text-jobequal-green">For the World</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed">
              JobEqual represents the pinnacle of Swiss engineering and design in talent acquisition. 
              We don't just match jobs — we match aspirations with opportunities, 
              creating careers that transform lives.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-jobequal-green mb-2">{stat.value}</div>
                <div className="text-jobequal-text-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Compass className="w-8 h-8 text-jobequal-green" />
                <span className="text-jobequal-green font-semibold text-lg">Our Story</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8 leading-tight">
                Born from Swiss Innovation
              </h2>
              
              <div className="space-y-6 text-lg text-jobequal-text-muted leading-relaxed">
                <p>
                  Founded in the heart of Zurich in 2022, JobEqual emerged from a simple yet profound realization: 
                  traditional job matching was fundamentally broken. It focused on keywords and qualifications, 
                  but ignored the human element — aspirations, values, and cultural fit.
                </p>
                
                <p>
                  Our founders, Dr. Sarah Müller and Thomas Weber, combined their expertise in talent acquisition 
                  and artificial intelligence to create something unprecedented: a platform that matches not just 
                  skills, but souls to their perfect professional home.
                </p>
                
                <p>
                  Rooted in Swiss values of precision, quality, and reliability, JobEqual has grown to become 
                  Europe's most trusted premium talent platform, serving over 2,500 companies and helping 
                  50,000+ professionals find their dream careers.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <Crown className="w-16 h-16 text-jobequal-green mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-jobequal-text mb-4">Swiss Excellence Award</h3>
                  <p className="text-jobequal-text-muted">
                    Recognized as "Switzerland's Most Innovative HR Technology" by Swiss Tech Awards 2024
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 text-center">
                    <Gem className="w-8 h-8 text-jobequal-green mx-auto mb-2" />
                    <div className="font-bold text-jobequal-text">Premium Quality</div>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 text-center">
                    <Mountain className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="font-bold text-jobequal-text">Swiss Made</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-b from-jobequal-neutral to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              Our Mission & Vision
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Driven by Swiss precision and global ambition
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-jobequal-text mb-6">Our Mission</h3>
              <p className="text-lg text-jobequal-text-muted leading-relaxed">
                To revolutionize how people find meaningful careers by creating the world's most precise 
                and human-centered job matching platform. We believe every person deserves a role that 
                not only matches their skills but ignites their passion and aligns with their values.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-green rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-jobequal-text mb-6">Our Vision</h3>
              <p className="text-lg text-jobequal-text-muted leading-relaxed">
                To become the global standard for premium talent acquisition, where Swiss quality meets 
                cutting-edge innovation. We envision a world where career transitions are seamless, 
                opportunities are accessible to all, and every hire is a perfect match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Swiss Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Mountain className="w-8 h-8 text-red-600 mr-3" />
              <span className="text-red-600 font-bold text-lg tracking-wide uppercase">Swiss Values</span>
              <Mountain className="w-8 h-8 text-red-600 ml-3" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              What Drives Us
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Every feature, every algorithm, every interaction is built on the foundation of Swiss excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} value={value} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-jobequal-neutral to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              Meet Our Swiss Team
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Passionate professionals from across Switzerland, united by a shared vision of 
              transforming how the world thinks about careers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-jobequal-green-light rounded-3xl p-8 max-w-2xl mx-auto">
              <Users className="w-12 h-12 text-jobequal-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-jobequal-text mb-4">Join Our Team</h3>
              <p className="text-jobequal-text-muted mb-6">
                We're always looking for exceptional talent to join our mission of revolutionizing careers
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center space-x-2 bg-jobequal-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors"
              >
                <span>View Open Positions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
                Get in Touch
              </h2>
              <p className="text-xl text-jobequal-text-muted mb-12 leading-relaxed">
                Experience Swiss-quality service and support. Our team is here to help you 
                discover the perfect career opportunity or find exceptional talent.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-jobequal-text">Headquarters</div>
                    <div className="text-jobequal-text-muted">Bahnhofstrasse 45, 8001 Zurich, Switzerland</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-jobequal-text">Email</div>
                    <div className="text-jobequal-text-muted">hello@jobequal.ch</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-jobequal-text">Phone</div>
                    <div className="text-jobequal-text-muted">+41 44 123 45 67</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-12">
                <a
                  href="https://linkedin.com/company/jobequal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-jobequal-green rounded-xl text-white hover:bg-jobequal-green-hover transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/jobequal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-jobequal-blue-dark rounded-xl text-white hover:bg-jobequal-blue-hover transition-colors"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl p-10">
              <div className="text-center mb-8">
                <Crown className="w-16 h-16 text-jobequal-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-jobequal-text mb-4">Ready to Experience Swiss Excellence?</h3>
                <p className="text-jobequal-text-muted">
                  Join thousands of professionals who trust JobEqual with their career journey
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/cv-upload"
                  className="block w-full bg-jobequal-green text-white py-4 px-6 rounded-xl font-semibold text-center hover:bg-jobequal-green-hover transition-colors"
                >
                  Upload Your CV
                </Link>
                <Link
                  to="/job-search"
                  className="block w-full border-2 border-jobequal-green text-jobequal-green py-4 px-6 rounded-xl font-semibold text-center hover:bg-jobequal-green hover:text-white transition-all duration-200"
                >
                  Browse Opportunities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
