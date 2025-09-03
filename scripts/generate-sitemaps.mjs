import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// --- Configuration ---
const BASE_URL = 'https://jobequal.ch';
const SITEMAP_PATH = path.resolve(process.cwd(), 'public', 'sitemap.xml');

// --- Supabase Client ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not defined in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- Helper Functions ---
const generateUrlEntry = (loc, lastmod, changefreq = 'daily', priority = '0.8') => {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};


// --- Main Logic ---
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...');

  const today = new Date().toISOString().split('T')[0];
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // 1. Add static pages
  const staticPages = [
    '/',
    '/job-search',
    '/companies',
    '/about',
    '/contact',
    '/pricing',
    '/faq',
    '/privacy-policy',
    '/terms-of-service',
  ];

  staticPages.forEach(page => {
    sitemapContent += generateUrlEntry(`${BASE_URL}${page}`, today, 'weekly', page === '/' ? '1.0' : '0.8');
  });
  console.log(`✅ Added ${staticPages.length} static pages.`);

  // 2. Add job pages
  try {
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, updated_at')
      .eq('status', 'published');

    if (jobsError) throw jobsError;

    jobs.forEach(job => {
      const lastmod = new Date(job.updated_at).toISOString().split('T')[0];
      sitemapContent += generateUrlEntry(`${BASE_URL}/job/${job.id}`, lastmod, 'daily', '1.0');
    });
    console.log(`✅ Added ${jobs.length} job pages.`);
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }

  // 3. Add company pages
  try {
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, updated_at');

    if (companiesError) throw companiesError;

    companies.forEach(company => {
      const lastmod = new Date(company.updated_at).toISOString().split('T')[0];
      sitemapContent += generateUrlEntry(`${BASE_URL}/company/${company.id}`, lastmod, 'weekly', '0.9');
    });
    console.log(`✅ Added ${companies.length} company pages.`);
  } catch (error) {
    console.error('Error fetching companies:', error);
  }

  sitemapContent += `
</urlset>`;

  // 4. Write the sitemap file
  try {
    fs.writeFileSync(SITEMAP_PATH, sitemapContent);
    console.log(`✅ Sitemap successfully generated at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error('Error writing sitemap file:', error);
  }
}

generateSitemap();
