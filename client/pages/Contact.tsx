import React, { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "../components/ui/improved-navigation";
import { PageHeader } from "../components/ui/page-header";
import { applicationToast } from "../hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  Send,
  CheckCircle,
  Globe,
  MessageCircle,
  Calendar,
  Users,
  HeadphonesIcon,
  Shield,
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: "general" | "partnership" | "support" | "careers" | "media";
  honeypot: string; // Spam protection
}

const contactInfo = {
  headquarters: {
    address: "Rue de la Paix 42, 1003 Lausanne, Switzerland",
    phone: "+41 21 555 0123",
    email: "hello@jobequal.com",
    hours: "Monday - Friday: 9:00 AM - 6:00 PM CET",
  },
  departments: [
    {
      name: "General Inquiries",
      email: "info@jobequal.com",
      description: "Questions about our platform and services",
    },
    {
      name: "Partnership",
      email: "partnerships@jobequal.com",
      description: "Business partnerships and collaborations",
    },
    {
      name: "Support",
      email: "support@jobequal.com",
      description: "Technical support and account assistance",
    },
    {
      name: "Careers",
      email: "careers@jobequal.com",
      description: "Join our team and work with us",
    },
    {
      name: "Media",
      email: "media@jobequal.com",
      description: "Press inquiries and media relations",
    },
  ],
};

const inquiryTypes = [
  { value: "general", label: "General Inquiry", icon: MessageCircle },
  { value: "partnership", label: "Partnership", icon: Users },
  { value: "support", label: "Technical Support", icon: HeadphonesIcon },
  { value: "careers", label: "Careers", icon: Building },
  { value: "media", label: "Media & Press", icon: Globe },
];

function ContactCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      <h3 className="text-xl font-bold text-jobequal-text mb-6">{title}</h3>
      {children}
    </motion.div>
  );
}

function DepartmentCard({
  department,
}: {
  department: (typeof contactInfo.departments)[0];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-jobequal-green/20"
    >
      <h4 className="font-semibold text-jobequal-text mb-2">
        {department.name}
      </h4>
      <p className="text-jobequal-text-muted text-sm mb-3">
        {department.description}
      </p>
      <a
        href={`mailto:${department.email}`}
        className="text-jobequal-green hover:text-jobequal-green-hover font-medium text-sm transition-colors"
      >
        {department.email}
      </a>
    </motion.div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general",
    honeypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email is invalid";
    if (!formData.subject.trim()) return "Subject is required";
    if (!formData.message.trim()) return "Message is required";
    if (formData.honeypot) return "Spam detected"; // Honeypot check
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      applicationToast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call (in real app, this would send email via Resend or SES)
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      };

      console.log("Contact form submission:", submissionData);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success toast
      applicationToast.success(
        "Message sent successfully!",
        "We'll get back to you within 24 hours.",
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        inquiryType: "general",
        honeypot: "",
      });
    } catch (error) {
      applicationToast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Get in Touch"
            title="We're Here to Help"
            description="Have questions about JobEqual? Want to partner with us? Located in the heart of Switzerland, we're ready to connect and support your journey."
          >
            <div className="flex items-center justify-center space-x-3 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <MapPin className="w-4 h-4 text-jobequal-green" />
                <span className="text-sm font-medium text-jobequal-text">
                  Lausanne, Switzerland
                </span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Clock className="w-4 h-4 text-jobequal-blue" />
                <span className="text-sm font-medium text-jobequal-text">
                  24h Response Time
                </span>
              </div>
            </div>
          </PageHeader>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactCard title="Send us a Message">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot for spam protection */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Inquiry Type */}
                <div>
                  <label className="block text-sm font-medium text-jobequal-text mb-3">
                    What can we help you with?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {inquiryTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.inquiryType === type.value
                            ? "border-jobequal-green bg-jobequal-green-light"
                            : "border-gray-200 hover:border-jobequal-green/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type.value}
                          checked={formData.inquiryType === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <type.icon
                          className={`w-5 h-5 ${
                            formData.inquiryType === type.value
                              ? "text-jobequal-green"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            formData.inquiryType === type.value
                              ? "text-jobequal-green"
                              : "text-gray-700"
                          }`}
                        >
                          {type.label}
                        </span>
                        {formData.inquiryType === type.value && (
                          <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-jobequal-green" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-jobequal-text mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-jobequal-text mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-jobequal-text mb-2"
                  >
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-colors"
                    placeholder="Your company name"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-jobequal-text mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-colors"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-jobequal-text mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Spam Protection Notice */}
                <div className="flex items-center space-x-2 text-sm text-jobequal-text-muted">
                  <Shield className="w-4 h-4" />
                  <span>Protected by spam detection</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-jobequal-green to-jobequal-teal hover:from-jobequal-green-hover hover:to-jobequal-teal text-white transform hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </ContactCard>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Headquarters */}
            <ContactCard title="Our Headquarters">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-jobequal-green mt-1" />
                  <div>
                    <p className="font-medium text-jobequal-text">Address</p>
                    <p className="text-jobequal-text-muted">
                      {contactInfo.headquarters.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-jobequal-blue mt-1" />
                  <div>
                    <p className="font-medium text-jobequal-text">Phone</p>
                    <a
                      href={`tel:${contactInfo.headquarters.phone}`}
                      className="text-jobequal-green hover:text-jobequal-green-hover transition-colors"
                    >
                      {contactInfo.headquarters.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-jobequal-teal mt-1" />
                  <div>
                    <p className="font-medium text-jobequal-text">Email</p>
                    <a
                      href={`mailto:${contactInfo.headquarters.email}`}
                      className="text-jobequal-green hover:text-jobequal-green-hover transition-colors"
                    >
                      {contactInfo.headquarters.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-jobequal-text-muted mt-1" />
                  <div>
                    <p className="font-medium text-jobequal-text">
                      Business Hours
                    </p>
                    <p className="text-jobequal-text-muted">
                      {contactInfo.headquarters.hours}
                    </p>
                  </div>
                </div>
              </div>
            </ContactCard>

            {/* Map Embed */}
            <ContactCard title="Find Us">
              <div className="aspect-square rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2743.4757!2d6.6322734!3d46.5196535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c2e2bb0bb1f7b%3A0x4b7b4b7b4b7b4b7b!2sRue%20de%20la%20Paix%2042%2C%201003%20Lausanne%2C%20Switzerland!5e0!3m2!1sen!2sus!4v1643723400000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="JobEqual Headquarters Location"
                />
              </div>
            </ContactCard>
          </div>
        </div>

        {/* Department Contacts */}
        <section className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-jobequal-text mb-4">
              Direct Department Contacts
            </h2>
            <p className="text-lg text-jobequal-text-muted max-w-2xl mx-auto">
              Reach out directly to the right team for faster, more specific
              assistance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.departments.map((department, index) => (
              <DepartmentCard key={index} department={department} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
