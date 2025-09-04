"use client"; // This page has a form with state, so it must be a Client Component.

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { applicationToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Shield,
  Users,
  MessageCircle,
  Building,
  Globe,
  HeadphonesIcon
} from "lucide-react";

// NOTE: The form submission is a simulation. In a real app, this would
// be handled by a Next.js Server Action for secure processing.

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: string;
}

const inquiryTypes = [
  { value: "general", label: "General Inquiry", icon: MessageCircle },
  { value: "partnership", label: "Partnership", icon: Users },
  { value: "support", label: "Technical Support", icon: HeadphonesIcon },
  { value: "careers", label: "Careers", icon: Building },
  { value: "media", label: "Media & Press", icon: Globe },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    applicationToast.success("Message sent successfully!");
    // Reset form
    setFormData({ name: "", email: "", company: "", subject: "", message: "", inquiryType: "general" });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="Get in Touch"
            title="We're Here to Help"
            description="Have questions about JobEqual? We're ready to connect and support your journey."
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-jobequal-text mb-6">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-jobequal-text mb-2">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-jobequal-text mb-2">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-jobequal-text mb-2">Subject *</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-jobequal-text mb-2">Message *</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-jobequal-green"></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
