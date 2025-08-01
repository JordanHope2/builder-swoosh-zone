import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCheck,
  Check,
  Circle,
  Filter,
  Plus,
  UserPlus,
  Settings,
  Bell,
  BellOff,
  File,
  Image,
  Download,
  Eye,
  EyeOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Reply,
  Forward,
  Edit3,
  Flag,
  Shield,
  Ban
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DashboardContainer,
  SectionHeader,
  ActionButton,
  DashboardCard,
  LoadingSpinner
} from '../components/ui/unified-dashboard';
import SecurityUtils from '../lib/security';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'candidate' | 'recruiter' | 'company' | 'admin';
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  company?: string;
  position?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: string[];
  edited?: boolean;
  replyTo?: string;
  reactions?: { emoji: string; users: string[] }[];
}

interface Conversation {
  id: string;
  participants: string[];
  type: 'direct' | 'group' | 'channel';
  name?: string;
  description?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  archived: boolean;
  pinned: boolean;
  muted: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    avatar: '/avatars/sarah.jpg',
    role: 'recruiter',
    status: 'online',
    company: 'TechCorp Zurich',
    position: 'Senior Recruiter'
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    avatar: '/avatars/michael.jpg',
    role: 'candidate',
    status: 'away',
    lastSeen: '2024-01-16T10:30:00Z',
    position: 'Senior Software Engineer'
  },
  {
    id: 'user-3',
    name: 'Emma Rodriguez',
    avatar: '/avatars/emma.jpg',
    role: 'company',
    status: 'online',
    company: 'SwissFinance Solutions',
    position: 'HR Director'
  },
  {
    id: 'user-4',
    name: 'Admin Support',
    avatar: '/avatars/admin.jpg',
    role: 'admin',
    status: 'online',
    company: 'JobEqual',
    position: 'Platform Administrator'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    content: 'Hi there! I saw your profile and I think you might be a great fit for our Senior Software Engineer position at TechCorp. Would you be interested in discussing this opportunity?',
    timestamp: '2024-01-16T09:00:00Z',
    type: 'text',
    readBy: ['user-1', 'user-2']
  },
  {
    id: 'msg-2',
    senderId: 'user-2',
    content: 'Hello Sarah! Thank you for reaching out. I\'m definitely interested in learning more about the position. Could you share more details about the role and the team?',
    timestamp: '2024-01-16T09:15:00Z',
    type: 'text',
    readBy: ['user-1', 'user-2']
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    content: 'Absolutely! Here\'s the detailed job description and information about our tech stack.',
    timestamp: '2024-01-16T09:30:00Z',
    type: 'file',
    fileUrl: '/files/job-description.pdf',
    fileName: 'Senior_Software_Engineer_JD.pdf',
    fileSize: 245760,
    readBy: ['user-1', 'user-2']
  },
  {
    id: 'msg-4',
    senderId: 'user-2',
    content: 'Thanks for sharing! The role looks very interesting. When would be a good time for a call to discuss further?',
    timestamp: '2024-01-16T10:00:00Z',
    type: 'text',
    readBy: ['user-1', 'user-2']
  },
  {
    id: 'msg-5',
    senderId: 'user-1',
    content: 'How about tomorrow at 2 PM? I can send you a calendar invite.',
    timestamp: '2024-01-16T10:05:00Z',
    type: 'text',
    readBy: ['user-1']
  }
];

const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-1', 'user-2'],
    type: 'direct',
    lastMessage: mockMessages[4],
    unreadCount: 1,
    archived: false,
    pinned: true,
    muted: false,
    tags: ['job-opportunity', 'tech'],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-16T10:05:00Z'
  },
  {
    id: 'conv-2',
    participants: ['user-3'],
    type: 'direct',
    name: 'Emma Rodriguez',
    unreadCount: 0,
    archived: false,
    pinned: false,
    muted: false,
    tags: ['partnership'],
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T16:30:00Z'
  },
  {
    id: 'conv-3',
    participants: ['user-4'],
    type: 'direct',
    name: 'Platform Support',
    unreadCount: 0,
    archived: false,
    pinned: false,
    muted: false,
    tags: ['support'],
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-14T11:45:00Z'
  }
];

export default function Messages() {
  const { t } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<string | null>('conv-1');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentConversation = mockConversations.find(conv => conv.id === selectedConversation);
  const currentMessages = selectedConversation === 'conv-1' ? mockMessages : [];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;
    
    // Sanitize message content
    const sanitizedMessage = SecurityUtils.sanitizeText(message);
    
    // Here you would send the message to your backend
    console.log('Sending message:', sanitizedMessage);
    
    setMessage('');
    setAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const validation = SecurityUtils.validateFileUpload(file);
      if (validation.valid) {
        setAttachments(prev => [...prev, file]);
      } else {
        alert(validation.error);
      }
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('de-CH', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: '2-digit' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUserInfo = (userId: string) => {
    return mockUsers.find(user => user.id === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const filteredConversations = mockConversations.filter(conv => {
    if (!searchTerm) return true;
    const participants = conv.participants.map(id => getUserInfo(id)?.name || '').join(' ');
    return participants.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DashboardContainer>
      <Navigation />
      
      <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
              <div className="flex items-center space-x-2">
                <ActionButton variant="secondary" size="sm" icon={Settings}>
                </ActionButton>
                <ActionButton variant="primary" size="sm" icon={Plus}>
                </ActionButton>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(SecurityUtils.sanitizeText(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants[0];
              const user = getUserInfo(otherParticipant);
              const isSelected = selectedConversation === conversation.id;

              return (
                <motion.div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-jobequal-green-light dark:bg-jobequal-green/10 border-l-4 border-l-jobequal-green' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                  whileHover={{ x: 2 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {SecurityUtils.sanitizeText(user?.name?.charAt(0) || '?')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user?.status || 'offline')} rounded-full border-2 border-white dark:border-gray-800`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {SecurityUtils.sanitizeText(user?.name || conversation.name || 'Unknown')}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {conversation.pinned && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                          {conversation.muted && <BellOff className="w-3 h-3 text-gray-400" />}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage ? 
                            SecurityUtils.sanitizeText(conversation.lastMessage.content) : 
                            'No messages yet'
                          }
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-jobequal-green text-white text-xs font-medium px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {user?.company && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {SecurityUtils.sanitizeText(user.company)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {currentConversation && (
                      <>
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {SecurityUtils.sanitizeText(getUserInfo(currentConversation.participants[0])?.name?.charAt(0) || '?')}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(getUserInfo(currentConversation.participants[0])?.status || 'offline')} rounded-full border-2 border-white dark:border-gray-800`}></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {SecurityUtils.sanitizeText(getUserInfo(currentConversation.participants[0])?.name || 'Unknown')}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getUserInfo(currentConversation.participants[0])?.status === 'online' ? 'Online' : 
                             getUserInfo(currentConversation.participants[0])?.lastSeen ? 
                             `Last seen ${formatTime(getUserInfo(currentConversation.participants[0])?.lastSeen || '')}` : 
                             'Offline'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <ActionButton variant="secondary" size="sm" icon={Phone}>
                    </ActionButton>
                    <ActionButton variant="secondary" size="sm" icon={Video}>
                    </ActionButton>
                    <ActionButton variant="secondary" size="sm" icon={Eye} onClick={() => setShowUserInfo(!showUserInfo)}>
                    </ActionButton>
                    <ActionButton variant="secondary" size="sm" icon={MoreVertical}>
                    </ActionButton>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((msg) => {
                  const sender = getUserInfo(msg.senderId);
                  const isOwn = msg.senderId === 'user-2'; // Assuming current user is user-2
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                        {!isOwn && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {SecurityUtils.sanitizeText(sender?.name || 'Unknown')}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`rounded-2xl px-4 py-2 ${
                          isOwn 
                            ? 'bg-jobequal-green text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          {msg.type === 'text' && (
                            <p className="whitespace-pre-wrap">
                              {SecurityUtils.sanitizeText(msg.content)}
                            </p>
                          )}
                          
                          {msg.type === 'file' && (
                            <div className="flex items-center space-x-3 p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                              <File className="w-8 h-8 text-gray-500" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {SecurityUtils.sanitizeText(msg.fileName || 'Unknown file')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {msg.fileSize ? formatFileSize(msg.fileSize) : 'Unknown size'}
                                </p>
                              </div>
                              <ActionButton variant="secondary" size="sm" icon={Download}>
                              </ActionButton>
                            </div>
                          )}
                        </div>
                        
                        {isOwn && (
                          <div className="flex items-center justify-end space-x-1 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(msg.timestamp)}
                            </span>
                            {msg.readBy.length > 1 ? (
                              <CheckCheck className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Check className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                
                {isTyping && (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Someone is typing...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <File className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {SecurityUtils.sanitizeText(file.name)}
                        </span>
                        <button
                          onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-end space-x-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      className="hidden"
                    />
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      icon={Paperclip}
                      onClick={() => fileInputRef.current?.click()}
                    >
                    </ActionButton>
                    <ActionButton variant="secondary" size="sm" icon={Smile}>
                    </ActionButton>
                  </div>
                  
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent resize-none"
                      rows={1}
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>
                  
                  <ActionButton
                    variant="primary"
                    icon={Send}
                    onClick={handleSendMessage}
                    disabled={!message.trim() && attachments.length === 0}
                  >
                  </ActionButton>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Info Sidebar */}
        <AnimatePresence>
          {showUserInfo && selectedConversation && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            >
              <div className="p-6">
                {currentConversation && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {SecurityUtils.sanitizeText(getUserInfo(currentConversation.participants[0])?.name?.charAt(0) || '?')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {SecurityUtils.sanitizeText(getUserInfo(currentConversation.participants[0])?.name || 'Unknown')}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {SecurityUtils.sanitizeText(getUserInfo(currentConversation.participants[0])?.position || '')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {SecurityUtils.sanitizeText(getUserInfo(currentConversation.participants[0])?.company || '')}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-around py-4 border-t border-b border-gray-200 dark:border-gray-700">
                        <ActionButton variant="secondary" icon={Phone}>
                          Call
                        </ActionButton>
                        <ActionButton variant="secondary" icon={Video}>
                          Video
                        </ActionButton>
                        <ActionButton variant="secondary" icon={Star}>
                          Star
                        </ActionButton>
                      </div>
                      
                      <div className="space-y-3">
                        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Bell className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">Notifications</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Archive className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">Archive chat</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Flag className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">Report</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600">
                          <Ban className="w-5 h-5" />
                          <span>Block user</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardContainer>
  );
}
