import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Icons } from "./ui/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "message" | "application" | "job_match" | "interview" | "system";
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  data?: any;
  user_id: string;
}

interface RealTimeEvent {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new?: Notification;
  old?: Notification;
}

export function EnhancedNotificationSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter((n) => !n.read).length || 0);
    } catch (error) {
      console.error("Error loading notifications:", error);
      // Use mock notifications for demo
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "job_match",
          title: "New Job Match",
          content:
            "A new Software Engineer position at Google Zurich matches your profile",
          read: false,
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          user_id: user.id,
          data: { jobId: "job-1", matchScore: 95 },
        },
        {
          id: "2",
          type: "application",
          title: "Application Update",
          content: "Your application for UBS has been reviewed",
          read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user_id: user.id,
          data: { applicationId: "app-1", status: "reviewed" },
        },
        {
          id: "3",
          type: "interview",
          title: "Interview Scheduled",
          content: "Interview scheduled for tomorrow at 2 PM with TechCorp",
          read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          user_id: user.id,
          data: { interviewId: "int-1", date: "2024-01-16T14:00:00Z" },
        },
      ];
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    loadNotifications();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealTimeEvent) => {
          console.log("Notification event:", payload);

          if (payload.eventType === "INSERT" && payload.new) {
            setNotifications((prev) => [payload.new!, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Show toast for new notification
            toast({
              title: payload.new.title,
              description: payload.new.content,
              duration: 5000,
            });

            // Browser notification (if permission granted)
            if (Notification.permission === "granted") {
              new Notification(payload.new.title, {
                body: payload.new.content,
                icon: "/favicon.ico",
                tag: payload.new.id,
              });
            }
          } else if (payload.eventType === "UPDATE" && payload.new) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new!.id ? payload.new! : n)),
            );

            if (payload.old && !payload.old.read && payload.new.read) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          } else if (payload.eventType === "DELETE" && payload.old) {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old!.id),
            );
            if (!payload.old.read) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, loadNotifications]);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Fallback for demo
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Fallback for demo
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      const notification = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Fallback for demo
      const notification = notifications.find((n) => n.id === notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <Icons.message className="h-4 w-4 text-blue-600" />;
      case "application":
        return <Icons.file className="h-4 w-4 text-green-600" />;
      case "job_match":
        return <Icons.target className="h-4 w-4 text-purple-600" />;
      case "interview":
        return <Icons.calendar className="h-4 w-4 text-orange-600" />;
      case "system":
        return <Icons.bell className="h-4 w-4 text-gray-600" />;
      default:
        return <Icons.info className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Icons.bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Icons.spinner className="h-4 w-4 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <ScrollArea className="h-96">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start space-x-3 p-3 cursor-pointer hover:bg-accent"
                onClick={() =>
                  !notification.read && markAsRead(notification.id)
                }
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        notification.read
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="h-auto p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Icons.close className="h-3 w-3" />
                    </Button>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      notification.read
                        ? "text-muted-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EnhancedNotificationSystem;
