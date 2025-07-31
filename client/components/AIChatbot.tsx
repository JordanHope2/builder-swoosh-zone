import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Briefcase,
  MapPin,
  Search,
  TrendingUp,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

const quickActions = [
  { icon: Search, text: "Find jobs for me", action: "search_jobs" },
  { icon: MapPin, text: "Jobs in Zurich", action: "jobs_zurich" },
  { icon: Briefcase, text: "Remote positions", action: "remote_jobs" },
  { icon: TrendingUp, text: "Salary insights", action: "salary_info" },
];

const mockResponses = {
  search_jobs: "I'd be happy to help you find jobs! What type of role are you looking for? You can say something like 'Software Engineer' or 'Marketing Manager'.",
  jobs_zurich: "Great choice! Zurich has amazing opportunities. I found 47 jobs in Zurich matching your profile. The top matches include:\n\n🚀 Senior Software Engineer at TechCorp (95% match)\n💡 Product Manager at InnovateCH (89% match)\n📊 Data Scientist at Analytics Pro (87% match)\n\nWould you like to see more details?",
  remote_jobs: "I found 23 remote positions that match your profile! Remote work is very popular in Switzerland. Here are the top matches:\n\n☁️ DevOps Engineer at CloudTech (92% match)\n🎨 UX Designer at DesignStudio (85% match)\n📈 Digital Marketing Lead at GrowthCo (81% match)",
  salary_info: "Based on your profile and current market data:\n\n💰 Average salary range: CHF 95,000 - 130,000\n📊 You're in the top 15% of candidates\n🎯 Recommended asking range: CHF 110,000 - 125,000\n\nWould you like tips on salary negotiation?",
  default: "I'm here to help you find the perfect job! I can help you:\n\n• Search for specific roles\n• Find jobs by location\n• Get salary insights\n• Match you with companies\n• Optimize your profile\n\nWhat would you like to do?"
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI career assistant. I can help you find jobs, get salary insights, and optimize your profile. What can I help you with today?",
      isBot: true,
      timestamp: new Date(),
      suggestions: ["Find jobs for me", "Jobs in Zurich", "Remote positions", "Salary insights"]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickAction = (action: string, text: string) => {
    sendMessage(text, action);
  };

  const sendMessage = async (text: string, action?: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const responseKey = action || 'default';
      const response = mockResponses[responseKey as keyof typeof mockResponses] || mockResponses.default;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        suggestions: action ? [] : ["Tell me more", "Show me jobs", "Update my profile"]
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${isOpen ? 'hidden' : 'flex'} items-center justify-center group`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask me anything about jobs!
        </div>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-jobequal-neutral-dark dark:border-gray-600 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Career Assistant</h3>
                    <p className="text-xs opacity-90">Online • Ready to help</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                    <div className={`p-3 rounded-2xl ${
                      message.isBot 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md' 
                        : 'bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-br-md'
                    }`}>
                      {message.isBot && <Sparkles className="w-4 h-4 inline mr-2 opacity-70" />}
                      <span className="text-sm whitespace-pre-line">{message.text}</span>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => sendMessage(suggestion)}
                            className="px-3 py-1 text-xs bg-jobequal-green-light text-jobequal-green-dark rounded-full hover:bg-jobequal-green hover:text-white transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.isBot && (
                    <div className="w-6 h-6 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center mr-2 order-1 flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action, action.text)}
                    className="flex items-center space-x-2 p-2 bg-jobequal-green-light dark:bg-gray-700 text-jobequal-green-dark dark:text-gray-300 rounded-lg hover:bg-jobequal-green hover:text-white dark:hover:bg-jobequal-green transition-colors text-xs"
                  >
                    <action.icon className="w-3 h-3" />
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask me anything about jobs..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-jobequal-green focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2 bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
