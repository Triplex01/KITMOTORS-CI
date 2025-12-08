import { useEffect } from "react";
import { usePushNotifications } from "./use-push-notifications";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook pour envoyer une notification d'urgence d'assurance
 * S'exécute une fois au démarrage de l'app
 */
export function useInsuranceUrgencyNotification() {
  const { sendPushNotification, isNotificationEnabled } = usePushNotifications();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si on a déjà envoyé la notification aujourd'hui
    const lastNotificationDate = localStorage.getItem("lastInsuranceNotificationDate");
    const today = new Date().toDateString();

    if (lastNotificationDate === today) {
      // Notification déjà envoyée aujourd'hui
      return;
    }

    // Envoyer la notification d'urgence
    const sendUrgencyNotification = async () => {
      // Toast pour les utilisateurs actifs
      toast({
        title: "🛡️ URGENCE - Assurance Véhicule",
        description: "Votre assurance automobile expire dans 15 jours. Action requise immédiatement.",
        duration: 8000,
      });

      // Push notification si activées
      if (isNotificationEnabled) {
        await sendPushNotification({
          title: "🛡️ URGENCE - Renouvellement Assurance",
          body: "⚠️ Votre assurance automobile Mercedes-Benz expire dans 15 jours (15 décembre 2025). Action requise IMMÉDIATEMENT pour éviter l'interruption de couverture.",
          icon: "/notification-icons/shield.png",
          badge: "/notification-icons/shield.png",
          tag: "insurance-urgency",
          requireInteraction: true,
          data: {
            type: "assurance",
            urgency: "high",
            action: "renew",
            expiryDate: "2025-12-15",
          },
        });
      }

      // Marquer que la notification a été envoyée aujourd'hui
      localStorage.setItem("lastInsuranceNotificationDate", today);
    };

    // Attendre 2 secondes avant d'envoyer la notification
    const timer = setTimeout(() => {
      sendUrgencyNotification();
    }, 2000);

    return () => clearTimeout(timer);
  }, [sendPushNotification, isNotificationEnabled, toast]);
}
