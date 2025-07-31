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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Trusted by Leading Companies
            </h2>
            <p className="text-muted-foreground">
              Join thousands of professionals who found their dream job through JobEqual
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">Google</div>
            <div className="text-2xl font-bold text-muted-foreground">Microsoft</div>
            <div className="text-2xl font-bold text-muted-foreground">Netflix</div>
            <div className="text-2xl font-bold text-muted-foreground">Spotify</div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-jobequal-green mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-jobequal-green mb-2">50,000+</div>
              <div className="text-muted-foreground">Registered Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-jobequal-green mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
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
