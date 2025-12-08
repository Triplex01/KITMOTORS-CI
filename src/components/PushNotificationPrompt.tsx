import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { requestNotificationPermission, isNotificationEnabled } = usePushNotifications();

  useEffect(() => {
    // Vérifier si les notifications sont déjà autorisées
    // Si non, afficher le prompt après 5 secondes
    if (!isNotificationEnabled() && "Notification" in window) {
      const timer = setTimeout(() => {
        if (Notification.permission === "default") {
          setShowPrompt(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isNotificationEnabled]);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShowPrompt(false);
      // Afficher une notification de confirmation
      new Notification("Notifications activées! 🎉", {
        body: "Vous recevrez désormais les notifications en temps réel.",
        icon: "🔔",
        badge: "🔔",
      });
    }
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gold/20 border border-gold/30 rounded-lg p-4 shadow-lg max-w-sm z-50 animate-slide-in">
      <div className="flex items-start gap-3">
        <Bell className="w-5 h-5 text-gold flex-shrink-0 mt-1" strokeWidth={1.5} />
        <div className="flex-1">
          <h3 className="font-light text-foreground mb-1">Notifications en temps réel</h3>
          <p className="text-sm text-muted-foreground font-light mb-3">
            Activez les notifications push pour recevoir les alertes véhicule même quand vous n'êtes pas sur l'app.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEnable}
              className="px-3 py-1 bg-gold text-white rounded text-sm font-light hover:bg-gold/90 transition-colors"
            >
              Activer
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1 bg-secondary text-foreground rounded text-sm font-light hover:bg-secondary/80 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
