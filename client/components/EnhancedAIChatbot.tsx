import { motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  Briefcase,
  MapPin,
  Search,
  TrendingUp,
  FileText,
  Users,
  ChevronDown,
  Mic,
  MicOff,
  ThumbsUp,
  ThumbsDown,
  Copy,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

import { useLanguage } from "../contexts/LanguageContext";


interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  type?: "text" | "action" | "error" | "system";
  isThinking?: boolean;
}

interface ChatContext {
  currentPage?: string;
  sessionId: string;
  preferences: {
    language: string;
    location: string;
    industry: string;
  };
}

const quickActions = [
  { icon: Search, text: "search_jobs", category: "jobs" },
  { icon: MapPin, text: "location_jobs", category: "jobs" },
  { icon: Briefcase, text: "remote_jobs", category: "jobs" },
  { icon: TrendingUp, text: "salary_insights", category: "career" },
  { icon: FileText, text: "cv_review", category: "career" },
  { icon: Users, text: "company_match", category: "companies" },
];

export function EnhancedAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, currentLanguage } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text:
        t("ai.welcome") ||
        "Hi! I'm your AI career assistant. I can help you find jobs, get salary insights, and optimize your profile. What can I help you with today?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        t("ai.find_jobs") || "Find jobs for me",
        t("ai.location_jobs") || "Jobs in my area",
        t("ai.remote_jobs") || "Remote positions",
        t("ai.salary_insights") || "Salary insights",
      ],
    },
  ]);

  const [context] = useState<ChatContext>({
    sessionId,
    currentPage: window.location.pathname,
    preferences: {
      language: currentLanguage.code,
      location: "Switzerland",
      industry: "",
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Enhanced AI Response Generator (Placeholder for ChatGPT Integration)
  const generateAIResponse = async (
    userMessage: string,
    context: ChatContext,
  ): Promise<string> => {
    // This is where we would integrate with ChatGPT API
    // For now, using enhanced mock responses

    const responses = {
      search_jobs: `I'll help you find the perfect job! Based on your profile, I found several opportunities:

🚀 **Senior Software Engineer** at TechCorp Zurich
   • CHF 120,000 - 140,000 • 95% match • Remote-friendly
   
💡 **Product Manager** at InnovateCH Geneva  
   • CHF 110,000 - 130,000 • 89% match • Hybrid work
   
📊 **Data Scientist** at Analytics Pro Basel
   • CHF 105,000 - 125,000 • 87% match • Full remote

Would you like me to apply to any of these, or should I find more specific matches?`,

      location_jobs: `Great! I found ${Math.floor(Math.random() * 50 + 20)} jobs in ${context.preferences.location}:

**Top Matches:**
🏢 Finance roles: 15 positions (CHF 85k-160k)
💻 Tech positions: 22 positions (CHF 95k-180k)  
📈 Consulting: 8 positions (CHF 100k-150k)

The job market in ${context.preferences.location} is very strong right now, especially in tech and finance. Would you like to see specific roles in any industry?`,

      remote_jobs: `Excellent choice! Remote work is growing rapidly in Switzerland. I found **${Math.floor(Math.random() * 30 + 15)} remote positions** matching your profile:

🌍 **100% Remote Jobs:**
• Senior Developer at CloudFirst (CHF 115k-135k)
• UX Designer at DesignHub (CHF 85k-105k)
• Marketing Lead at GrowthCo (CHF 95k-115k)

🏠 **Hybrid Options:**
• Project Manager at FlexiWork (CHF 100k-120k)
• Business Analyst at DataDriven (CHF 90k-110k)

Swiss companies are embracing remote work more than ever. Should I help you apply to any of these?`,

      salary_insights: `Based on current Swiss market data and your profile:

💰 **Your Salary Range:**
   Current market: CHF ${Math.floor(Math.random() * 40000 + 95000).toLocaleString()}-${Math.floor(Math.random() * 50000 + 125000).toLocaleString()}
   
📊 **Market Position:**
   You're in the top ${Math.floor(Math.random() * 20 + 10)}% of candidates in your field
   
🎯 **Negotiation Range:**
   Recommended ask: CHF ${Math.floor(Math.random() * 30000 + 110000).toLocaleString()}-${Math.floor(Math.random() * 40000 + 135000).toLocaleString()}

**Salary Factors:**
• Location: Zurich (+15%), Geneva (+10%), Basel (+8%)
• Remote work: Usually 5-10% adjustment
• Company size: Startups vs. corporates vary significantly

Need help with salary negotiation strategies?`,

      cv_review: `I'd love to help optimize your CV for the Swiss market! Here's what I can do:

📋 **Free CV Analysis:**
• Swiss formatting standards check
• ATS compatibility review  
• Keyword optimization
• Skills gap analysis

⭐ **Premium CV Review** (CHF 149):
• 45-minute expert consultation
• Personalized feedback report
• Industry-specific recommendations
• Interview preparation tips

🎥 **Video CV Consultation** (CHF 249):
• 90-minute video session
• Live CV editing
• Mock interview practice
• Career coaching

Would you like to upload your CV for a free quick analysis, or book a detailed review session?`,

      company_match: `Let me find companies that match your values and career goals:

🎯 **Perfect Culture Matches:**
• **Google Zurich** - Innovation-focused, excellent benefits
• **Roche Basel** - Healthcare impact, stable growth
• **UBS Zurich** - Financial services leader, global reach

🌟 **Based on Your Profile:**
• Work-life balance: 9/10 companies prioritize this
• Remote flexibility: 7/10 offer hybrid options
• Career growth: All provide clear advancement paths

**Company Insights:**
• Average employee satisfaction: 4.2/5
• Typical hiring time: 3-5 weeks
• Salary negotiation success rate: 78%

Want detailed insights on any specific company, or should I find more matches?`,

      default: `I'm here to help with your career journey! Here's what I can assist with:

🔍 **Job Search:** Find roles matching your skills and preferences
📊 **Market Insights:** Salary data, industry trends, company info  
📝 **CV Optimization:** Review and improve your resume
🎯 **Application Strategy:** Personalized job search approach
🗣️ **Interview Prep:** Practice sessions and tips
💼 **Career Coaching:** Long-term career planning

I understand context about Swiss employment law, work permits, and cultural expectations. What would be most helpful for you right now?`,
    };

    // Simulate API thinking time
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1500),
    );

    // Simple keyword matching for demo (would be replaced with ChatGPT)
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
      if (
        lowerMessage.includes(key.replace("_", " ")) ||
        lowerMessage.includes(key.replace("_", "")) ||
        (key === "search_jobs" &&
          (lowerMessage.includes("job") || lowerMessage.includes("work"))) ||
        (key === "location_jobs" &&
          (lowerMessage.includes("zurich") ||
            lowerMessage.includes("geneva") ||
            lowerMessage.includes("basel"))) ||
        (key === "salary_insights" &&
          (lowerMessage.includes("salary") ||
            lowerMessage.includes("pay") ||
            lowerMessage.includes("money"))) ||
        (key === "cv_review" &&
          (lowerMessage.includes("cv") ||
            lowerMessage.includes("resume") ||
            lowerMessage.includes("review"))) ||
        (key === "company_match" &&
          (lowerMessage.includes("company") ||
            lowerMessage.includes("employer")))
      ) {
        return response;
      }
    }

    return responses.default;
  };

  const sendMessage = async (text: string, isQuickAction = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Add thinking indicator
    const thinkingMessage: Message = {
      id: "thinking-" + Date.now(),
      text: "...",
      isBot: true,
      timestamp: new Date(),
      isThinking: true,
      type: "system",
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const response = await generateAIResponse(text, context);

      // Remove thinking indicator and add real response
      setMessages((prev) => {
        const withoutThinking = prev.filter((m) => !m.isThinking);
        const botResponse: Message = {
          id: Date.now().toString(),
          text: response,
          isBot: true,
          timestamp: new Date(),
          type: "text",
          suggestions: isQuickAction
            ? []
            : [
                "Tell me more",
                "Show similar options",
                "Help me apply",
                "What's next?",
              ],
        };
        return [...withoutThinking, botResponse];
      });
    } catch {
      setMessages((prev) => {
        const withoutThinking = prev.filter((m) => !m.isThinking);
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
          isBot: true,
          timestamp: new Date(),
          type: "error",
        };
        return [...withoutThinking, errorMessage];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionTexts = {
      search_jobs: "Find jobs for me",
      location_jobs: "Show me jobs in Zurich",
      remote_jobs: "Find remote positions",
      salary_insights: "What are salary insights for my role?",
      cv_review: "I want to review my CV",
      company_match: "Find companies that match my profile",
    };

    void sendMessage(
      actionTexts[action as keyof typeof actionTexts] || action,
      true,
    );
  };

  const copyMessage = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="w-8 h-8" />
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </motion.div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      } max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Career Assistant</h3>
            <p className="text-xs opacity-90">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isMinimized ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.isBot
                      ? "bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white"
                      : "bg-jobequal-green text-white"
                  } ${message.type === "error" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" : ""}`}
                >
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-jobequal-green" />
                      <span className="text-xs font-medium text-jobequal-green">
                        AI Assistant
                      </span>
                    </div>
                  )}

                  {message.isThinking ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-jobequal-green rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-jobequal-green rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-jobequal-green rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {message.text}
                      </p>

                      {message.isBot && (
                        <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => copyMessage(message.text)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                            title="Copy message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage(suggestion)}
                          className="px-3 py-1 bg-white dark:bg-gray-600 text-jobequal-green dark:text-white rounded-full text-xs hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors border border-jobequal-green dark:border-gray-500"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {quickActions.slice(0, 4).map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.text)}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs transition-colors"
                >
                  <action.icon className="w-3 h-3" />
                  <span>
                    {t(`ai.${action.text}`) || action.text.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      void sendMessage(inputText);
                    }
                  }}
                  placeholder={t("ai.type_message") || "Type your message..."}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-jobequal-text dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-colors ${
                  isListening
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => {
                  void sendMessage(inputText);
                }}
                disabled={!inputText.trim() || isTyping}
                className="p-2 bg-jobequal-green hover:bg-jobequal-green-hover text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
