"use client"; // This component uses state for the accordion and search, so it must be a Client Component.

import { useState } from "react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  { id: "1", question: "How do I create an account?", answer: "Click Sign Up and follow the prompts.", category: "getting-started" },
  { id: "2", question: "Is JobEqual free for job seekers?", answer: "Yes, our core features are completely free for job seekers.", category: "getting-started" },
  { id: "3", question: "How does AI job matching work?", answer: "Our AI analyzes your profile and skills to find the best job matches for you.", category: "getting-started" },
  { id: "4", question: "Do I need a work permit for Switzerland?", answer: "EU/EFTA citizens do not, but must register. Non-EU citizens typically require an employer-sponsored permit.", category: "swiss-employment" },
  { id: "5", question: "How should I format my CV for Swiss employers?", answer: "A 2-3 page chronological CV with a professional photo is standard. Our CV review service can help.", category: "applications" },
];

const categories = [
  { id: "all", label: "All Questions" },
  { id: "getting-started", label: "Getting Started" },
  { id: "swiss-employment", label: "Swiss Employment" },
  { id: "applications", label: "Applications" },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = searchQuery === "" || item.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-jobequal-green mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-jobequal-text">Frequently Asked Questions</h1>
        </div>

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-jobequal-neutral-dark rounded-2xl focus:ring-2 focus:ring-jobequal-green"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-jobequal-green text-white"
                  : "bg-white text-jobequal-text hover:bg-jobequal-green-light"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-jobequal-text">{item.question}</h3>
                  {expandedItems.has(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-jobequal-green" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-jobequal-text-muted" />
                  )}
                </div>
              </button>
              {expandedItems.has(item.id) && (
                <div className="px-6 pb-6">
                  <p className="text-jobequal-text leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
