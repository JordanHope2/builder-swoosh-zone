import { Navigation } from "../components/Navigation";
import { PageHeader, SectionHeader } from "../components/ui/page-header";
import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Award,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Globe,
  CheckCircle,
  Zap,
  Star,
  Compass,
  ArrowRight,
  Mail,
  MapPin,
  Linkedin,
  Building,
  Flag,
  Mountain,
} from "lucide-react";
import { Link } from "react-router-dom";

const foundersStory = {
  hero: "Bridging Afro roots with Swiss precision, Christian Mah and Jeanne BA founded JobEqual to democratize opportunity. From diverse backgrounds across continents, they recognized that talent knows no borders—but access to opportunity often does. Their vision: create a platform where skills meet opportunity, where precision meets inclusion, and where Swiss excellence serves global social mobility.",

  detailed: [
    "Christian Mah's journey from West Africa to the peaks of Swiss innovation taught him that excellence transcends geography. His background in technology and deep understanding of both African dynamism and Swiss precision uniquely positioned him to see gaps in the global talent market.",

    "Jeanne BA brought a powerful combination of business acumen and social consciousness, having witnessed firsthand how traditional recruitment systems often overlook exceptional talent due to unconscious bias or geographical constraints.",

    "Together, they envisioned JobEqual as more than a job platform—a bridge connecting global talent with Swiss quality standards, ensuring that opportunity flows as freely as talent exists.",

    "Their mission crystallized around five core values: precision in matching, trust in every interaction, inclusion by design, Swiss-quality execution, and unwavering commitment to social mobility for all.",
  ],
};

const timeline = [
  {
    year: "2019",
    title: "The Vision",
    description:
      "Christian and Jeanne meet at a tech conference in Zurich, sharing stories about talent barriers",
  },
  {
    year: "2020",
    title: "Foundation",
    description:
      "JobEqual founded with seed funding, focusing on AI-driven talent matching",
  },
  {
    year: "2021",
    title: "Swiss Launch",
    description:
      "Platform launches in Switzerland, connecting 1,000+ professionals",
  },
  {
    year: "2022",
    title: "European Expansion",
    description: "Expanded to Germany and France, reaching 10,000+ users",
  },
  {
    year: "2023",
    title: "Global Scale",
    description: "Serving 50,000+ professionals across Europe and Africa",
  },
  {
    year: "2024",
    title: "AI Revolution",
    description:
      "Launched advanced AI matching, achieving 95% satisfaction rate",
  },
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Swiss-engineered matching algorithms that connect the right talent with the right opportunities",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Heart,
    title: "Inclusion",
    description:
      "Breaking down barriers and creating equal access to opportunities for all backgrounds",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Shield,
    title: "Trust",
    description:
      "Building reliable relationships between candidates and employers through transparency",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Social Mobility",
    description:
      "Empowering individuals to advance their careers regardless of their starting point",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Delivering Swiss-quality service and results that exceed expectations",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: Globe,
    title: "Global Vision",
    description:
      "Connecting talent across continents while maintaining local cultural understanding",
    color: "from-teal-500 to-teal-600",
  },
];

const teamMembers = [
  {
    name: "Christian Mah",
    role: "Co-Founder & CEO",
    bio: "Bridging African innovation with Swiss precision, Christian leads JobEqual's vision of democratizing global opportunity. His journey from West Africa to Zurich's tech scene brings unique insights to talent mobility.",
    image: "/api/placeholder/300/300",
    linkedin: "https://linkedin.com/in/christianmah",
  },
  {
    name: "Jeanne BA",
    role: "Co-Founder & COO",
    bio: "A passionate advocate for inclusive hiring, Jeanne combines business excellence with social impact. Her multicultural background drives JobEqual's commitment to breaking down recruitment barriers.",
    image: "/api/placeholder/300/300",
    linkedin: "https://linkedin.com/in/jeanneba",
  },
];

const missionPoints = [
  "Democratize access to quality employment opportunities",
  "Eliminate bias in recruitment through AI-driven matching",
  "Connect global talent with Swiss-standard employers",
  "Create pathways for social and economic mobility",
  "Foster inclusive workplaces across industries",
];

const visionPoints = [
  "A world where talent meets opportunity without barriers",
  "AI-powered recruitment that amplifies human potential",
  "Global talent mobility with local cultural respect",
  "Sustainable economic growth through inclusive hiring",
  "Technology that serves social mobility and equity",
];

function TeamMemberCard({ member }: { member: (typeof teamMembers)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group"
    >
      <div className="w-32 h-32 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-full mx-auto mb-6 flex items-center justify-center">
        <span className="text-white font-bold text-2xl">
          {member.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>

      <h3 className="text-xl font-bold text-jobequal-text mb-2">
        {member.name}
      </h3>
      <p className="text-jobequal-green font-semibold mb-4">{member.role}</p>
      <p className="text-jobequal-text-muted leading-relaxed mb-6">
        {member.bio}
      </p>

      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-jobequal-green hover:text-jobequal-green-dark transition-colors"
      >
        <Linkedin className="w-4 h-4" />
        <span>Connect</span>
      </a>
    </motion.div>
  );
}

function ValueCard({ value }: { value: (typeof values)[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <div
        className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <value.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-jobequal-text mb-4">
        {value.title}
      </h3>
      <p className="text-jobequal-text-muted leading-relaxed">
        {value.description}
      </p>
    </motion.div>
  );
}

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timeline)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex items-center space-x-4"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        {item.year}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold text-jobequal-text">{item.title}</h3>
        <p className="text-jobequal-text-muted">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-jobequal-neutral to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-jobequal-neutral via-jobequal-blue to-white opacity-60"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Our Story"
            title="Bridging Continents, Connecting Futures"
            description={foundersStory.hero}
          >
            <div className="flex items-center justify-center space-x-3 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Flag className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-jobequal-text">
                  Designed in Switzerland
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Globe className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm font-medium text-jobequal-text">
                  Serving Globally
                </span>
              </div>
            </div>
          </PageHeader>
        </div>
      </section>

      {/* Founder Story Details */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="From Vision to Reality"
            description="The journey that led to JobEqual's creation"
          />

          <div className="space-y-8">
            {foundersStory.detailed.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-lg text-jobequal-text-muted leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 bg-gradient-to-br from-jobequal-neutral to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="Meet Our Founders"
            description="Visionaries bridging cultures and creating opportunities"
          />

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="Our Journey"
            description="Key milestones in building a global platform for opportunity"
          />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <TimelineItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-jobequal-blue to-jobequal-neutral">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeader
            title="Our Values"
            description="The principles that guide everything we do"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-8 h-8 text-jobequal-green" />
                <h2 className="text-3xl font-bold text-jobequal-text">
                  Our Mission
                </h2>
              </div>
              <div className="space-y-4">
                {missionPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-jobequal-green mt-1 flex-shrink-0" />
                    <span className="text-jobequal-text-muted">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Compass className="w-8 h-8 text-jobequal-blue" />
                <h2 className="text-3xl font-bold text-jobequal-text">
                  Our Vision
                </h2>
              </div>
              <div className="space-y-4">
                {visionPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <Star className="w-5 h-5 text-jobequal-blue mt-1 flex-shrink-0" />
                    <span className="text-jobequal-text-muted">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-jobequal-green to-jobequal-teal">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Whether you're seeking opportunities or looking to hire
              exceptional talent, we're here to bridge the gap.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cv-upload"
                className="inline-flex items-center space-x-2 bg-white text-jobequal-green px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <span>Upload Your CV</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-jobequal-green transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>Get in Touch</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
