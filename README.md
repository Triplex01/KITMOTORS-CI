# 🚗 KitMotors - Application Web de Gestion de Flotte Automobile

<p align="center">
  <img src="public/logo.png" alt="KitMotors Logo" width="300"/>
</p>

<p align="center">
  <strong>Une application web moderne pour la gestion complète de véhicules automobiles</strong>
</p>

<p align="center">
  <a href="#-fonctionnalités">Fonctionnalités</a> •
  <a href="#-stack-technique">Stack Technique</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-structure-du-projet">Structure</a> •
  <a href="#-base-de-données">Base de Données</a>
</p>

---

## 📋 Aperçu du Projet

**KitMotors** est une application web complète de gestion de flotte automobile permettant aux utilisateurs de :
- Gérer leurs véhicules et suivre l'historique des entretiens
- Recevoir des notifications push pour les rappels d'assurance et de maintenance
- Consulter les diagnostics et rapports de véhicules
- Accéder à un tableau de bord personnalisé

L'application est composée de deux parties :
- **Client** : Interface utilisateur pour les propriétaires de véhicules
- **Admin** : Panneau d'administration pour la gestion centralisée

---

## ✨ Fonctionnalités

### Application Client
| Fonctionnalité | Description |
|----------------|-------------|
| 🔐 Authentification | Inscription, connexion, récupération de mot de passe |
| 🚗 Gestion des véhicules | Ajout, modification, suppression de véhicules |
| 📊 Tableau de bord | Vue d'ensemble des véhicules et alertes |
| 🔔 Notifications push | Rappels d'assurance, maintenance, visites techniques |
| 📱 PWA | Installation sur mobile comme application native |
| 🌙 Mode sombre/clair | Thème adaptatif |

### Panneau Admin
| Fonctionnalité | Description |
|----------------|-------------|
| 👥 Gestion utilisateurs | Liste et gestion des clients |
| 📝 Rapports véhicules | Création et envoi de rapports |
| 🛡️ Assurances | Réception et dispatch des documents |
| 🔧 Diagnostics | Réception des rapports garage |
| 📋 Visites techniques | Gestion des contrôles techniques |

---

## 🛠 Stack Technique

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| **React** | 18.3.1 | Bibliothèque UI |
| **TypeScript** | 5.6.2 | Typage statique |
| **Vite** | 5.4.21 | Build tool & dev server |
| **Tailwind CSS** | 3.4.17 | Framework CSS utilitaire |
| **shadcn/ui** | - | Composants UI réutilisables |
| **Lucide React** | 0.462.0 | Icônes |
| **React Router** | 7.5.0 | Navigation SPA |
| **React Query** | 5.83.0 | Gestion des données async |

### Backend & Base de Données
| Technologie | Description |
|-------------|-------------|
| **Firebase** | Backend-as-a-Service |
| **Cloud Firestore** | Base de données NoSQL temps réel |
| **Firebase Hosting** | Hébergement statique |
| **Firebase Auth** | Authentification (préparé) |

### Outils de Développement
| Outil | Description |
|-------|-------------|
| **ESLint** | Linting du code |
| **PostCSS** | Traitement CSS |
| **Git** | Contrôle de version |

---

## 📦 Installation

### Prérequis
- Node.js >= 18.x
- npm >= 9.x ou yarn >= 1.22
- Compte Firebase (pour la base de données)

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/Triplex01/luxe-drive-hub.git

# 2. Accéder au dossier
cd luxe-drive-hub

# 3. Installer les dépendances
npm install

# 4. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Firebase

# 5. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Scripts disponibles

```bash
npm run dev       # Lancer le serveur de développement
npm run build     # Build de production
npm run preview   # Prévisualiser le build
npm run lint      # Vérifier le code avec ESLint
```

---

## 📁 Structure du Projet

```
luxe-drive-hub/
├── 📂 public/                    # Fichiers statiques
│   ├── logo.png                  # Logo de l'application
│   ├── manifest.json             # Configuration PWA
│   ├── sw.js                     # Service Worker
│   └── notification-icons/       # Icônes de notifications
│
├── 📂 src/                       # Code source
│   ├── 📂 components/            # Composants React réutilisables
│   │   ├── 📂 ui/                # Composants shadcn/ui
│   │   ├── Layout.tsx            # Layout principal
│   │   ├── Logo.tsx              # Composant logo
│   │   └── ProtectedRoute.tsx    # Route protégée
│   │
│   ├── 📂 contexts/              # Contextes React
│   │   ├── AuthContext.tsx       # Gestion de l'authentification
│   │   └── ThemeContext.tsx      # Gestion du thème
│   │
│   ├── 📂 hooks/                 # Hooks personnalisés
│   │   ├── use-push-notifications.ts  # Notifications push
│   │   ├── use-toast.ts          # Notifications toast
│   │   └── use-theme.ts          # Hook thème
│   │
│   ├── 📂 lib/                   # Utilitaires et configurations
│   │   ├── firebase.ts           # Configuration Firebase
│   │   ├── firestore.ts          # Opérations Firestore (CRUD)
│   │   └── utils.ts              # Fonctions utilitaires
│   │
│   ├── 📂 pages/                 # Pages de l'application
│   │   ├── Dashboard.tsx         # Tableau de bord
│   │   ├── Login.tsx             # Page de connexion
│   │   ├── Register.tsx          # Page d'inscription
│   │   ├── Vehicles.tsx          # Gestion des véhicules
│   │   ├── Notifications.tsx     # Centre de notifications
│   │   └── Settings.tsx          # Paramètres utilisateur
│   │
│   ├── 📂 services/              # Services API
│   ├── 📂 stores/                # State management (si utilisé)
│   │
│   ├── App.tsx                   # Composant racine
│   ├── main.tsx                  # Point d'entrée
│   └── index.css                 # Styles globaux
│
├── 📂 server/                    # Backend Node.js (optionnel)
│
├── 📄 firebase.json              # Configuration Firebase
├── 📄 firestore.rules            # Règles de sécurité Firestore
├── 📄 tailwind.config.ts         # Configuration Tailwind
├── 📄 vite.config.ts             # Configuration Vite
├── 📄 tsconfig.json              # Configuration TypeScript
└── 📄 package.json               # Dépendances et scripts
```

---

## 🗄 Base de Données

### Architecture Firestore

L'application utilise **Cloud Firestore** (NoSQL) avec la structure suivante :

```
firestore/
├── 📁 users/                     # Collection des utilisateurs
│   └── {userId}/
│       ├── email: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── phone: string
│       ├── role: 'client' | 'admin'
│       ├── status: 'active' | 'inactive'
│       ├── password: string (hashé)
│       └── createdAt: timestamp
│
├── 📁 vehicles/                  # Collection des véhicules
│   └── {vehicleId}/
│       ├── userId: string (référence)
│       ├── brand: string
│       ├── model: string
│       ├── year: number
│       ├── licensePlate: string
│       ├── vin: string
│       ├── color: string
│       ├── mileage: number
│       ├── status: 'active' | 'inactive'
│       └── createdAt: timestamp
│
├── 📁 notifications/             # Collection des notifications
│   └── {notificationId}/
│       ├── userId: string | 'all'
│       ├── title: string
│       ├── message: string
│       ├── type: 'info' | 'warning' | 'success' | 'alert'
│       ├── read: boolean
│       └── createdAt: timestamp
│
├── 📁 reports/                   # Rapports de véhicules
├── 📁 diagnostics/               # Diagnostics garage
├── 📁 insurances/                # Documents d'assurance
└── 📁 technicalVisits/           # Visites techniques
```

### Schéma des Types TypeScript

```typescript
// src/lib/firestore.ts

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

### Règles de Sécurité Firestore

```javascript
// firestore.rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Utilisateurs
    match /users/{userId} {
      allow create: if true;  // Inscription ouverte
      allow read, update: if true;
      allow delete: if true;  // Admin seulement en prod
    }
    
    // Véhicules
    match /vehicles/{vehicleId} {
      allow read, write: if true;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if true;
    }
  }
}
```

---

## 🔐 Authentification

### Flux d'authentification actuel

1. **Inscription** : Création d'un compte dans Firestore
2. **Connexion** : Vérification email/mot de passe
3. **Session** : Stockage du token dans localStorage
4. **Protection** : Routes protégées via `ProtectedRoute`

```typescript
// Exemple de connexion
const user = await getUserByEmail(email);
if (user && user.password === password) {
  localStorage.setItem('token', 'token-' + user.id);
  localStorage.setItem('user', JSON.stringify(user));
}
```

### Comptes de test

| Type | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@kitmotors.com | admin123 |
| Client | demo@kitmotors.com | demo123 |

---

## 🎨 Design System

### Palette de couleurs

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--primary` | `hsl(0, 72%, 51%)` | Rouge accent |
| `--background` | `hsl(0, 0%, 7%)` | Fond sombre |
| `--card` | `hsl(0, 0%, 11%)` | Cartes |
| `--muted` | `hsl(0, 0%, 60%)` | Texte secondaire |

### Polices

| Usage | Police | Fallback |
|-------|--------|----------|
| Titres | Space Grotesk | Verdana |
| Corps | Verdana | Geneva, sans-serif |

### Composants UI

Les composants sont basés sur **shadcn/ui** et personnalisés :
- `Button`, `Card`, `Input`, `Select`
- `Dialog`, `Toast`, `Tabs`
- `Table`, `Badge`, `Avatar`

---

## 🚀 Déploiement

### Firebase Hosting

```bash
# Build de production
npm run build

# Déploiement
npx firebase deploy --only hosting
```

### URLs de production

| Application | URL |
|-------------|-----|
| Client | https://kitmotors-app-web.web.app |
| Admin | https://kitmotors-admin.web.app |

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 👥 Équipe

- **Développeur Principal** - Cherif Aboubacar

---

<p align="center">
  <strong>KitMotors</strong> - Rêvez vos ambitions 🚗
</p>
