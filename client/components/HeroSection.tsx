import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, MapPin, Calendar, Sparkles, FileText, ChevronDown } from 'lucide-react';
import { RedwoodTreeBackground } from './RedwoodTreeBackground';
import { useLanguage } from '../contexts/LanguageContext';

export function HeroSection() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-jobequal-neutral to-jobequal-blue overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Enhanced Redwood Tree Background */}
      <RedwoodTreeBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        {/* Main Tagline */}
        <div className={`text-center mb-16 sm:mb-20 lg:mb-24 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-jobequal-green mr-2 sm:mr-3 animate-pulse-soft" />
            <span className="text-jobequal-text-muted font-medium text-sm sm:text-base lg:text-lg tracking-wide uppercase">
              Swiss Quality Job Matching
            </span>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-jobequal-green ml-2 sm:ml-3 animate-pulse-soft" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-jobequal-text mb-6 sm:mb-8 leading-tight tracking-tight">
            We match
            <span className="text-jobequal-green block sm:inline lg:ml-4 animate-gradient-x bg-gradient-to-r from-jobequal-green to-jobequal-teal bg-clip-text text-transparent">aspirations,</span>
            <br className="hidden sm:block" />
            <span className="text-jobequal-text-muted text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">not just profiles</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-jobequal-text-muted max-w-4xl mx-auto leading-relaxed font-light px-4">
            Discover opportunities that align with your career goals and values.
            Experience Swiss-quality job matching that goes beyond traditional recruiting.
          </p>
        </div>

        {/* Split Hero Section */}
        <div className={`grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-stretch transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Left: CV Upload */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-14 shadow-2xl border border-jobequal-neutral-dark hover:shadow-3xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg group-hover:scale-105 transition-transform duration-300">
                {isUploading ? (
                  <div className="relative">
                    <div className="animate-spin w-8 h-8 sm:w-10 sm:h-10 border-2 border-white border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jobequal-text mb-4 sm:mb-6 leading-tight">
                {t('hero.cta_secondary')}
              </h2>
              <p className="text-base sm:text-lg text-jobequal-text-muted mb-8 sm:mb-10 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              <div className="relative mb-6">
                {isUploading && (
                  <div className="mb-4">
                    <div className="w-full bg-jobequal-neutral-dark rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-jobequal-green to-jobequal-teal h-2 rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-jobequal-text-muted mt-2">Uploading... {uploadProgress}%</p>
                  </div>
                )}
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={isUploading}
                  />
                  <div className={`w-full bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-4 sm:py-5 px-6 sm:px-10 rounded-xl sm:rounded-2xl font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105 text-center flex items-center justify-center space-x-3 ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}>
                    <FileText className="w-5 h-5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Your CV'}</span>
                  </div>
                </div>
                <Link
                  to="/cv-upload"
                  className="block w-full mt-3 text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors duration-200 text-sm"
                >
                  Or use our advanced upload page
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-jobequal-text-muted font-medium">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          {/* Right: Job Filter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-14 shadow-2xl border border-jobequal-neutral-dark hover:shadow-3xl transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-jobequal-blue-dark to-jobequal-teal rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jobequal-text mb-4 sm:mb-6 leading-tight">
                Browse Jobs
              </h2>
              <p className="text-base sm:text-lg text-jobequal-text-muted mb-8 sm:mb-10 leading-relaxed">
                Explore opportunities by location, role, and company type.
                Discover Switzerland's finest career opportunities.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <MapPin className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-jobequal-text-muted" />
                  <ChevronDown className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-jobequal-text-muted pointer-events-none" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 font-medium appearance-none cursor-pointer"
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
                  <Calendar className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-jobequal-text-muted" />
                  <ChevronDown className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-jobequal-text-muted pointer-events-none" />
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-jobequal-neutral-dark bg-white text-jobequal-text focus:ring-2 focus:ring-jobequal-green focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200 font-medium appearance-none cursor-pointer"
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
                  className="block w-full bg-gradient-to-r from-jobequal-blue-dark to-jobequal-teal text-white py-4 sm:py-5 px-6 sm:px-10 rounded-xl sm:rounded-2xl font-semibold hover:from-jobequal-blue-hover hover:to-jobequal-teal shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-center"
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
