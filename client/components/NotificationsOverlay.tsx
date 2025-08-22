import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Briefcase,
  Users,
  MessageCircle,
  Heart,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Award,
  Zap,
  Eye,
  Settings,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

interface Notification {
  id: string;
  type:
    | "job_match"
    | "application"
    | "message"
    | "system"
    | "achievement"
    | "job_alert";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  data?: any;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "job_match",
    title: "New High Match Job!",
    message:
      "Senior Software Engineer at TechCorp (95% match) - Perfect for your skills in React and TypeScript",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    priority: "high",
    actionUrl: "/job/1",
    data: { matchScore: 95, company: "TechCorp" },
  },
  {
    id: "2",
    type: "application",
    title: "Application Update",
    message:
      "Your application for Product Manager at InnovateCH has been reviewed",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: "medium",
    actionUrl: "/applications",
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message:
      "Sarah from TechCorp sent you a message about the Senior Engineer position",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    priority: "medium",
    actionUrl: "/messages",
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "Congratulations! Your profile is now in the top 5% of candidates",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "low",
    data: { achievement: "top_5_percent" },
  },
  {
    id: "5",
    type: "system",
    title: "Profile Optimization",
    message: "Add 2 more skills to increase your match score by 15%",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    priority: "low",
    actionUrl: "/profile",
  },
];

export function NotificationsOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to add a new notification every 30 seconds
      if (Math.random() < 0.1) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "job_match",
          title: "New Job Match",
          message: `UX Designer at DesignStudio (${Math.floor(Math.random() * 30 + 70)}% match)`,
          timestamp: new Date(),
          read: false,
          priority: "medium",
          actionUrl: "/job/" + Math.floor(Math.random() * 1000),
        };
        setNotifications((prev) => [newNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass =
      priority === "high"
        ? "w-5 h-5 text-red-500"
        : priority === "medium"
          ? "w-5 h-5 text-yellow-500"
          : "w-5 h-5 text-blue-500";

    switch (type) {
      case "job_match":
        return <Briefcase className={iconClass} />;
      case "application":
        return <Users className={iconClass} />;
      case "message":
        return <MessageCircle className={iconClass} />;
      case "achievement":
        return <Award className={iconClass} />;
      case "job_alert":
        return <Bell className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    if (activeTab === "jobs")
      return n.type === "job_match" || n.type === "job_alert";
    return true;
  });

  return (
    <>
      {/* Notification Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-96 max-w-[90vw] bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-jobequal-text dark:text-white">
                    Notifications
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-jobequal-text-muted dark:text-gray-400" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {[
                    { id: "all", label: "All", count: notifications.length },
                    { id: "unread", label: "Unread", count: unreadCount },
                    {
                      id: "jobs",
                      label: "Jobs",
                      count: notifications.filter(
                        (n) => n.type === "job_match" || n.type === "job_alert",
                      ).length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-white dark:bg-gray-600 text-jobequal-text dark:text-white shadow-sm"
                          : "text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white"
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-jobequal-green text-white text-xs rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                {unreadCount > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Bell className="w-12 h-12 text-jobequal-text-muted dark:text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-jobequal-text dark:text-white mb-2">
                      No notifications
                    </h3>
                    <p className="text-jobequal-text-muted dark:text-gray-400 text-sm">
                      You're all caught up! Check back later for updates.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-l-4 ${
                          notification.read ? "opacity-75" : ""
                        } ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(
                              notification.type,
                              notification.priority,
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4
                                  className={`text-sm font-semibold ${
                                    notification.read
                                      ? "text-jobequal-text-muted dark:text-gray-400"
                                      : "text-jobequal-text dark:text-white"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <p
                                  className={`text-sm mt-1 ${
                                    notification.read
                                      ? "text-jobequal-text-muted dark:text-gray-500"
                                      : "text-jobequal-text-muted dark:text-gray-300"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-xs text-jobequal-text-muted dark:text-gray-500">
                                    {formatTimeAgo(notification.timestamp)}
                                  </span>
                                  {notification.data?.matchScore && (
                                    <span className="text-xs bg-jobequal-green text-white px-2 py-1 rounded-full">
                                      {notification.data.matchScore}% match
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                    title="Mark as read"
                                  >
                                    <CheckCircle className="w-4 h-4 text-jobequal-green" />
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </div>

                            {/* Action Button */}
                            {notification.actionUrl && (
                              <div className="mt-3">
                                <a
                                  href={notification.actionUrl}
                                  className="inline-flex items-center text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  {notification.type === "job_match"
                                    ? "View Job"
                                    : notification.type === "application"
                                      ? "View Application"
                                      : notification.type === "message"
                                        ? "View Message"
                                        : "View Details"}
                                  <motion.div
                                    className="ml-1"
                                    animate={{ x: [0, 3, 0] }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                    }}
                                  >
                                    →
                                  </motion.div>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-jobequal-green hover:text-jobequal-green-hover font-medium transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Notification Settings</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Toast notification component for instant feedback
export function ToastNotification({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed top-20 right-6 max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 ${
        notification.priority === "high"
          ? "border-l-4 border-l-red-500"
          : notification.priority === "medium"
            ? "border-l-4 border-l-yellow-500"
            : "border-l-4 border-l-blue-500"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type, notification.priority)}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-jobequal-text dark:text-white">
            {notification.title}
          </h4>
          <p className="text-sm text-jobequal-text-muted dark:text-gray-300 mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-jobequal-text-muted dark:text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
}

function getNotificationIcon(type: string, priority: string) {
  const iconClass =
    priority === "high"
      ? "w-5 h-5 text-red-500"
      : priority === "medium"
        ? "w-5 h-5 text-yellow-500"
        : "w-5 h-5 text-blue-500";

  switch (type) {
    case "job_match":
      return <Briefcase className={iconClass} />;
    case "application":
      return <Users className={iconClass} />;
    case "message":
      return <MessageCircle className={iconClass} />;
    case "achievement":
      return <Award className={iconClass} />;
    case "job_alert":
      return <Bell className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
}
