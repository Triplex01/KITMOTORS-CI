import { useState, useEffect } from 'react';
import { getNotificationsByUser } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

export function useVehicleNotifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      if (!isAuthenticated || !user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getNotificationsByUser(user.id);
        setNotifications(data.map(n => ({
          ...n,
          createdAt: n.createdAt?.toDate?.() || new Date()
        })) as unknown as Notification[]);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    // TODO: Mettre à jour dans Firestore
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // TODO: Mettre à jour dans Firestore
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}
