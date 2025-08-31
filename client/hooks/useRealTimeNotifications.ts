import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { subscribeToNotifications, supabase } from "../lib/supabase";
import type { Database } from "../../app/types/supabase";

type Notification = Database['public']['Tables']['notifications']['Row'];

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Load existing notifications
    const loadNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        setNotifications(data || []);
        setUnreadCount(data?.filter((n) => !n.read).length || 0);
      } catch (err: unknown) {
        console.error("Error loading notifications:", err);
      }
    };

    loadNotifications();

    // Subscribe to real-time updates
    const subscription = subscribeToNotifications(user.id, (payload) => {
      if (payload.eventType === "INSERT" && payload.new) {
        setNotifications((prev) => [payload.new, ...prev.slice(0, 49)]);
        if (!payload.new.read) {
          setUnreadCount((prev) => prev + 1);
        }
      } else if (payload.eventType === "UPDATE" && payload.new) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === payload.new.id ? payload.new : n)),
        );
        if (payload.old && !(payload.old as Notification).read && payload.new.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      } else if (payload.eventType === "DELETE" && payload.old && 'id' in payload.old) {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== (payload.old as Notification).id),
        );
        if (!(payload.old as Notification).read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    });

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user]);

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
    } catch (err: unknown) {
      console.error("Error marking notification as read:", err);
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
    } catch (err: unknown) {
      console.error("Error marking all notifications as read:", err);
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
    } catch (err: unknown) {
      console.error("Error deleting notification:", err);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}
