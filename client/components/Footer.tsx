import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FooterLink {
  id: string;
  text: string;
  url: string;
}

interface FooterLinks {
  "For Job Seekers": FooterLink[];
  "For Employers": FooterLink[];
  "Company": FooterLink[];
}

export function Footer() {
  const [links, setLinks] = useState<FooterLinks | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/footer/links');
        const data: FooterLinks = await response.json();
        setLinks(data);
      } catch (error) {
        console.error('Failed to fetch footer links:', error);
      }
    };

    fetchLinks();
  }, []);

  return (
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

          {links && Object.entries(links).map(([category, linkList]) => (
            <div key={category}>
              <h4 className="font-bold text-jobequal-text mb-6 text-lg">{category}</h4>
              <ul className="space-y-3 text-jobequal-text-muted">
                {linkList.map((link) => (
                  <li key={link.id} className="hover:text-jobequal-green transition-colors duration-200">
                    <Link to={link.url}>{link.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-jobequal-neutral-dark mt-12 pt-8 text-center">
          <p className="text-jobequal-text-muted text-lg">
            &copy; {new Date().getFullYear()} JobEqual. All rights reserved. Designed with Swiss precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
