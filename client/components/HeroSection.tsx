import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, MapPin, Calendar, Sparkles } from 'lucide-react';
import { RedwoodTreeBackground } from './RedwoodTreeBackground';

export function HeroSection() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Uploaded file:', file.name);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-jobequal-neutral to-jobequal-blue overflow-hidden min-h-[90vh] flex items-center">
      {/* Enhanced Redwood Tree Background */}
      <RedwoodTreeBackground />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-40">
        {/* Main Tagline */}
        <div className="text-center mb-20 lg:mb-24">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6 text-jobequal-green mr-3" />
            <span className="text-jobequal-text-muted font-medium text-lg tracking-wide uppercase">
              Swiss Quality Job Matching
            </span>
            <Sparkles className="w-6 h-6 text-jobequal-green ml-3" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-jobequal-text mb-8 leading-tight tracking-tight">
            We match
            <span className="text-jobequal-green block lg:inline lg:ml-4">aspirations,</span>
            <br />
            <span className="text-jobequal-text-muted">not just profiles</span>
          </h1>
          <p className="text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed font-light">
            Discover opportunities that align with your career goals and values.
            Experience Swiss-quality job matching that goes beyond traditional recruiting.
          </p>
        </div>

        {/* Split Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          {/* Left: CV Upload */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 lg:p-14 shadow-2xl border border-jobequal-neutral-dark hover:shadow-3xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-jobequal-text mb-6 leading-tight">
                Upload Your CV
              </h2>
              <p className="text-lg text-jobequal-text-muted mb-10 leading-relaxed">
                Let our AI analyze your skills and experience to find the perfect job matches for you.
                Experience Swiss precision in career matching.
              </p>

              <div className="relative mb-6">
                <Link
                  to="/cv-upload"
                  className="block w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-5 px-10 rounded-2xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 text-center"
                >
                  Upload Your CV
                </Link>
              </div>

              <p className="text-sm text-jobequal-text-muted font-medium">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          {/* Right: Job Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 lg:p-14 shadow-2xl border border-jobequal-neutral-dark hover:shadow-3xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-teal rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-jobequal-text mb-4 leading-tight">
                Browse Jobs
              </h2>
              <p className="text-lg text-jobequal-text-muted mb-10 leading-relaxed">
                Explore opportunities by location, role, and company type.
                Discover Switzerland's finest career opportunities.
              </p>

              <div className="space-y-6">
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-14 pr-5 py-5 rounded-2xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    <option value="">Select Location</option>
                    <option value="zurich">Zurich</option>
                    <option value="geneva">Geneva</option>
                    <option value="basel">Basel</option>
                    <option value="bern">Bern</option>
                    <option value="lausanne">Lausanne</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div className="relative">
                  <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full pl-14 pr-5 py-5 rounded-2xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    <option value="">Job Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <Link
                  to="/job-search"
                  className="block w-full bg-gradient-to-r from-jobequal-blue-dark to-jobequal-teal text-white py-5 px-10 rounded-2xl font-semibold hover:from-jobequal-blue-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-center"
                >
                  Search Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
