import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Settings,
  Archive,
  Star,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  MessageCircle,
  Shield,
  CreditCard,
  Search,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

import { useLanguage } from "../contexts/LanguageContext";
import SecurityUtils from "../lib/security";

import { ActionButton } from "./ui/unified-dashboard";

interface Notification {
  id: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "message"
    | "system"
    | "billing"
    | "security";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  actionUrl?: string;
  actionLabel?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  metadata?: {
    [key: string]: any;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "message",
    title: "New message from Sarah Johnson",
    message:
      "Hi! I'd like to discuss the Senior Software Engineer position. Are you available for a quick call this afternoon?",
    timestamp: "2024-01-16T14:30:00Z",
    read: false,
    starred: false,
    archived: false,
    priority: "high",
    category: "Messages",
    actionUrl: "/messages",
    actionLabel: "Reply",
    sender: {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      role: "Recruiter",
    },
  },
  {
    id: "notif-2",
    type: "success",
    title: "Application submitted successfully",
    message:
      "Your application for Senior Frontend Developer at TechCorp has been submitted and is under review.",
    timestamp: "2024-01-16T13:45:00Z",
    read: false,
    starred: true,
    archived: false,
    priority: "medium",
    category: "Applications",
    actionUrl: "/applications",
    actionLabel: "View Application",
  },
  {
    id: "notif-3",
    type: "billing",
    title: "Payment successful",
    message:
      "Your subscription payment of CHF 299.00 has been processed successfully. Next billing date: February 16, 2024.",
    timestamp: "2024-01-16T12:00:00Z",
    read: true,
    starred: false,
    archived: false,
    priority: "low",
    category: "Billing",
    actionUrl: "/billing",
    actionLabel: "View Invoice",
  },
  {
    id: "notif-4",
    type: "security",
    title: "Security alert: New login detected",
    message:
      "A new login was detected from Zurich, Switzerland on Chrome browser. If this wasn't you, please secure your account.",
    timestamp: "2024-01-16T11:15:00Z",
    read: true,
    starred: false,
    archived: false,
    priority: "urgent",
    category: "Security",
    actionUrl: "/settings/security",
    actionLabel: "Review Login",
  },
  {
    id: "notif-5",
    type: "info",
    title: "Profile views increased",
    message:
      "Your profile has been viewed 23 times this week, 45% more than last week. Consider updating your skills to attract more opportunities.",
    timestamp: "2024-01-16T10:30:00Z",
    read: true,
    starred: false,
    archived: false,
    priority: "low",
    category: "Profile",
    actionUrl: "/profile",
    actionLabel: "Update Profile",
  },
  {
    id: "notif-6",
    type: "system",
    title: "Platform maintenance scheduled",
    message:
      "We'll be performing system maintenance on January 20th from 2:00 AM to 4:00 AM CET. The platform may be temporarily unavailable.",
    timestamp: "2024-01-16T09:00:00Z",
    read: true,
    starred: false,
    archived: false,
    priority: "medium",
    category: "System",
    actionUrl: "/system-status",
    actionLabel: "Learn More",
  },
  {
    id: "notif-7",
    type: "warning",
    title: "Subscription expiring soon",
    message:
      "Your Premium subscription will expire on January 31st. Renew now to continue enjoying all features.",
    timestamp: "2024-01-16T08:00:00Z",
    read: true,
    starred: true,
    archived: false,
    priority: "high",
    category: "Billing",
    actionUrl: "/subscription",
    actionLabel: "Renew Now",
  },
];

export const NotificationSystem: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<
    "all" | "unread" | "starred" | "archived"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.archived,
  ).length;
  const categories = [
    "all",
    ...Array.from(new Set(notifications.map((n) => n.category))),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n)),
    );
  };

  const archiveNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n)),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by read status
    if (filter === "unread" && notification.read) return false;
    if (filter === "starred" && !notification.starred) return false;
    if (filter === "archived" && !notification.archived) return false;
    if (filter === "all" && notification.archived) return false;

    // Filter by category
    if (
      selectedCategory !== "all" &&
      notification.category !== selectedCategory
    )
      return false;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower) ||
        notification.sender?.name.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageCircle;
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      case "billing":
        return CreditCard;
      case "security":
        return Shield;
      case "system":
        return Settings;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "urgent")
      return "text-red-500 bg-red-50 dark:bg-red-900/20";

    switch (type) {
      case "message":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "success":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      case "warning":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "error":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "billing":
        return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
      case "security":
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "system":
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
      medium:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      high: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      urgent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}
      >
        {priority.toUpperCase()}
      </span>
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString("de-CH", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-jobequal-text-muted hover:text-jobequal-text dark:text-gray-400 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </ActionButton>
                  )}
                  <ActionButton
                    variant="secondary"
                    size="sm"
                    icon={Settings}
                    onClick={() => setIsOpen(false)}
                  />
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(SecurityUtils.sanitizeText(e.target.value))
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-2 mb-2">
                {(["all", "unread", "starred", "archived"] as const).map(
                  (filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filter === filterType
                          ? "bg-jobequal-green text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                      }`}
                    >
                      {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                    </button>
                  ),
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No notifications found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(
                      notification.type,
                      notification.priority,
                    );

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          !notification.read
                            ? "bg-blue-50 dark:bg-blue-900/10"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`text-sm font-medium ${
                                    !notification.read
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {SecurityUtils.sanitizeText(
                                    notification.title,
                                  )}
                                </h4>
                                {notification.sender && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    From:{" "}
                                    {SecurityUtils.sanitizeText(
                                      notification.sender.name,
                                    )}{" "}
                                    ({notification.sender.role})
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {getPriorityBadge(notification.priority)}
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => toggleStar(notification.id)}
                                    className={`p-1 rounded transition-colors ${
                                      notification.starred
                                        ? "text-yellow-500 hover:text-yellow-600"
                                        : "text-gray-400 hover:text-yellow-500"
                                    }`}
                                  >
                                    <Star
                                      className={`w-3 h-3 ${notification.starred ? "fill-current" : ""}`}
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      archiveNotification(notification.id)
                                    }
                                    className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    <Archive className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteNotification(notification.id)
                                    }
                                    className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {SecurityUtils.sanitizeText(notification.message)}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(notification.timestamp)}
                              </span>

                              <div className="flex items-center space-x-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                                  >
                                    Mark read
                                  </button>
                                )}
                                {notification.actionUrl && (
                                  <a
                                    href={notification.actionUrl}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs bg-jobequal-green text-white px-2 py-1 rounded font-medium hover:bg-jobequal-green-hover transition-colors"
                                  >
                                    {notification.actionLabel || "View"}
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <a
                href="/applications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
              >
                View All Applications
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Notification Toast Component
interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onAction?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction,
}) => {
  const Icon = getNotificationIcon(notification.type);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${getNotificationColor(
              notification.type,
              notification.priority,
            )}`}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {SecurityUtils.sanitizeText(notification.title)}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {SecurityUtils.sanitizeText(notification.message)}
            </p>

            <div className="flex items-center space-x-2 mt-3">
              {notification.actionLabel && onAction && (
                <button
                  onClick={onAction}
                  className="text-xs bg-jobequal-green text-white px-3 py-1 rounded font-medium hover:bg-jobequal-green-hover transition-colors"
                >
                  {notification.actionLabel}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function getNotificationIcon(type: string) {
  switch (type) {
    case "message":
      return MessageCircle;
    case "success":
      return CheckCircle;
    case "warning":
      return AlertTriangle;
    case "error":
      return XCircle;
    case "billing":
      return CreditCard;
    case "security":
      return Shield;
    case "system":
      return Settings;
    default:
      return Info;
  }
}

function getNotificationColor(type: string, priority: string) {
  if (priority === "urgent") return "text-red-500 bg-red-50 dark:bg-red-900/20";

  switch (type) {
    case "message":
      return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
    case "success":
      return "text-green-500 bg-green-50 dark:bg-green-900/20";
    case "warning":
      return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    case "error":
      return "text-red-500 bg-red-50 dark:bg-red-900/20";
    case "billing":
      return "text-purple-500 bg-purple-50 dark:bg-purple-900/20";
    case "security":
      return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
    case "system":
      return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    default:
      return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
  }
}

export default NotificationSystem;
