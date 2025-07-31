import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Shield,
  Mountain,
  CheckCircle,
  Star,
  Award,
  Users,
  Globe,
  Linkedin,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const supportTypes = [
  {
    title: 'Job Seekers',
    description: 'Get help with your profile, job applications, and career guidance',
    icon: Users,
    color: 'from-jobequal-green to-jobequal-teal',
    email: 'candidates@jobequal.ch',
    phone: '+41 44 123 45 67'
  },
  {
    title: 'Employers',
    description: 'Support for job postings, candidate management, and recruitment strategy',
    icon: Award,
    color: 'from-jobequal-blue-dark to-jobequal-green',
    email: 'employers@jobequal.ch',
    phone: '+41 44 123 45 68'
  },
  {
    title: 'Technical Support',
    description: 'Platform issues, account problems, and technical assistance',
    icon: Headphones,
    color: 'from-jobequal-teal to-jobequal-blue',
    email: 'support@jobequal.ch',
    phone: '+41 44 123 45 69'
  }
];

const offices = [
  {
    city: 'Zurich',
    address: 'Bahnhofstrasse 45, 8001 Zurich',
    phone: '+41 44 123 45 67',
    email: 'zurich@jobequal.ch',
    hours: 'Mon-Fri: 8:00-18:00',
    isHQ: true
  },
  {
    city: 'Geneva',
    address: 'Rue du Rhône 12, 1204 Geneva',
    phone: '+41 22 123 45 67',
    email: 'geneva@jobequal.ch',
    hours: 'Mon-Fri: 8:00-17:00',
    isHQ: false
  },
  {
    city: 'Basel',
    address: 'Freie Strasse 8, 4001 Basel',
    phone: '+41 61 123 45 67',
    email: 'basel@jobequal.ch',
    hours: 'Mon-Fri: 8:00-17:00',
    isHQ: false
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    userType: 'job-seeker'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <Mountain className="w-12 h-12 text-red-600 mr-4" />
            <div className="text-red-600 font-bold text-lg tracking-wide uppercase">Swiss Quality Support</div>
            <Mountain className="w-12 h-12 text-red-600 ml-4" />
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-jobequal-text mb-8 leading-tight">
            We're Here to
            <span className="block text-jobequal-green">Help You Succeed</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed">
            Experience world-class support with Swiss precision and care. 
            Our dedicated team is committed to your success at every step of your journey.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-jobequal-text mb-2">24/7 Support</h3>
              <p className="text-jobequal-text-muted">Round-the-clock assistance when you need it most</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-jobequal-text mb-2">Swiss Quality</h3>
              <p className="text-jobequal-text-muted">Meticulous attention to detail in every interaction</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg text-jobequal-text mb-2">Expert Team</h3>
              <p className="text-jobequal-text-muted">Career specialists and technical experts at your service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              How Can We Help?
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Choose your support path for personalized assistance from our Swiss-trained specialists
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {supportTypes.map((type, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <type.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-jobequal-text mb-4">{type.title}</h3>
                <p className="text-jobequal-text-muted leading-relaxed mb-6">{type.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-jobequal-green" />
                    <a href={`mailto:${type.email}`} className="text-jobequal-green hover:text-jobequal-green-dark transition-colors">
                      {type.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-jobequal-green" />
                    <a href={`tel:${type.phone}`} className="text-jobequal-green hover:text-jobequal-green-dark transition-colors">
                      {type.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-b from-jobequal-neutral to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
                Send Us a Message
              </h2>
              <p className="text-xl text-jobequal-text-muted mb-8 leading-relaxed">
                Have a specific question or need personalized assistance? 
                Our Swiss-trained support team will respond within 24 hours.
              </p>

              <div className="bg-jobequal-green-light rounded-2xl p-6 mb-8">
                <h3 className="font-bold text-jobequal-green-dark mb-4">Why Choose JobEqual Support?</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                    <span className="text-jobequal-text-muted">Swiss-quality service standards</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                    <span className="text-jobequal-text-muted">Multilingual support team</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                    <span className="text-jobequal-text-muted">Career coaching expertise</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-jobequal-green flex-shrink-0" />
                    <span className="text-jobequal-text-muted">Priority response guarantee</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center space-x-6">
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

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-jobequal-neutral-dark">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">Company (Optional)</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-jobequal-text font-semibold mb-3">I am a</label>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({...formData, userType: e.target.value})}
                      className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    >
                      <option value="job-seeker">Job Seeker</option>
                      <option value="employer">Employer</option>
                      <option value="partner">Business Partner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-jobequal-text font-semibold mb-3">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full p-4 rounded-xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-8">
              Visit Our Swiss Offices
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-3xl mx-auto leading-relaxed">
              Meet our team in person at our locations across Switzerland
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className={`bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark hover:shadow-2xl transition-all duration-300 ${office.isHQ ? 'ring-2 ring-jobequal-green' : ''}`}>
                {office.isHQ && (
                  <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white px-4 py-2 rounded-full text-sm font-bold mb-4 text-center">
                    Headquarters
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-jobequal-text mb-2">{office.city}</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-xl flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="font-semibold text-jobequal-text mb-1">Address</div>
                    <div className="text-jobequal-text-muted">{office.address}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-jobequal-text mb-1">Phone</div>
                    <a href={`tel:${office.phone}`} className="text-jobequal-green hover:text-jobequal-green-dark transition-colors">
                      {office.phone}
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-jobequal-text mb-1">Email</div>
                    <a href={`mailto:${office.email}`} className="text-jobequal-green hover:text-jobequal-green-dark transition-colors">
                      {office.email}
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-jobequal-text mb-1">Hours</div>
                    <div className="text-jobequal-text-muted">{office.hours}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-jobequal-neutral to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-3xl p-12">
            <MessageCircle className="w-16 h-16 text-jobequal-green mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-jobequal-text mb-6">
              Ready to Experience Swiss Excellence?
            </h2>
            <p className="text-xl text-jobequal-text-muted mb-8 leading-relaxed">
              Join thousands of professionals who trust JobEqual with their career journey. 
              Start your success story today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cv-upload"
                className="bg-jobequal-green text-white px-8 py-4 rounded-xl font-bold hover:bg-jobequal-green-hover transition-colors"
              >
                Upload Your CV
              </Link>
              <Link
                to="/job-search"
                className="border-2 border-jobequal-green text-jobequal-green px-8 py-4 rounded-xl font-bold hover:bg-jobequal-green hover:text-white transition-all duration-200"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
