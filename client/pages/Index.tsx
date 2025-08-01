import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { FeaturedJobs } from '../components/FeaturedJobs';
import { LanguageTest } from '../components/LanguageTest';

export default function Index() {
  return (
    <main className="min-h-screen bg-background dark:bg-gray-900">
      <Navigation />
      <HeroSection />
      <FeaturedJobs />
      <LanguageTest />

      {/* Trust & Stats Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-jobequal-text dark:text-white mb-6 leading-tight">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who found their dream job through JobEqual's
              Swiss-quality matching platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center mb-20">
            <div className="text-3xl font-bold text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-green dark:hover:text-jobequal-green transition-colors duration-200 cursor-pointer">UBS</div>
            <div className="text-3xl font-bold text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-green dark:hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Nestlé</div>
            <div className="text-3xl font-bold text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-green dark:hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Roche</div>
            <div className="text-3xl font-bold text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-green dark:hover:text-jobequal-green transition-colors duration-200 cursor-pointer">ABB</div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="text-6xl lg:text-7xl font-bold text-jobequal-green mb-4 group-hover:scale-110 transition-transform duration-200">10,000+</div>
              <div className="text-xl text-jobequal-text-muted font-medium">Active Jobs</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl lg:text-7xl font-bold text-jobequal-green mb-4 group-hover:scale-110 transition-transform duration-200">50,000+</div>
              <div className="text-xl text-jobequal-text-muted font-medium">Registered Users</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl lg:text-7xl font-bold text-jobequal-green mb-4 group-hover:scale-110 transition-transform duration-200">95%</div>
              <div className="text-xl text-jobequal-text-muted font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-jobequal-neutral to-jobequal-neutral-dark py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">J</span>
                </div>
                <span className="text-2xl font-bold text-jobequal-text">JobEqual</span>
              </div>
              <p className="text-jobequal-text-muted leading-relaxed text-lg">
                Matching aspirations with opportunities across Switzerland.
                Swiss-quality job matching for exceptional professionals.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-jobequal-text mb-6 text-lg">For Job Seekers</h4>
              <ul className="space-y-3 text-jobequal-text-muted">
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Browse Jobs</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Upload CV</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Career Tips</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Salary Guide</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-jobequal-text mb-6 text-lg">For Employers</h4>
              <ul className="space-y-3 text-jobequal-text-muted">
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Post Jobs</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Find Candidates</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Pricing</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Resources</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-jobequal-text mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-jobequal-text-muted">
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">About Us</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Contact</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-jobequal-neutral-dark mt-12 pt-8 text-center">
            <p className="text-jobequal-text-muted text-lg">
              &copy; 2024 JobEqual. All rights reserved. Designed with Swiss precision.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
