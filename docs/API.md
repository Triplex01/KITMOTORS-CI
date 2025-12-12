# 📚 Documentation API - KitMotors

## Vue d'ensemble

Cette documentation décrit les fonctions disponibles pour interagir avec la base de données Firestore.

---

## 🗄 Collections Firestore

| Collection | Description |
|------------|-------------|
| `users` | Utilisateurs de l'application |
| `vehicles` | Véhicules des utilisateurs |
| `notifications` | Notifications système |
| `reports` | Rapports de véhicules |
| `diagnostics` | Diagnostics garage |
| `insurances` | Documents d'assurance |
| `technicalVisits` | Visites techniques |

---

## 👥 Users API

### Types

```typescript
interface User {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'admin';
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
}
```

### Fonctions

#### `getUsers(): Promise<User[]>`
Récupère tous les utilisateurs triés par date de création.

```typescript
import { getUsers } from '@/lib/firestore';

const users = await getUsers();
console.log(users); // [{ id: '...', email: '...', ... }]
```

#### `getUserByEmail(email: string): Promise<User | null>`
Recherche un utilisateur par son email.

```typescript
import { getUserByEmail } from '@/lib/firestore';

const user = await getUserByEmail('john@example.com');
if (user) {
  console.log('Utilisateur trouvé:', user.firstName);
}
```

#### `getUserById(id: string): Promise<User | null>`
Récupère un utilisateur par son ID.

```typescript
import { getUserById } from '@/lib/firestore';

const user = await getUserById('abc123');
```

#### `createUser(userData): Promise<User>`
Crée un nouvel utilisateur.

```typescript
import { createUser } from '@/lib/firestore';

const newUser = await createUser({
  email: 'nouveau@example.com',
  password: 'motdepasse123',
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '+33612345678',
  role: 'client',
  status: 'active'
});
```

#### `updateUser(id: string, userData: Partial<User>): Promise<void>`
Met à jour un utilisateur existant.

```typescript
import { updateUser } from '@/lib/firestore';

await updateUser('abc123', {
  phone: '+33698765432',
  status: 'inactive'
});
```

#### `deleteUser(id: string): Promise<void>`
Supprime un utilisateur.

```typescript
import { deleteUser } from '@/lib/firestore';

await deleteUser('abc123');
```

---

## 🚗 Vehicles API

### Types

```typescript
interface Vehicle {
  id?: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  mileage?: number;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
}
```

### Fonctions

#### `getVehicles(): Promise<Vehicle[]>`
Récupère tous les véhicules.

```typescript
import { getVehicles } from '@/lib/firestore';

const vehicles = await getVehicles();
```

#### `getVehiclesByUser(userId: string): Promise<Vehicle[]>`
Récupère les véhicules d'un utilisateur spécifique.

```typescript
import { getVehiclesByUser } from '@/lib/firestore';

const userVehicles = await getVehiclesByUser('user123');
```

#### `createVehicle(vehicleData): Promise<Vehicle>`
Crée un nouveau véhicule.

```typescript
import { createVehicle } from '@/lib/firestore';

const newVehicle = await createVehicle({
  userId: 'user123',
  brand: 'Mercedes-Benz',
  model: 'GLE 350d',
  year: 2023,
  licensePlate: 'AB-123-CD',
  vin: 'WDB1234567890',
  color: 'Noir',
  mileage: 15000,
  status: 'active'
});
```

#### `updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<void>`
Met à jour un véhicule.

```typescript
import { updateVehicle } from '@/lib/firestore';

await updateVehicle('vehicle123', {
  mileage: 20000
});
```

#### `deleteVehicle(id: string): Promise<void>`
Supprime un véhicule.

```typescript
import { deleteVehicle } from '@/lib/firestore';

await deleteVehicle('vehicle123');
```

---

## 🔔 Notifications API

### Types

```typescript
interface Notification {
  id?: string;
  userId: string | 'all';
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  createdAt?: Timestamp;
}
```

### Fonctions

#### `getNotifications(): Promise<Notification[]>`
Récupère toutes les notifications.

#### `getNotificationsByUser(userId: string): Promise<Notification[]>`
Récupère les notifications d'un utilisateur (incluant les notifications globales).

```typescript
import { getNotificationsByUser } from '@/lib/firestore';

const notifications = await getNotificationsByUser('user123');
// Inclut les notifications où userId === 'user123' OU userId === 'all'
```

#### `createNotification(notifData): Promise<Notification>`
Crée une nouvelle notification.

```typescript
import { createNotification } from '@/lib/firestore';

// Notification pour un utilisateur spécifique
await createNotification({
  userId: 'user123',
  title: 'Rappel Assurance',
  message: 'Votre assurance expire dans 30 jours',
  type: 'warning'
});

// Notification pour tous les utilisateurs
await createNotification({
  userId: 'all',
  title: 'Maintenance programmée',
  message: 'Le système sera en maintenance demain',
  type: 'info'
});
```

#### `markNotificationAsRead(id: string): Promise<void>`
Marque une notification comme lue.

```typescript
import { markNotificationAsRead } from '@/lib/firestore';

await markNotificationAsRead('notif123');
```

---

## 📊 Stats API

#### `getStats(): Promise<Stats>`
Récupère les statistiques globales.

```typescript
import { getStats } from '@/lib/firestore';

const stats = await getStats();
console.log(stats);
// {
//   totalUsers: 150,
//   totalVehicles: 320,
//   activeVehicles: 285,
//   totalNotifications: 1200,
//   unreadNotifications: 45
// }
```

---

## 🔧 Configuration Firebase

### Fichier: `src/lib/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
```

---

## 🛡️ Règles de Sécurité

Les règles Firestore actuelles (développement) :

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if true;
      allow read, update: if true;
      allow delete: if true;
    }
    
    match /vehicles/{vehicleId} {
      allow read, write: if true;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ **Note**: Ces règles sont permissives pour le développement. En production, implémenter une authentification stricte.

---

## 📝 Exemples d'utilisation

### Inscription d'un utilisateur

```typescript
import { createUser, getUserByEmail } from '@/lib/firestore';

async function registerUser(formData) {
  // Vérifier si l'email existe déjà
  const existingUser = await getUserByEmail(formData.email);
  if (existingUser) {
    throw new Error('Un compte avec cet email existe déjà');
  }

  // Créer le compte
  const newUser = await createUser({
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    role: 'client',
    status: 'active'
  });

  return newUser;
}
```

### Connexion d'un utilisateur

```typescript
import { getUserByEmail } from '@/lib/firestore';

async function loginUser(email, password) {
  const user = await getUserByEmail(email);
  
  if (!user || user.password !== password) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Stocker la session
  localStorage.setItem('token', 'token-' + user.id);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
}
```

### Ajouter un véhicule

```typescript
import { createVehicle } from '@/lib/firestore';

async function addVehicle(userId, vehicleData) {
  const vehicle = await createVehicle({
    userId,
    brand: vehicleData.brand,
    model: vehicleData.model,
    year: vehicleData.year,
    licensePlate: vehicleData.licensePlate,
    status: 'active'
  });

  return vehicle;
}
```

---

## 🔗 Ressources

- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation Firestore](https://firebase.google.com/docs/firestore)
- [React Query](https://tanstack.com/query/latest)
