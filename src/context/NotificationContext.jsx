import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastPolled, setLastPolled] = useState(null);
  
  // Use ref to track previous unread count for polling comparison
  const prevUnreadCountRef = useRef(0);
  const initializedRef = useRef(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await api.get('/notifications');
      if (response.data.notifications) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count || 0);
        prevUnreadCountRef.current = response.data.unread_count || 0;
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [currentUser]);

  // Poll for new notifications every 10 seconds
  useEffect(() => {
    if (!currentUser) return;

    // Initial fetch
    fetchNotifications();

    // Set up polling
    const pollInterval = setInterval(() => {
      fetchUnreadCount();
      setLastPolled(new Date());
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [currentUser, fetchNotifications]);

  // Fetch unread count only
  const fetchUnreadCount = async () => {
    if (!currentUser) return;

    try {
      const response = await api.get('/notifications/unread-count');
      const newCount = response.data.unread_count || 0;

      // Show toast if count increased (new notification) and we're past initial load
      if (initializedRef.current && newCount > prevUnreadCountRef.current) {
        // Get the latest notification
        const latestResponse = await api.get('/notifications?per_page=1');
        if (latestResponse.data.notifications.length > 0) {
          const latest = latestResponse.data.notifications[0];
          showToastNotification(latest);
        }
      }

      // Mark as initialized after first poll
      if (!initializedRef.current) {
        initializedRef.current = true;
      }

      prevUnreadCountRef.current = newCount;
      setUnreadCount(newCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Show toast for new notification
  const showToastNotification = (notification) => {
    const icons = {
      new_order: '📦',
      new_negotiation: '💬',
      new_dispute: '⚠️',
      order_update: '📋',
      negotiation_update: '💬',
      dispute_filed: '📨',
    };

    const icon = icons[notification.type] || '🔔';

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto border border-gray-100 overflow-hidden flex items-start gap-3 p-4`}
        >
          <div className="text-2xl">{icon}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
            <p className="text-gray-400 text-xs mt-2">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-right',
      }
    );
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setUnreadCount((prev) =>
        notifications.find((n) => n.id === notificationId)?.is_read
          ? prev
          : Math.max(0, prev - 1)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
