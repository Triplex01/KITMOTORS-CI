import { useState, useEffect, useCallback } from 'react';

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Erreur permission notification:', error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return null;
    
    try {
      return new Notification(title, {
        icon: '/logo.png',
        badge: '/logo.png',
        ...options
      });
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      return null;
    }
  }, [permission]);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    isGranted: permission === 'granted'
  };
}
