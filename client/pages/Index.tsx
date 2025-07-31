import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { FeaturedJobs } from '../components/FeaturedJobs';

export default function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedJobs />

      {/* Trust & Stats Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-jobequal-text mb-6 leading-tight">
              Trusted by Leading Companies
            </h2>
            <p className="text-xl text-jobequal-text-muted max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who found their dream job through JobEqual's
              Swiss-quality matching platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center mb-20">
            <div className="text-3xl font-bold text-jobequal-text-muted hover:text-jobequal-green transition-colors duration-200 cursor-pointer">UBS</div>
            <div className="text-3xl font-bold text-jobequal-text-muted hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Nestlé</div>
            <div className="text-3xl font-bold text-jobequal-text-muted hover:text-jobequal-green transition-colors duration-200 cursor-pointer">Roche</div>
            <div className="text-3xl font-bold text-jobequal-text-muted hover:text-jobequal-green transition-colors duration-200 cursor-pointer">ABB</div>
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
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-jobequal-green rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <span className="text-xl font-bold text-foreground">JobEqual</span>
              </div>
              <p className="text-muted-foreground">
                Matching aspirations with opportunities across Switzerland.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Browse Jobs</li>
                <li>Upload CV</li>
                <li>Career Tips</li>
                <li>Salary Guide</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">For Employers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Post Jobs</li>
                <li>Find Candidates</li>
                <li>Pricing</li>
                <li>Resources</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 JobEqual. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
