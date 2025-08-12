import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { FeaturedJobs } from '../components/FeaturedJobs';
import { Skeleton } from '../components/ui/skeleton';
import { Footer } from '../components/Footer';

interface Stats {
  activeJobs: string;
  registeredUsers: string;
  successRate: string;
}

interface Company {
  id: string;
  name: string;
}

export default function Index() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [featuredCompanies, setFeaturedCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, companiesResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/companies/featured')
        ]);

        if (!statsResponse.ok || !companiesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const statsData: Stats = await statsResponse.json();
        const companiesData: Company[] = await companiesResponse.json();
        setStats(statsData);
        setFeaturedCompanies(companiesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load page content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-background dark:bg-gray-900">
      <Navigation />
      <HeroSection />
      <FeaturedJobs />

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

          {error && <div className="text-center text-red-500">{error}</div>}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center mb-20">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-32" />)
            ) : (
              featuredCompanies.map((company) => (
                <div key={company.id} className="text-3xl font-bold text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-green dark:hover:text-jobequal-green transition-colors duration-200 cursor-pointer">
                  {company.name}
                </div>
              ))
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center group">
              <div className="text-6xl lg:text-7xl font-bold text-jobequal-green mb-4 group-hover:scale-110 transition-transform duration-200">
                {loading ? <Skeleton className="h-20 w-40 mx-auto" /> : stats?.activeJobs}
              </div>
              <div className="text-xl text-jobequal-text-muted font-medium">Active Jobs</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl lg:text-7xl font-bold text-jobequal-green mb-4 group-hover:scale-110 transition-transform duration-200">
                {loading ? <Skeleton className="h-20 w-40 mx-auto" /> : stats?.registeredUsers}
              </div>
              <div className="text-xl text-jobequal-text-muted font-medium">Registered Users</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl lg:text-7xl font-bold text-jobequal-green mb-4 group-hover:scale-110 transition-transform duration-200">
                {loading ? <Skeleton className="h-20 w-40 mx-auto" /> : stats?.successRate}
              </div>
              <div className="text-xl text-jobequal-text-muted font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
