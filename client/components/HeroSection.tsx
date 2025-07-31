import { useState } from 'react';
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: CV Upload */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-jobequal-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Upload Your CV
              </h2>
              <p className="text-muted-foreground mb-8">
                Let our AI analyze your skills and experience to find the perfect job matches for you.
              </p>
              
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="block w-full bg-jobequal-green text-white py-4 px-8 rounded-xl font-semibold hover:bg-jobequal-green-dark transition-colors duration-200 cursor-pointer"
                >
                  Choose File or Drop Here
                </label>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          {/* Right: Job Filter */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-jobequal-blue-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                Browse Jobs
              </h2>
              <p className="text-muted-foreground mb-8">
                Explore opportunities by location, role, and company type.
              </p>
              
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
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
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                  >
                    <option value="">Job Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <button className="w-full bg-jobequal-blue-dark text-white py-4 px-8 rounded-xl font-semibold hover:opacity-90 transition-opacity duration-200">
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
