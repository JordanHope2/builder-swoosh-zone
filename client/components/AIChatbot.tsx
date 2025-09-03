import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const mockResponses: { [key: string]: string } = {
  default: "Hello! How can I help you find your dream job today?",
  "find jobs": "I can help with that! What role are you looking for?",
  "salary insights": "I can provide salary information. What job title and location are you interested in?",
};

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "1",
          text: mockResponses.default,
          isBot: true,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const responseKey = text.toLowerCase().includes("job") ? "find jobs" : text.toLowerCase().includes("salary") ? "salary insights" : "default";
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: mockResponses[responseKey],
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-blue-600 text-white rounded-full shadow-lg ${isOpen ? "hidden" : "flex"}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="font-semibold">AI Career Assistant</h3>
              <button onClick={() => setIsOpen(false)}><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div className={`p-3 rounded-lg ${message.isBot ? "bg-gray-200" : "bg-blue-500 text-white"}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-gray-500">AI is typing...</div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about jobs, salaries..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-lg"><Send /></button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
