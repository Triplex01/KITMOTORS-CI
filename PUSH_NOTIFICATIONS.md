# 🔔 Système de Notifications Push - Luxe Drive Hub

## Vue d'ensemble

Le système de notifications push permet aux utilisateurs de recevoir des alertes en temps réel sur l'état de leur véhicule, **même quand ils ne sont pas sur l'application**. Les notifications sont personnalisées en fonction du type d'alerte (assurance, maintenance, diagnostic, etc.).

## ✨ Caractéristiques

### 1. **Notifications en temps réel**
- Les utilisateurs reçoivent les notifications immédiatement
- Les notifications push s'affichent même quand l'app est fermée
- Affichage des toasts dans l'app pour les utilisateurs actifs

### 2. **Types de notifications personnalisées**
Les notifications incluent différents types avec icônes correspondantes :
- 🛡️ **Assurance** - Renouvellement ou mises à jour
- 🔧 **Maintenance** - Entretien programmé
- ✅ **Diagnostic** - Résultats du scan moteur
- 📋 **Rappel** - Visite technique, contrôles
- ⚠️ **Alerte** - Problèmes détectés

### 3. **Niveaux d'urgence**
Chaque notification a un niveau d'urgence qui détermine :
- **High (Urgent)** - `requireInteraction: true` - Exige un clic pour fermer
- **Medium (Attention)** - Notification standard
- **Low (OK)** - Notification informationnelle

### 4. **Intégration Service Worker**
- Service Worker enregistré automatiquement au chargement
- Gère les notifications même quand le navigateur est fermé
- Permet les clics sur les notifications pour revenir à l'app

## 🚀 Utilisation

### Activation des notifications push

**Option 1 : Prompt automatique**
- Un prompt s'affiche automatiquement après 5 secondes
- L'utilisateur peut choisir "Activer" ou "Plus tard"

**Option 2 : Paramètres**
- Allez à `Paramètres` > `Notifications`
- Cliquez sur le switch `Notifications Push`
- Acceptez la demande de permission du navigateur

### Structure d'une notification push

```typescript
interface PushNotificationOptions {
  title: string;           // Titre de la notification
  body: string;            // Corps du message
  icon: string;            // URL de l'icône
  badge: string;           // Badge en haut à droite
  tag: string;             // Identifiant unique
  requireInteraction?: boolean; // Exige un clic pour fermer
  data?: Record<string, string | number | boolean>; // Données custom
}
```

## 📁 Architecture du système

### Fichiers principaux

```
src/
├── hooks/
│   ├── use-push-notifications.ts      # Hook pour gérer les notifications push
│   └── use-vehicle-notifications.ts   # Hook pour les notifications véhicule
├── components/
│   └── PushNotificationPrompt.tsx     # Composant de demande de permission
└── pages/
    └── Settings.tsx                   # Contrôle des notifications

public/
├── sw.js                              # Service Worker
└── notification-icons/                # Icônes des notifications
    ├── shield.png
    ├── wrench.png
    ├── check.png
    ├── clipboard.png
    ├── warning.png
    ├── car.png
    ├── battery.png
    └── default.png
```

## 🔧 API des Hooks

### `usePushNotifications()`

```typescript
const {
  sendPushNotification,          // Envoyer une notification push
  requestNotificationPermission, // Demander la permission
  isNotificationEnabled,         // Vérifier l'état
  closeNotificationsByTag        // Fermer les notifications
} = usePushNotifications();
```

### `useVehicleNotifications()`

```typescript
const {
  notifications,      // Liste des notifications
  unreadCount,        // Nombre de non-lues
  markAsRead,         // Marquer comme lue
  markAllAsRead,      // Tout marquer comme lu
  deleteNotification  // Supprimer une notification
} = useVehicleNotifications();
```

## 📱 Simulation en développement

En développement, le système simule des notifications :
- **Chaque 30 secondes** : 20% de chance d'une nouvelle notification
- Les notifications mock incluent tous les types
- Les Toast s'affichent pour les utilisateurs actifs
- Les notifications push s'affichent si activées

## 🌐 Permissions navigateur

Le système demande la permission pour :
- **Afficher des notifications** - Obligatoire pour les push notifications
- **Service Worker** - Automatiquement enregistré (pas de permission)

### États possibles
- `"granted"` - Notifications autorisées ✅
- `"denied"` - Utilisateur a refusé ❌
- `"default"` - Non demandé (affichera le prompt)

## 🔐 Considérations de sécurité

- Les notifications push ne sont disponibles que sur **HTTPS** (sauf localhost)
- Les données sensibles ne doivent pas être envoyées en clair
- Les clics sur notifications reviennent toujours à l'app (pas de redirection externe)

## 📊 Flux de fonctionnement

```
1. App chargée
   ↓
2. Service Worker enregistré (main.tsx)
   ↓
3. Prompt de notification (PushNotificationPrompt.tsx)
   ↓
4. Utilisateur accepte/refuse
   ↓
5. useVehicleNotifications simule les notifications
   ↓
6. sendPushNotification envoie le push
   ↓
7. Service Worker reçoit et affiche
   ↓
8. Utilisateur clique → App se focus
```

## 🛠️ Personnalisation

### Ajouter un nouveau type de notification

1. Mettez à jour `VehicleNotification` interface :
```typescript
type: "assurance" | "maintenance" | "diagnostic" | "alert" | "reminder" | "MON_TYPE";
```

2. Ajoutez une icône dans `getIconUrl()` :
```typescript
"🎯": "/notification-icons/mon-type.png"
```

3. Générez le titre/message dans les fonctions generator

## 📝 Notes de développement

- Les notifications push utilisent l'API Notification standard du navigateur
- Le Service Worker gère les notifications même hors de l'app
- Les données persistent dans le localStorage via les hooks
- Les timestamps utilisant `Date` pour compatibilité maximale

## 🐛 Dépannage

### Les notifications ne s'affichent pas
1. Vérifiez que la permission est `"granted"`
2. Vérifiez que le Service Worker est enregistré (console)
3. Vérifiez que l'app est en HTTPS (sauf localhost)

### Les notifications push ne fonctionnent pas hors de l'app
1. Assurez-vous que le Service Worker est activé
2. Vérifiez que `sw.js` est dans le `/public` folder
3. Rechargez l'app après avoir activé le Service Worker

### Safari sur iOS
- Support limité pour les Web Push Notifications
- Les notifications en app (Toast) fonctionnent correctement

---

**Version:** 1.0  
**Date:** 28 novembre 2025  
**Créé pour:** Luxe Drive Hub
