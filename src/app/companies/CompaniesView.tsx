"use client";

import React, { useState, useMemo } from "react";
import {
  Building,
  MapPin,
  Users,
  Search,
  ExternalLink,
  Star,
  Briefcase,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

// This type should be generated from your Supabase schema
type Company = {
  id: string;
  name: string;
  logo_url: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  // These fields would need to be added or calculated
  openJobs: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
};

function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-jobequal-green/20">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green-light to-jobequal-blue rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {company.logo_url ? <img src={company.logo_url} alt={`${company.name} logo`} className="w-10 h-10 object-contain" /> : '🏢'}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-jobequal-text group-hover:text-jobequal-green transition-colors">{company.name}</h3>
              {company.verified && <CheckCircle className="w-5 h-5 text-jobequal-green" />}
            </div>
            <p className="text-jobequal-text-muted font-medium">{company.industry}</p>
          </div>
        </div>
      </div>
      <p className="text-jobequal-text-muted mb-6 leading-relaxed line-clamp-3">{company.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-jobequal-green" />
          <span className="text-sm text-jobequal-text-muted">{company.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-jobequal-blue" />
          <span className="text-sm text-jobequal-text-muted">{company.size} employees</span>
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-jobequal-teal" />
          <span className="text-sm text-jobequal-text-muted">{company.openJobs} open jobs</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-jobequal-text-muted">{company.rating} ({company.reviewCount})</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Link href={`/company/${company.id}`} className="flex-1 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white py-3 px-4 rounded-xl font-semibold text-center hover:from-jobequal-green-hover hover:to-jobequal-teal transition-all">
          View Profile
        </Link>
        {company.website && (
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="p-3 border border-jobequal-neutral-dark rounded-xl text-jobequal-text-muted hover:text-jobequal-green hover:border-jobequal-green transition-colors">
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function CompaniesView({ initialCompanies }: { initialCompanies: Company[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState(initialCompanies);
  const [isLoading, setIsLoading] = useState(false);

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return companies;
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, companies]);

  // In a real app, you would have a useEffect here to fetch filtered companies
  // from an API route when the search query changes.

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-jobequal-text mb-4">Discover Switzerland's Top Employers</h1>
            <p className="text-lg text-jobequal-text-muted max-w-3xl mx-auto">Connect with innovative companies and find your next career opportunity.</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative max-w-md mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jobequal-text-muted" />
            <input
              type="text"
              placeholder="Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent bg-white shadow-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company, index) => (
              <CompanyCard key={company.id} company={{...company, openJobs: 0, rating: 0, reviewCount: 0, verified: false}} />
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-16">
              <Building className="w-16 h-16 text-jobequal-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-jobequal-text mb-2">No companies found</h3>
              <p className="text-jobequal-text-muted">Try adjusting your search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
