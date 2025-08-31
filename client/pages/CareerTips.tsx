import { motion } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  Users,
  Target,
  Clock,
  FileText,
  MessageCircle,
  ArrowRight,
  Star,
  Shield,
  Search,
  Eye,
  Heart,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Navigation } from "../components/Navigation";
import { PageHeader, SectionHeader } from "../components/ui/page-header";


interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
}

const categories = [
  { id: "all", label: "All Tips", icon: BookOpen },
  { id: "cv-resume", label: "CV & Resume", icon: FileText },
  { id: "interview", label: "Interview Prep", icon: MessageCircle },
  { id: "job-search", label: "Job Search", icon: Search },
  { id: "networking", label: "Networking", icon: Users },
  { id: "salary", label: "Salary Negotiation", icon: TrendingUp },
  { id: "career-growth", label: "Career Growth", icon: Target },
  { id: "swiss-market", label: "Swiss Market", icon: Shield },
];

const articles: Article[] = [
  {
    id: "1",
    title: "Crafting the Perfect Swiss CV: A Complete Guide for 2024",
    excerpt:
      "Master the art of Swiss CV writing with insider tips from local recruiters. Learn what makes Swiss employers take notice.",
    content: `Creating a standout CV for the Swiss job market requires understanding local expectations and cultural nuances. Here's your comprehensive guide:

**Essential Elements:**
• Professional photo (headshot, business attire)
• Personal details including nationality/work permit status
• Chronological format preferred by Swiss employers
• 2-3 pages maximum length
• German/French/English depending on region

**Swiss CV Structure:**
1. Personal Information & Photo
2. Professional Summary (2-3 lines)
3. Work Experience (reverse chronological)
4. Education & Certifications
5. Languages & Proficiency Levels
6. Skills & Technical Competencies
7. Additional Information (interests, volunteer work)

**Pro Tips:**
• Include your photo - it's expected and legal in Switzerland
• List languages with proficiency levels (A1-C2)
• Mention your work permit status clearly
• Use clean, professional formatting
• Tailor keywords to the job description
• Include concrete achievements with numbers

**Common Mistakes to Avoid:**
• Forgetting to include a professional photo
��� Not mentioning work permit status
• Using creative layouts (Swiss prefer traditional)
• Listing irrelevant work experience
• Poor German/French translations`,
    author: "Sarah Miller, HR Expert",
    publishDate: "2024-01-15",
    readTime: 8,
    category: "cv-resume",
    tags: ["CV Writing", "Swiss Market", "Job Applications"],
    featured: true,
    views: 15420,
    likes: 342,
  },
  {
    id: "2",
    title: "Acing Swiss Job Interviews: Cultural Do's and Don'ts",
    excerpt:
      "Navigate Swiss interview culture with confidence. Learn the unspoken rules that can make or break your job prospects.",
    content: `Swiss job interviews have unique cultural elements. Here's how to excel:

**Before the Interview:**
• Research the company thoroughly
• Prepare for 2-3 interview rounds
• Practice your handshake (firm, brief)
• Arrive exactly on time (not early, not late)
• Dress conservatively and professionally

**During the Interview:**
• Maintain direct eye contact
• Speak clearly and concisely
• Avoid interrupting the interviewer
• Prepare specific examples for competency questions
• Ask thoughtful questions about the role

**Swiss Interview Etiquette:**
• Punctuality is crucial - arrive at the exact time
• Formal address until invited to use first names
• Modest confidence (not boastful)
• Respect hierarchy and formality
• Direct communication style appreciated

**Common Questions in Swiss Interviews:**
• "Why do you want to work in Switzerland?"
• "How do you handle multicultural teams?"
• "Describe your integration process"
• "What's your long-term career plan?"
• "How do you deal with Swiss German/French?"

**Follow-up Best Practices:**
• Send a thank-you email within 24 hours
• Reiterate your interest and key qualifications
• Be patient - Swiss hiring process takes time
• Don't call repeatedly for updates`,
    author: "Marcus Weber, Swiss Recruiter",
    publishDate: "2024-01-12",
    readTime: 6,
    category: "interview",
    tags: ["Interview Skills", "Swiss Culture", "Job Search"],
    featured: true,
    views: 12350,
    likes: 289,
  },
  {
    id: "3",
    title: "Salary Negotiation in Switzerland: Get What You're Worth",
    excerpt:
      "Master the art of salary negotiation in the Swiss market. Learn market rates, timing, and negotiation strategies.",
    content: `Salary negotiation in Switzerland requires preparation and cultural awareness:

**Research Market Rates:**
• Use our Salary Guide for benchmarking
• Consider cantonal differences (Zurich vs Geneva)
• Factor in benefits and total compensation
• Account for tax implications
• Research company size and industry standards

**Timing Your Negotiation:**
• Initial offer discussion (best time)
• Annual performance reviews
• Role expansion or promotion
• Market rate adjustments
• Contract renewal periods

**Negotiation Strategies:**
• Present market research data
• Highlight specific achievements
• Focus on value delivered
• Consider total package (vacation, benefits)
• Be prepared to justify your request

**What's Negotiable:**
• Base salary
• Vacation days (standard 25 days)
• Flexible working arrangements
• Professional development budget
• Home office equipment
• Transportation allowances
• Pension contributions

**Swiss Negotiation Culture:**
• Direct but respectful approach
• Fact-based arguments preferred
• Patience with decision timelines
• Professional tone throughout
• Written follow-up of agreements`,
    author: "Dr. Anna Schmidt, Compensation Specialist",
    publishDate: "2024-01-10",
    readTime: 7,
    category: "salary",
    tags: ["Salary Negotiation", "Swiss Salaries", "Career Advancement"],
    featured: false,
    views: 9870,
    likes: 198,
  },
  {
    id: "4",
    title: "Building Your Professional Network in Switzerland",
    excerpt:
      "Expand your professional circle the Swiss way. From LinkedIn to local events, build meaningful connections.",
    content: `Networking in Switzerland is relationship-based and built on trust:

**Swiss Networking Culture:**
• Quality over quantity relationships
• Professional formality important
• Trust-building takes time
• Punctuality and reliability crucial
• Industry-specific events highly valued

**Where to Network:**
• Professional associations (Swiss IT Society, etc.)
• Industry conferences and trade shows
• University alumni networks
• Corporate events and workshops
• Co-working spaces in major cities
• Online communities and forums

**Effective Networking Strategies:**
• Join relevant professional associations
• Attend industry meetups regularly
• Volunteer for professional organizations
• Offer help before asking for favors
• Follow up with valuable content
• Maintain long-term relationships

**LinkedIn Best Practices for Switzerland:**
• Professional headshot mandatory
• Bilingual profiles (German/English)
• Industry keywords for visibility
• Regular thought leadership posts
• Engage with Swiss business content
• Connect with purpose and personal notes

**Building Authentic Relationships:**
• Focus on mutual value exchange
• Be patient with relationship building
• Respect Swiss communication styles
• Offer expertise and assistance
• Remember personal details in conversations
• Follow through on commitments`,
    author: "Thomas Müller, Business Development",
    publishDate: "2024-01-08",
    readTime: 5,
    category: "networking",
    tags: ["Networking", "Professional Growth", "Swiss Business"],
    featured: false,
    views: 7520,
    likes: 156,
  },
  {
    id: "5",
    title: "Job Search Strategies That Work in Switzerland",
    excerpt:
      "Navigate the Swiss job market like a pro. From hidden job markets to application timing, maximize your chances.",
    content: `The Swiss job market has unique characteristics requiring targeted strategies:

**Understanding the Swiss Job Market:**
• 70% of jobs never publicly advertised
• Relationship-based hiring prevalent
• Seasonal hiring patterns exist
• Company size affects hiring process
• Regional language requirements vary

**Effective Job Search Channels:**
• Personal and professional networks (most important)
• Company websites direct applications
• Professional recruitment agencies
• LinkedIn and Xing platforms
• Industry-specific job boards
• University career services

**Application Timing:**
• Avoid summer holidays (July-August)
• New budget year hiring (January-March)
• Avoid Christmas period (December)
• Follow up after Swiss holidays
• Monday-Thursday best for applications

**Hidden Job Market Access:**
• Build relationships with industry insiders
• Follow target companies on social media
• Attend industry events and conferences
• Connect with employees at desired companies
• Work with specialized recruiters
• Consider informational interviews

**Application Best Practices:**
• Customize each application completely
• Research company culture thoroughly
• Use industry-specific keywords
• Include relevant work permit information
• Professional photo essential
• Follow exact application instructions`,
    author: "Lisa Rodriguez, Career Coach",
    publishDate: "2024-01-05",
    readTime: 6,
    category: "job-search",
    tags: ["Job Search", "Career Strategy", "Swiss Employment"],
    featured: false,
    views: 8910,
    likes: 203,
  },
];

function ArticleCard({ article }: { article: Article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2 py-1 bg-jobequal-green-light text-jobequal-green text-xs font-medium rounded-full">
              {categories.find((cat) => cat.id === article.category)?.label}
            </span>
            {article.featured && <Star className="w-4 h-4 text-yellow-500" />}
          </div>
          <h3 className="text-xl font-bold text-jobequal-text mb-2 leading-tight">
            {article.title}
          </h3>
          <p className="text-jobequal-text-muted leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-jobequal-text-muted mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} min read</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{article.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>{article.likes}</span>
          </div>
        </div>
        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-jobequal-text-muted">
          By {article.author}
        </span>
        <Link
          to={`/career-tips/${article.id}`}
          className="inline-flex items-center space-x-1 text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function CareerTips() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter((article) => article.featured);

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Career Tips & Guidance"
            title="Master Your Swiss Career Journey"
            description="Expert advice, insider tips, and proven strategies to accelerate your career in Switzerland. From CV writing to salary negotiation, we've got you covered."
          >
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <BookOpen className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm font-medium text-jobequal-text">
                  {articles.length} Articles
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-jobequal-text">
                  Expert Guidance
                </span>
              </div>
            </div>
          </PageHeader>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {/* Search and Filters */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search career tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-jobequal-green text-white"
                      : "bg-white text-jobequal-text-muted hover:bg-jobequal-green-light hover:text-jobequal-green"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Articles */}
        {selectedCategory === "all" && !searchQuery && (
          <section className="mb-16">
            <SectionHeader
              title="Featured Articles"
              description="Most popular career tips from our experts"
            />
            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-jobequal-text">
              {selectedCategory === "all"
                ? "All Career Tips"
                : categories.find((cat) => cat.id === selectedCategory)?.label}
            </h2>
            <span className="text-jobequal-text-muted">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-jobequal-text mb-2">
                No articles found
              </h3>
              <p className="text-jobequal-text-muted">
                Try adjusting your search or category filter
              </p>
            </motion.div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-20 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-3xl p-8 lg:p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Apply These Tips?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start your job search with confidence using our expert guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/job-search"
                className="inline-flex items-center space-x-2 bg-white text-jobequal-green px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Browse Jobs</span>
              </Link>
              <Link
                to="/cv-upload"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-jobequal-green transition-all"
              >
                <FileText className="w-5 h-5" />
                <span>Upload Your CV</span>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
