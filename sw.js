/* eslint-disable no-restricted-globals */

// Service Worker pour Luxe Drive Hub
// Permet les notifications push même quand l'app est fermée

// Installation du service worker
self.addEventListener("install", (event) => {
  console.log("Service Worker installé");
  event.waitUntil(self.skipWaiting());
});

// Activation du service worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activé");
  event.waitUntil(self.clients.claim());
});

// Gestion des notifications push reçues
self.addEventListener("push", (event) => {
  console.log("Notification push reçue:", event);

  if (!event.data) {
    console.log("Pas de données dans la notification push");
    return;
  }

  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: "Nouvelle notification",
      body: event.data.text(),
      icon: "🔔",
    };
  }

  const options = {
    body: notificationData.body || "",
    icon: notificationData.icon || "🔔",
    badge: notificationData.badge || "🔔",
    tag: notificationData.tag || "notification",
    data: notificationData.data || {},
    requireInteraction: notificationData.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title || "Notification", options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener("notificationclick", (event) => {
  console.log("Notification cliquée:", event.notification.tag);
  event.notification.close();

  const urlToOpen = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Vérifier si la fenêtre est déjà ouverte
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Sinon, ouvrir une nouvelle fenêtre
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Gestion de la fermeture des notifications
self.addEventListener("notificationclose", (event) => {
  console.log("Notification fermée:", event.notification.tag);
});

// Gestion des messages depuis les clients
self.addEventListener("message", (event) => {
  console.log("Message reçu par le service worker:", event.data);

  if (event.data.type === "CLOSE_NOTIFICATION") {
    self.registration.getNotifications({ tag: event.data.tag }).then((notifications) => {
      notifications.forEach((notification) => notification.close());
    });
  }
});
