# 📁 Structure du Projet Luxe Admin Dashboard

```
luxe-admin-dashboard/
│
├── 📄 Configuration Files
│   ├── package.json                # Dépendances et scripts
│   ├── tsconfig.json              # Configuration TypeScript
│   ├── tsconfig.node.json         # TypeScript pour Vite
│   ├── vite.config.ts             # Configuration Vite
│   ├── tailwind.config.ts         # Configuration Tailwind CSS
│   ├── postcss.config.cjs         # PostCSS config
│   ├── .prettierrc                # Prettier code formatting
│   ├── .eslintrc.cjs              # ESLint configuration
│   ├── .gitignore                 # Git ignore rules
│   ├── .env.example               # Environment template
│   │
│   ├── 🐳 Docker
│   ├── Dockerfile                 # Docker image
│   ├── docker-compose.yml         # Docker compose
│   │
│   └── 📚 Documentation
│       ├── README.md              # Guide principal
│       ├── API_DOCUMENTATION.md   # Endpoints API
│       ├── DEPLOYMENT.md          # Guide déploiement
│       └── PROJECT_STRUCTURE.md   # Ce fichier
│
├── 📦 src/
│   │
│   ├── 🎯 Entry Points
│   ├── main.tsx                   # Point d'entrée React
│   ├── App.tsx                    # Routeur principal
│   │
│   ├── 🎨 Styling
│   └── index.css                  # Styles Tailwind globaux
│
├── 🧩 src/components/
│   ├── Header.tsx                 # Barre supérieure avec nav
│   │   ├── Logo
│   │   ├── Notifications button
│   │   ├── Settings button
│   │   └── User profile dropdown
│   │
│   └── Sidebar.tsx                # Navigation latérale
│       ├── Menu items
│       ├── Mobile toggle
│       └── Footer info
│
├── 📄 src/pages/
│   │
│   ├── LoginPage.tsx              # 🔐 Authentification
│   │   ├── Email input
│   │   ├── Password input
│   │   ├── Form validation
│   │   └── Error handling
│   │
│   ├── DashboardPage.tsx          # 📊 Vue d'ensemble
│   │   ├── KPI Cards
│   │   │   ├── Total Users
│   │   │   ├── Total Vehicles
│   │   │   ├── Pending Documents
│   │   │   └── Active Notifications
│   │   ├── Recent Activity
│   │   └── Quick Actions
│   │
│   ├── NotificationsPage.tsx      # 🔔 Gestion notifications
│   │   ├── Create Form
│   │   │   ├── Title input
│   │   │   ├── Message textarea
│   │   │   ├── Image URL
│   │   │   └── Target group selector
│   │   ├── Notifications List
│   │   │   ├── Status badge
│   │   │   ├── Read rate
│   │   │   └── Send button
│   │   └── Filters
│   │
│   ├── DocumentsPage.tsx          # 📄 Gestion documents
│   │   ├── Upload Zone (Dropzone)
│   │   │   ├── Drag-drop area
│   │   │   ├── File validation
│   │   │   └── Progress bar
│   │   ├── Documents List
│   │   │   ├── Document cards
│   │   │   ├── Approve button
│   │   │   ├── Reject button
│   │   │   └── Download button
│   │   └── Status Filters
│   │       ├── All
│   │       ├── Pending
│   │       ├── Approved
│   │       └── Rejected
│   │
│   ├── VehiclesPage.tsx           # 🚗 Gestion véhicules
│   │   ├── Vehicle List
│   │   │   ├── Vehicle card
│   │   │   │   ├── Make/Model
│   │   │   │   ├── License plate
│   │   │   │   ├── Year
│   │   │   │   ├── Color
│   │   │   │   ├── Mileage
│   │   │   │   └── Status badge
│   │   │   ├── View details button
│   │   │   └── View documents button
│   │   ├── Status Tabs
│   │   │   ├── All
│   │   │   ├── Active
│   │   │   ├── Pending Review
│   │   │   └── Inactive
│   │   └── Pending Updates
│   │       ├── Update card
│   │       ├── Old → New value
│   │       ├── Approve button
│   │       └── Reject button
│   │
│   └── SettingsPage.tsx           # ⚙️ Paramètres admin
│       ├── Notifications Settings
│       │   ├── Email toggle
│       │   ├── SMS toggle
│       │   └── Weekly reports toggle
│       ├── Security Settings
│       │   ├── Auto-approve toggle
│       │   └── Change password button
│       ├── File Upload Settings
│       │   └── Max file size input
│       └── Save button
│
├── 🎯 src/stores/ (Zustand State Management)
│   ├── authStore.ts               # État d'authentification
│   │   ├── user (AuthUser | null)
│   │   ├── token (string | null)
│   │   ├── isAuthenticated (boolean)
│   │   ├── isLoading (boolean)
│   │   ├── login()
│   │   ├── logout()
│   │   ├── setUser()
│   │   └── setToken()
│   │
│   ├── notificationStore.ts       # État des notifications
│   │   ├── notifications[]
│   │   ├── isLoading
│   │   ├── error
│   │   ├── fetchNotifications()
│   │   ├── sendNotification()
│   │   ├── updateNotification()
│   │   └── deleteNotification()
│   │
│   └── vehicleStore.ts            # État des véhicules
│       ├── vehicles[]
│       ├── documents[]
│       ├── updates[]
│       ├── isLoading
│       ├── error
│       ├── fetchVehicles()
│       ├── fetchDocuments()
│       ├── fetchUpdates()
│       ├── addVehicle()
│       ├── uploadDocument()
│       ├── approveDocument()
│       ├── rejectDocument()
│       ├── approveUpdate()
│       └── rejectUpdate()
│
├── 🔌 src/services/ (API & WebSocket)
│   │
│   ├── api.ts                     # Client Axios
│   │   ├── apiClient instance
│   │   ├── Request interceptor (token injection)
│   │   ├── Response interceptor (401 handling)
│   │   ├── authService
│   │   │   ├── login()
│   │   │   ├── logout()
│   │   │   └── getProfile()
│   │   ├── notificationService
│   │   │   ├── getAll()
│   │   │   ├── create()
│   │   │   ├── update()
│   │   │   ├── delete()
│   │   │   └── send()
│   │   ├── vehicleService
│   │   │   ├── getAll()
│   │   │   ├── getById()
│   │   │   ├── create()
│   │   │   └── update()
│   │   ├── documentService
│   │   │   ├── getAll()
│   │   │   ├── getByVehicle()
│   │   │   ├── upload()
│   │   │   ├── approve()
│   │   │   └── reject()
│   │   └── updateService
│   │       ├── getAll()
│   │       ├── getPending()
│   │       ├── approve()
│   │       └── reject()
│   │
│   └── socket.ts                  # Socket.IO WebSocket
│       ├── initializeSocket()
│       ├── disconnectSocket()
│       ├── getSocket()
│       ├── onDashboardUpdate()
│       ├── onNotificationSent()
│       ├── onDocumentStatusChange()
│       ├── onVehicleUpdateRequest()
│       └── emitEvent()
│
├── 📝 src/types/
│   └── index.ts                   # TypeScript definitions
│       ├── AuthUser
│       ├── LoginCredentials
│       ├── AuthResponse
│       ├── PushNotification
│       ├── VehicleDocument
│       ├── Vehicle
│       ├── VehicleUpdate
│       ├── DashboardStats
│       └── RecentActivity
│
└── 📦 Public Assets
    └── index.html                 # HTML template


═══════════════════════════════════════════════════════════════

## 📊 Statistiques du Projet

- **Total Files**: ~20 fichiers source
- **Lines of Code**: ~2,500+ lignes
- **Components**: 2 réutilisables (Header, Sidebar)
- **Pages**: 6 pages principales
- **Stores**: 3 stores Zustand
- **Services**: 2 (API, WebSocket)
- **Types**: 10+ interfaces TypeScript

## 🎯 Points d'Entrée Clés

1. **main.tsx** → React app mount
2. **App.tsx** → Routing et Protected Routes
3. **index.html** → HTML template

## 🔄 Flux de Données

```
User Input
    ↓
Component/Page
    ↓
Zustand Store
    ↓
API Service / WebSocket
    ↓
Backend
    ↓
Store Update
    ↓
Component Re-render
```

## 🔐 Routes Protégées

```
/ (Dashboard) ← ProtectedRoute
/notifications ← ProtectedRoute
/documents ← ProtectedRoute
/vehicles ← ProtectedRoute
/settings ← ProtectedRoute
/login (Public)
```

## 🎨 Design System

- **Spacing**: Tailwind defaults (4px units)
- **Colors**: Luxury palette + Gold accents
- **Fonts**: Playfair (headings) + Inter (body)
- **Shadows**: Custom luxury shadows
- **Border Radius**: 8px (lg), 12px (xl)
- **Responsive Breakpoints**: sm (640px), md (768px), lg (1024px)

## 📦 Dépendances Clés

- **React 18**: Framework UI
- **TypeScript 5**: Type safety
- **Vite 5**: Build tool
- **Tailwind CSS 3**: Styling
- **Zustand 4**: State management
- **Axios 1.6**: HTTP client
- **Socket.IO Client 4.7**: WebSocket
- **React Router 6**: Routing
- **React Hot Toast 2.4**: Notifications
- **React Dropzone 14**: File upload
- **Lucide React**: Icons
- **Day.js**: Date formatting

## 🚀 Scripts npm

```bash
npm run dev         # Dev server (port 5173)
npm run build       # Build production
npm run preview     # Preview build
npm run type-check  # TypeScript check
npm run lint        # ESLint check
```

## 📁 Fichiers Non Inclus (À Créer)

- `.env` - Variables d'environnement (local)
- `src/hooks/` - Custom React hooks (si nécessaire)
- `src/utils/` - Utilitaires (si nécessaire)
- `tests/` - Tests unitaires/intégration

═══════════════════════════════════════════════════════════════

**Structure créée avec soin pour scalabilité et maintenabilité.**
