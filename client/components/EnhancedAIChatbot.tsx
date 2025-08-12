import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
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
  Zap,
  FileText,
  DollarSign,
  Users,
  Clock,
  Star,
  Settings,
  RefreshCw,
  ChevronDown,
  Mic,
  MicOff,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
  type?: 'text' | 'action' | 'error' | 'system';
  data?: any;
  isThinking?: boolean;
}

interface ChatContext {
  userProfile?: any;
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
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, currentLanguage } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('ai.welcome') || "Hi! I'm your AI career assistant. I can help you find jobs, get salary insights, and optimize your profile. What can I help you with today?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        t('ai.find_jobs') || "Find jobs for me",
        t('ai.location_jobs') || "Jobs in my area", 
        t('ai.remote_jobs') || "Remote positions",
        t('ai.salary_insights') || "Salary insights"
      ]
    }
  ]);

  const [context, setContext] = useState<ChatContext>({
    sessionId,
    currentPage: window.location.pathname,
    preferences: {
      language: currentLanguage.code,
      location: 'Switzerland',
      industry: ''
    }
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text: string, isQuickAction = false) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const thinkingMessage: Message = {
      id: 'thinking-' + Date.now(),
      text: '...',
      isBot: true,
      timestamp: new Date(),
      isThinking: true,
      type: 'system'
    };

    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const { reply } = await response.json();
      
      setMessages(prev => {
        const withoutThinking = prev.filter(m => !m.isThinking);
        const botResponse: Message = {
          id: Date.now().toString(),
          text: reply,
          isBot: true,
          timestamp: new Date(),
          type: 'text',
          suggestions: isQuickAction ? [] : [
            "Tell me more",
            "Show similar options", 
            "Help me apply",
            "What's next?"
          ]
        };
        return [...withoutThinking, botResponse];
      });
    } catch (error) {
      setMessages(prev => {
        const withoutThinking = prev.filter(m => !m.isThinking);
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
          isBot: true,
          timestamp: new Date(),
          type: 'error'
        };
        return [...withoutThinking, errorMessage];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionTexts = {
      'search_jobs': 'Find jobs for me',
      'location_jobs': 'Show me jobs in Zurich', 
      'remote_jobs': 'Find remote positions',
      'salary_insights': 'What are salary insights for my role?',
      'cv_review': 'I want to review my CV',
      'company_match': 'Find companies that match my profile'
    };
    
    sendMessage(actionTexts[action as keyof typeof actionTexts] || action, true);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
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
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
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
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
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
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  message.isBot 
                    ? 'bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white' 
                    : 'bg-jobequal-green text-white'
                } ${message.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : ''}`}>
                  
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-jobequal-green" />
                      <span className="text-xs font-medium text-jobequal-green">AI Assistant</span>
                    </div>
                  )}
                  
                  {message.isThinking ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-jobequal-green rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-jobequal-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-jobequal-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                      
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
                  <span>{t(`ai.${action.text}`) || action.text.replace('_', ' ')}</span>
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
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputText)}
                  placeholder={t('ai.type_message') || "Type your message..."}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-jobequal-text dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-jobequal-text dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => sendMessage(inputText)}
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
