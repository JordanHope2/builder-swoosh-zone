import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import {
  Target,
  Award,
  Users,
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
  Twitter,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../components/ui/skeleton';

const iconMap = {
  Target,
  Award,
  Users,
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
  Twitter,
  Building
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  linkedin_url: string;
}

interface Stat {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof iconMap;
}

interface Value {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
  color: string;
}

interface AboutPageData {
  teamMembers: TeamMember[];
  stats: Stat[];
  values: Value[];
  content: Record<string, string>;
}

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-full flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
        {member.avatar}
      </div>
      
      <h3 className="text-xl font-bold text-jobequal-text mb-2">{member.name}</h3>
      <p className="text-jobequal-green font-semibold mb-4">{member.role}</p>
      <p className="text-jobequal-text-muted leading-relaxed mb-6">{member.bio}</p>
      
      <a
        href={member.linkedin_url}
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

function ValueCard({ value }: { value: Value }) {
  const Icon = iconMap[value.icon];
  return (
    <div className="group">
      <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-jobequal-text mb-4">{value.title}</h3>
      <p className="text-jobequal-text-muted leading-relaxed">{value.description}</p>
    </div>
  );
}

export default function About() {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch About page data');
        }
        const pageData: AboutPageData = await response.json();
        setData(pageData);
      } catch (error) {
        console.error(error);
        setError('Failed to load page content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <Skeleton className="h-12 w-1/2 mx-auto mb-8" />
          <Skeleton className="h-8 w-3/4 mx-auto mb-16" />
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <Skeleton className="h-8 w-1/4 mb-6" />
              <Skeleton className="h-12 w-3/4 mb-8" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl text-red-500">{error}</h1>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const { teamMembers, stats, values, content } = data;

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
              <div className="text-red-600 font-bold text-lg tracking-wide uppercase">{content.hero_supertitle}</div>
              <Mountain className="w-12 h-12 text-red-600 ml-4" />
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-jobequal-text mb-8 leading-tight">
              {content.hero_title_line1}
              <span className="block text-jobequal-green">{content.hero_title_line2}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed">
              {content.hero_subtitle}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon];
              return (
                <div key={stat.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark text-center hover:shadow-xl transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-jobequal-green mb-2">{stat.value}</div>
                  <div className="text-jobequal-text-muted font-medium">{stat.label}</div>
                </div>
              );
            })}
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
                <span className="text-jobequal-green font-semibold text-lg">{content.story_supertitle}</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8 leading-tight">
                {content.story_title}
              </h2>
              
              <div className="space-y-6 text-lg text-jobequal-text-muted leading-relaxed">
                <p>{content.story_p1}</p>
                <p>{content.story_p2}</p>
                <p>{content.story_p3}</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <Crown className="w-16 h-16 text-jobequal-green mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-jobequal-text mb-4">{content.award_title}</h3>
                  <p className="text-jobequal-text-muted">{content.award_subtitle}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-xl p-4 text-center">
                    <Gem className="w-8 h-8 text-jobequal-green mx-auto mb-2" />
                    <div className="font-bold text-jobequal-text">{content.badge1_text}</div>
                  </div>
                  <div className="bg-white/50 rounded-xl p-4 text-center">
                    <Mountain className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <div className="font-bold text-jobequal-text">{content.badge2_text}</div>
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
              {content.mission_vision_title}
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              {content.mission_vision_subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-jobequal-text mb-6">Our Mission</h3>
              <p className="text-lg text-jobequal-text-muted leading-relaxed">
                {content.mission_text}
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-green rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-jobequal-text mb-6">Our Vision</h3>
              <p className="text-lg text-jobequal-text-muted leading-relaxed">
                {content.vision_text}
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
              <span className="text-red-600 font-bold text-lg tracking-wide uppercase">{content.values_supertitle}</span>
              <Mountain className="w-8 h-8 text-red-600 ml-3" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              {content.values_title}
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              {content.values_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <ValueCard key={value.id} value={value} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-jobequal-neutral to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              {content.team_title}
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              {content.team_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-jobequal-green-light rounded-3xl p-8 max-w-2xl mx-auto">
              <Users className="w-12 h-12 text-jobequal-green mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-jobequal-text mb-4">{content.join_team_title}</h3>
              <p className="text-jobequal-text-muted mb-6">
                {content.join_team_subtitle}
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center space-x-2 bg-jobequal-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors"
              >
                <span>{content.join_team_button_text}</span>
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
                {content.contact_title}
              </h2>
              <p className="text-xl text-jobequal-text-muted mb-12 leading-relaxed">
                {content.contact_subtitle}
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-jobequal-text">Headquarters</div>
                    <div className="text-jobequal-text-muted">{content.contact_address}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-jobequal-text">Email</div>
                    <div className="text-jobequal-text-muted">{content.contact_email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-jobequal-text">Phone</div>
                    <div className="text-jobequal-text-muted">{content.contact_phone}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-12">
                <a
                  href={content.contact_linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-jobequal-green rounded-xl text-white hover:bg-jobequal-green-hover transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href={content.contact_twitter_url}
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
                <h3 className="text-2xl font-bold text-jobequal-text mb-4">{content.cta_title}</h3>
                <p className="text-jobequal-text-muted">
                  {content.cta_subtitle}
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/cv-upload"
                  className="block w-full bg-jobequal-green text-white py-4 px-6 rounded-xl font-semibold text-center hover:bg-jobequal-green-hover transition-colors"
                >
                  {content.cta_button1_text}
                </Link>
                <Link
                  to="/job-search"
                  className="block w-full border-2 border-jobequal-green text-jobequal-green py-4 px-6 rounded-xl font-semibold text-center hover:bg-jobequal-green hover:text-white transition-all duration-200"
                >
                  {content.cta_button2_text}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
