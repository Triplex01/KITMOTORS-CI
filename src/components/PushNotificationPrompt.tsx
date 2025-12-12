import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Vérifier si les notifications sont supportées et pas encore demandées
    if ('Notification' in window && Notification.permission === 'default') {
      const dismissed = localStorage.getItem('notification_prompt_dismissed');
      if (!dismissed) {
        // Attendre un peu avant de montrer le prompt
        const timer = setTimeout(() => setShowPrompt(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Notifications activées !', {
          body: 'Vous recevrez maintenant les alertes importantes.',
          icon: '/logo.png'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
    }
    setShowPrompt(false);
  };

  const dismiss = () => {
    localStorage.setItem('notification_prompt_dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-4 shadow-xl flex items-start gap-3">
        <div className="bg-primary/20 rounded-full p-2">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">Activer les notifications</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Recevez des alertes pour vos rendez-vous, rappels d'entretien et plus.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={requestPermission}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Activer
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
