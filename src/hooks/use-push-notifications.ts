import { useEffect } from "react";

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon: string;
  badge: string;
  tag: string;
  requireInteraction?: boolean;
  data?: Record<string, string | number | boolean>;
}

/**
 * Hook pour gérer les notifications push du navigateur
 * Compatible avec les navigateurs supportant l'API Notifications
 */
export function usePushNotifications() {
  // Demander la permission au premier chargement
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        // Demander la permission de manière non-intrusive
        Notification.requestPermission().catch(() => {
          console.log("L'utilisateur a refusé les notifications push");
        });
      }
    }
  }, []);

  /**
   * Envoyer une notification push personnalisée
   */
  const sendPushNotification = async (options: PushNotificationOptions) => {
    if (!("Notification" in window)) {
      console.warn("Les notifications ne sont pas supportées par ce navigateur");
      return false;
    }

    if (Notification.permission !== "granted") {
      console.warn("Permission de notification non accordée");
      return false;
    }

    try {
      // Créer la notification
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon,
        badge: options.badge,
        tag: options.tag,
        requireInteraction: options.requireInteraction ?? false,
        data: options.data,
      });

      // Gérer les événements de notification
      notification.onclick = () => {
        if (options.data?.url && typeof options.data.url === "string") {
          window.open(options.data.url, "_blank");
        }
        notification.close();
      };

      notification.onclose = () => {
        console.log("Notification fermée:", options.tag);
      };

      notification.onerror = () => {
        console.error("Erreur lors de l'affichage de la notification");
      };

      return true;
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification push:", error);
      return false;
    }
  };

  /**
   * Demander la permission explicitement
   */
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("Les notifications ne sont pas supportées");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      return false;
    }
  };

  /**
   * Vérifier si les notifications sont disponibles et autorisées
   */
  const isNotificationEnabled = () => {
    return (
      "Notification" in window && Notification.permission === "granted"
    );
  };

  /**
   * Fermer toutes les notifications avec un tag spécifique
   */
  const closeNotificationsByTag = (tag: string) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.active) {
            registration.active.postMessage({
              type: "CLOSE_NOTIFICATION",
              tag: tag,
            });
          }
        });
      });
    }
  };

  return {
    sendPushNotification,
    requestNotificationPermission,
    isNotificationEnabled,
    closeNotificationsByTag,
  };
}
