import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePushNotifications } from "./use-push-notifications";

export interface VehicleNotification {
  id: string;
  type: "assurance" | "maintenance" | "diagnostic" | "alert" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  icon: string;
  urgency: "high" | "medium" | "low";
  read: boolean;
}

// Mock notifications pour démonstration
const MOCK_NOTIFICATIONS: VehicleNotification[] = [
  {
    id: "notif-1",
    type: "assurance",
    title: "Renouvellement Assurance",
    message: "Votre assurance arrive à échéance dans 15 jours (15 Dec 2025)",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures ago
    icon: "🛡️",
    urgency: "high",
    read: false,
  },
  {
    id: "notif-2",
    type: "maintenance",
    title: "Entretien Programmé",
    message: "Vidange recommandée - Vous avez 2,500 km avant la prochaine vidange",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    icon: "🔧",
    urgency: "medium",
    read: false,
  },
  {
    id: "notif-3",
    type: "diagnostic",
    title: "Diagnostic Complété",
    message: "Scan moteur effectué - État excellent, aucune alerte détectée",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    icon: "✅",
    urgency: "low",
    read: true,
  },
  {
    id: "notif-4",
    type: "reminder",
    title: "Visite Technique",
    message: "Votre visite technique est valide jusqu'au 08 Mai 2026",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    icon: "📋",
    urgency: "low",
    read: true,
  },
  {
    id: "notif-5",
    type: "alert",
    title: "Alerte Moteur",
    message: "Vérification recommandée du système de refroidissement",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    icon: "⚠️",
    urgency: "medium",
    read: true,
  },
];

export function useVehicleNotifications() {
  const [notifications, setNotifications] = useState<VehicleNotification[]>(
    MOCK_NOTIFICATIONS
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();
  const { sendPushNotification, isNotificationEnabled } = usePushNotifications();

  // Mettre à jour le count des non-lus
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Simuler les nouvelles notifications en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% de chance d'ajouter une nouvelle notification chaque 30 secondes
      if (Math.random() < 0.2) {
        const types: Array<"assurance" | "maintenance" | "diagnostic" | "alert" | "reminder"> = [
          "assurance",
          "maintenance",
          "diagnostic",
          "alert",
          "reminder",
        ];
        const urgencies: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];

        const newNotification: VehicleNotification = {
          id: `notif-${Date.now()}`,
          type: types[Math.floor(Math.random() * types.length)],
          title: generateRandomTitle(),
          message: generateRandomMessage(),
          timestamp: new Date(),
          icon: generateRandomIcon(),
          urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
          read: false,
        };

        setNotifications((prev) => [newNotification, ...prev]);

        // Afficher une toast de notification dans l'app
        toast({
          title: newNotification.title,
          description: newNotification.message,
          duration: 5000,
        });

        // Envoyer une notification push si activées et disponibles
        if (isNotificationEnabled()) {
          sendPushNotification({
            title: newNotification.title,
            body: newNotification.message,
            icon: getIconUrl(newNotification.icon),
            badge: getIconUrl(newNotification.icon),
            tag: `vehicle-${newNotification.id}`,
            requireInteraction: newNotification.urgency === "high",
            data: {
              notificationId: newNotification.id,
              type: newNotification.type,
              url: window.location.href,
            },
          });
        }
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [toast, sendPushNotification, isNotificationEnabled]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}

function generateRandomTitle(): string {
  const titles = [
    "Maintenance Programmée",
    "Alerte Système",
    "Renouvellement Assurance",
    "Diagnostic Effectué",
    "Rappel Entretien",
    "Problème Détecté",
    "Service Complété",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateRandomMessage(): string {
  const messages = [
    "Votre véhicule a besoin d'une maintenance",
    "Un problème a été détecté lors du diagnostic",
    "Votre assurance expire bientôt",
    "Vidange recommandée",
    "Pneus à vérifier",
    "Plaquettes de frein usées",
    "Batterie faible",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function generateRandomIcon(): string {
  const icons = ["🛡️", "🔧", "✅", "📋", "⚠️", "🚗", "🔋"];
  return icons[Math.floor(Math.random() * icons.length)];
}

function getIconUrl(emoji: string): string {
  // Convertir l'emoji en une URL valide pour les notifications push
  // Utiliser une icône générique basée sur l'emoji
  const emojiMap: Record<string, string> = {
    "🛡️": "/notification-icons/shield.png",
    "🔧": "/notification-icons/wrench.png",
    "✅": "/notification-icons/check.png",
    "📋": "/notification-icons/clipboard.png",
    "⚠️": "/notification-icons/warning.png",
    "🚗": "/notification-icons/car.png",
    "🔋": "/notification-icons/battery.png",
  };
  return emojiMap[emoji] || "/notification-icons/default.png";
}
