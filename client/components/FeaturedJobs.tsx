import { MapPin, Clock, Building, Heart, Star, TrendingUp } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  logo: string;
  featured?: boolean;
}

const featuredJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Zurich',
    location: 'Zurich',
    salary: 'CHF 120,000 - 140,000',
    type: 'Full-time',
    logo: '🚀',
    featured: true,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCH',
    location: 'Geneva',
    salary: 'CHF 110,000 - 130,000',
    type: 'Full-time',
    logo: '💡',
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'Basel',
    salary: 'CHF 85,000 - 105,000',
    type: 'Full-time',
    logo: '🎨',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'DataDriven AG',
    location: 'Bern',
    salary: 'CHF 100,000 - 120,000',
    type: 'Full-time',
    logo: '📊',
    featured: true,
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Remote',
    salary: 'CHF 95,000 - 115,000',
    type: 'Full-time',
    logo: '☁️',
  },
  {
    id: '6',
    title: 'Marketing Director',
    company: 'GrowthCo',
    location: 'Lausanne',
    salary: 'CHF 130,000 - 150,000',
    type: 'Full-time',
    logo: '📈',
  },
];

function JobCard({ job }: { job: Job }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
      {job.featured && (
        <div className="flex items-center justify-between mb-4">
          <span className="bg-jobequal-green text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
          <button className="text-muted-foreground hover:text-jobequal-green transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-jobequal-green-light rounded-xl flex items-center justify-center text-2xl">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-jobequal-green transition-colors">
            {job.title}
          </h3>
          <p className="text-muted-foreground">{job.company}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          {job.type}
        </div>
        <div className="flex items-center text-sm text-jobequal-green font-semibold">
          <Building className="w-4 h-4 mr-2" />
          {job.salary}
        </div>
      </div>
      
      <button className="w-full bg-jobequal-green-light text-jobequal-green-dark py-3 rounded-xl font-medium hover:bg-jobequal-green hover:text-white transition-all duration-200">
        View Details
      </button>
    </div>
  );
}

export function FeaturedJobs() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover hand-picked job opportunities from top Swiss companies
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        
        <div className="text-center">
          <button className="bg-jobequal-green text-white px-8 py-4 rounded-xl font-semibold hover:bg-jobequal-green-dark transition-colors duration-200">
            View All Jobs
          </button>
        </div>
      </div>
    </section>
  );
}
