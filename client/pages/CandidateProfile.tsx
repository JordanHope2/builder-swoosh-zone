import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2,
  Save,
  Upload,
  Eye,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Award,
  Book,
  Briefcase,
  Code,
  Star,
  Target,
  CheckCircle
} from 'lucide-react';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language';
}

const mockProfile = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@email.com',
    phone: '+41 79 123 45 67',
    location: 'Zurich, Switzerland',
    dateOfBirth: '1990-05-15',
    website: 'https://alexjohnson.dev',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    summary: 'Passionate Senior Software Engineer with 8+ years of experience building scalable web applications. Expertise in React, TypeScript, and cloud technologies. Proven track record of leading teams and delivering high-quality products.'
  },
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp AG',
      location: 'Zurich, Switzerland',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead development of microservices architecture serving 2M+ users. Built React applications with TypeScript, implemented CI/CD pipelines, and mentored junior developers.'
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'InnovateCH',
      location: 'Geneva, Switzerland',
      startDate: '2019-06',
      endDate: '2021-02',
      current: false,
      description: 'Developed full-stack applications using React, Node.js, and PostgreSQL. Improved application performance by 40% and reduced deployment time by 60%.'
    }
  ] as Experience[],
  education: [
    {
      id: '1',
      degree: 'Master of Science in Computer Science',
      school: 'ETH Zurich',
      location: 'Zurich, Switzerland',
      startDate: '2013-09',
      endDate: '2016-07',
      gpa: '5.8/6.0',
      description: 'Specialized in Machine Learning and Distributed Systems. Thesis on "Scalable Web Applications in the Cloud".'
    },
    {
      id: '2',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Zurich',
      location: 'Zurich, Switzerland',
      startDate: '2010-09',
      endDate: '2013-07',
      gpa: '5.5/6.0',
      description: 'Strong foundation in computer science fundamentals, algorithms, and software engineering.'
    }
  ] as Education[],
  skills: [
    { id: '1', name: 'React', level: 'Expert', category: 'Technical' },
    { id: '2', name: 'TypeScript', level: 'Expert', category: 'Technical' },
    { id: '3', name: 'Node.js', level: 'Advanced', category: 'Technical' },
    { id: '4', name: 'Python', level: 'Advanced', category: 'Technical' },
    { id: '5', name: 'AWS', level: 'Intermediate', category: 'Technical' },
    { id: '6', name: 'Team Leadership', level: 'Advanced', category: 'Soft' },
    { id: '7', name: 'German', level: 'Expert', category: 'Language' },
    { id: '8', name: 'English', level: 'Expert', category: 'Language' },
    { id: '9', name: 'French', level: 'Intermediate', category: 'Language' }
  ] as Skill[]
};

function PersonalInfoSection() {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(mockProfile.personalInfo);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-jobequal-text flex items-center">
          <User className="w-6 h-6 mr-3 text-jobequal-green" />
          Personal Information
        </h2>
        <button
          onClick={() => setEditing(!editing)}
          className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>{editing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {editing ? (
        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-jobequal-text font-semibold mb-2">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full p-3 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-jobequal-text font-semibold mb-2">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full p-3 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-jobequal-text font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-jobequal-text font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-jobequal-text font-semibold mb-2">Professional Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              rows={4}
              className="w-full p-3 rounded-xl border border-jobequal-neutral-dark focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-6 py-3 bg-jobequal-neutral text-jobequal-text rounded-xl hover:bg-jobequal-neutral-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-jobequal-green text-white rounded-xl hover:bg-jobequal-green-hover transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-jobequal-text-muted mb-1">Name</div>
              <div className="text-lg font-semibold text-jobequal-text">
                {formData.firstName} {formData.lastName}
              </div>
            </div>
            <div>
              <div className="text-sm text-jobequal-text-muted mb-1">Location</div>
              <div className="text-lg text-jobequal-text flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-jobequal-green" />
                {formData.location}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-jobequal-text-muted mb-1">Email</div>
              <div className="text-lg text-jobequal-text flex items-center">
                <Mail className="w-4 h-4 mr-2 text-jobequal-green" />
                {formData.email}
              </div>
            </div>
            <div>
              <div className="text-sm text-jobequal-text-muted mb-1">Phone</div>
              <div className="text-lg text-jobequal-text flex items-center">
                <Phone className="w-4 h-4 mr-2 text-jobequal-green" />
                {formData.phone}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-jobequal-text-muted mb-3">Professional Summary</div>
            <p className="text-jobequal-text leading-relaxed">{formData.summary}</p>
          </div>

          <div className="flex space-x-4">
            {formData.website && (
              <a
                href={formData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {formData.linkedin && (
              <a
                href={formData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {formData.github && (
              <a
                href={formData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ExperienceSection() {
  const [experiences, setExperiences] = useState(mockProfile.experience);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-jobequal-text flex items-center">
          <Briefcase className="w-6 h-6 mr-3 text-jobequal-green" />
          Work Experience
        </h2>
        <button className="flex items-center space-x-2 bg-jobequal-green text-white px-4 py-2 rounded-xl hover:bg-jobequal-green-hover transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="border border-jobequal-neutral-dark rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-jobequal-text">{exp.title}</h3>
                <p className="text-lg text-jobequal-green font-semibold">{exp.company}</p>
                <p className="text-jobequal-text-muted flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {exp.location}
                </p>
                <p className="text-sm text-jobequal-text-muted flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  {exp.current && (
                    <span className="ml-2 bg-jobequal-green text-white text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-jobequal-text-muted hover:text-jobequal-green transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-jobequal-text-muted hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-jobequal-text-muted leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection() {
  const [skills] = useState(mockProfile.skills);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-jobequal-green text-white';
      case 'Advanced': return 'bg-jobequal-blue-dark text-white';
      case 'Intermediate': return 'bg-yellow-500 text-white';
      default: return 'bg-jobequal-neutral text-jobequal-text';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-jobequal-text flex items-center">
          <Code className="w-6 h-6 mr-3 text-jobequal-green" />
          Skills & Expertise
        </h2>
        <button className="flex items-center space-x-2 bg-jobequal-green text-white px-4 py-2 rounded-xl hover:bg-jobequal-green-hover transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-jobequal-text mb-4">{category} Skills</h3>
            <div className="flex flex-wrap gap-3">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <span className="bg-jobequal-green-light text-jobequal-green-dark px-3 py-2 rounded-xl font-medium">
                    {skill.name}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSkillColor(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CandidateProfile() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text mb-4">
            My Profile
          </h1>
          <p className="text-xl text-jobequal-text-muted">
            Manage your professional information to get better job matches
          </p>
        </div>

        {/* Profile Completion Banner */}
        <div className="bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-3xl p-6 mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Target className="w-6 h-6 text-white" />
            <span className="text-2xl font-bold text-white">85% Complete</span>
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="text-white/90">
            Complete your profile to unlock better AI job matching
          </p>
        </div>

        {/* CV Upload Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-jobequal-text flex items-center">
              <FileText className="w-6 h-6 mr-3 text-jobequal-green" />
              Resume/CV
            </h2>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button className="flex items-center space-x-2 bg-jobequal-green text-white px-4 py-2 rounded-xl hover:bg-jobequal-green-hover transition-colors">
                <Upload className="w-4 h-4" />
                <span>Update CV</span>
              </button>
            </div>
          </div>
          
          <div className="bg-jobequal-green-light rounded-2xl p-6 text-center">
            <FileText className="w-12 h-12 text-jobequal-green mx-auto mb-4" />
            <h3 className="font-semibold text-jobequal-green-dark mb-2">alex_johnson_cv.pdf</h3>
            <p className="text-sm text-jobequal-text-muted">Last updated: January 15, 2024</p>
          </div>
        </div>

        {/* Profile Sections */}
        <PersonalInfoSection />
        <ExperienceSection />
        <SkillsSection />

        {/* Education Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-jobequal-neutral-dark">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-jobequal-text flex items-center">
              <Book className="w-6 h-6 mr-3 text-jobequal-green" />
              Education
            </h2>
            <button className="flex items-center space-x-2 bg-jobequal-green text-white px-4 py-2 rounded-xl hover:bg-jobequal-green-hover transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-6">
            {mockProfile.education.map((edu) => (
              <div key={edu.id} className="border border-jobequal-neutral-dark rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-jobequal-text">{edu.degree}</h3>
                    <p className="text-lg text-jobequal-green font-semibold">{edu.school}</p>
                    <p className="text-jobequal-text-muted flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {edu.location}
                    </p>
                    <p className="text-sm text-jobequal-text-muted flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {edu.startDate} - {edu.endDate}
                      {edu.gpa && (
                        <span className="ml-4 bg-jobequal-green-light text-jobequal-green-dark px-2 py-1 rounded-full text-xs">
                          GPA: {edu.gpa}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-jobequal-text-muted hover:text-jobequal-green transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-jobequal-text-muted hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-jobequal-text-muted leading-relaxed">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
