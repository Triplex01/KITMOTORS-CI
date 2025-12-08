# 🚀 Guide d'Intégration Admin-Client

## 📋 Architecture Complète

```
┌─────────────────────────────────────────────────────────────┐
│                    LUXE DRIVE HUB SYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CLIENT APP                ADMIN DASHBOARD        SERVER    │
│  (Port 5173)               (Port 5174)           (Port 3000) │
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │              │     │              │     │             │ │
│  │  User App    │────▶│  Admin App   │────▶│   Node.js   │ │
│  │              │     │              │     │   Express   │ │
│  │  - Login     │     │  - Login     │     │   + Socket  │ │
│  │  - Vehicles  │     │  - Create    │     │   + DB      │ │
│  │  - Notif Rx  │◀────│    Notifs    │◀────│             │ │
│  └──────────────┘     └──────────────┘     │  PostgreSQL │ │
│        ▲                                    │             │ │
│        │                                    │  - Users    │ │
│        └────────────────────────────────────│  - Vehicles │ │
│         Socket.IO (WebSocket)               │  - Notifs   │ │
│                                             │  - Updates  │ │
│                                             └─────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🗄️ Base de Données (PostgreSQL)

### Schéma Relationnel

```sql
users (Clients)
├── id (UUID)
├── email
├── password_hash
├── first_name, last_name
├── created_at

vehicles
├── id (UUID)
├── user_id (FK → users)
├── vin, license_plate
├── make, model, year
├── status

notifications
├── id (UUID)
├── admin_id (FK → admin_users)
├── title, message
├── target_type (all/vehicle/user)
├── target_id
├── status (draft/sent)

notification_history (Suivi)
├── notification_id
├── user_id
├── status (sent/delivered/read)
├── delivered_at, read_at
```

## 🔐 Authentification

### Login Client
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "client@luxedrive.com",
  "password": "password123",
  "userType": "client"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "client@luxedrive.com",
    "firstName": "John",
    "userType": "client"
  }
}
```

### Login Admin
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@luxedrive.com",
  "password": "admin123",
  "userType": "admin"
}
```

## 🔌 WebSocket (Socket.IO)

### Flux de Communication

#### 1️⃣ Client se connecte
```typescript
// Client se connecte au serveur WebSocket
io('http://localhost:3000')

// Authentification
socket.emit('user:login', {
  userId: 'user-uuid',
  userType: 'client'
})

// Serveur valide et charge les véhicules
socket.on('vehicle:list', (vehicles) => {
  console.log('Mon véhicules:', vehicles)
})
```

#### 2️⃣ Admin envoie notification
```typescript
// Admin envoie une notification
socket.emit('notification:send', {
  title: 'Service Maintenance Requis',
  message: 'Votre véhicule a besoin d\'une révision',
  targetType: 'vehicle',  // ou 'all', 'user'
  vehicleIds: ['vehicle-uuid-1'],
})

// Admin reçoit la confirmation
socket.on('notification:sent', (data) => {
  console.log('Envoyé à', data.recipientCount, 'utilisateurs')
})
```

#### 3️⃣ Client reçoit notification
```typescript
// Client connecté reçoit la notification en temps réel
socket.on('notification:received', (notification) => {
  console.log('📬 Notification:', notification.title)
  
  // Afficher dans l'app + notification navigateur
  showToast(notification.title, notification.message)
  
  // Accuser réception
  socket.emit('notification:acknowledge', {
    notificationId: notification.id
  })
})
```

## 📱 Intégration Client App (React)

### 1. Installer dépendances
```bash
cd /Users/cherifaboubacar/Desktop/APP\ WEB/luxe-drive-hub

# Vérifier que socket.io-client est installé
npm install socket.io-client zustand

# ou si déjà dans package.json
npm install
```

### 2. Ajouter AuthStore au client
```typescript
// src/stores/authStore.ts
import { create } from 'zustand'

interface AuthUser {
  id: string
  email: string
  firstName?: string
  userType: 'client' | 'admin'
}

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('auth_token'),

  login: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType: 'client' })
    })
    const { token, user } = await response.json()
    localStorage.setItem('auth_token', token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null })
  }
}))
```

### 3. Créer LoginPage pour Client
```typescript
// src/pages/ClientLoginPage.tsx
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

export const ClientLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Client Login</h1>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </button>

      <p className="text-center mt-4 text-sm text-gray-600">
        Demo: client@luxedrive.com / password123
      </p>
    </form>
  )
}
```

### 4. Intégrer NotificationCenter dans App.tsx
```typescript
// src/App.tsx
import { NotificationCenter } from './components/NotificationCenter'
import { ClientLoginPage } from './pages/ClientLoginPage'
import { useAuthStore } from './stores/authStore'

function App() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      {user ? (
        <>
          <YourDashboard />
          <NotificationCenter /> {/* ← Affiche les notifications */}
        </>
      ) : (
        <ClientLoginPage />
      )}
    </div>
  )
}

export default App
```

## 🖥️ Intégration Admin Dashboard

### Modifier NotificationsPage pour envoyer via Socket.IO
```typescript
// src/components/Adminstrtor app web/src/pages/NotificationsPage.tsx
import { useEffect } from 'react'
import { getSocket } from './services/socketClient.ts'

export const NotificationsPage = () => {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [targetType, setTargetType] = useState<'all' | 'vehicle'>('all')

  const handleSend = () => {
    const socket = getSocket()
    
    socket?.emit('notification:send', {
      title,
      message,
      targetType,
      vehicleIds: [], // ou IDs sélectionnés
    })

    socket?.on('notification:sent', (data) => {
      toast.success(`Envoyé à ${data.recipientCount} utilisateurs`)
    })
  }

  return (
    <div>
      {/* Form */}
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <select value={targetType} onChange={(e) => setTargetType(e.target.value as any)}>
        <option value="all">Tous les utilisateurs</option>
        <option value="vehicle">Véhicules spécifiques</option>
      </select>
      <button onClick={handleSend}>Envoyer</button>
    </div>
  )
}
```

## 🚀 Installation & Démarrage

### 1. Setup Base de Données
```bash
# PostgreSQL (local ou cloud)
createdb luxe_drive_hub

# Importer le schéma
psql luxe_drive_hub < server/schema.sql
```

### 2. Démarrer le serveur
```bash
cd server
npm install
npm run dev
# ✅ Server running on http://localhost:3000
```

### 3. Démarrer Admin Dashboard
```bash
cd src/components/Adminstrtor\ app\ web
npm install
npm run dev
# ✅ Admin on http://localhost:5174
```

### 4. Démarrer Client App
```bash
cd ../../../  # Retour à luxe-drive-hub root
npm install
npm run dev
# ✅ Client on http://localhost:5173
```

## ✅ Checklist de Test

- [ ] Admin peut se login (admin@luxedrive.com)
- [ ] Client peut se login (client@luxedrive.com)
- [ ] Admin crée notification
- [ ] Client reçoit notification en temps réel
- [ ] Notification s'affiche dans NotificationCenter
- [ ] Client peut marquer comme lue
- [ ] Historique sauvegardé en DB
- [ ] Déconnexion met à jour la session
- [ ] Reconnexion automatique après perte de connexion

## 🔧 Troubleshooting

| Problème | Solution |
|----------|----------|
| Socket ne se connecte pas | Vérifier CORS dans server/src/index.ts |
| Notification pas reçue | Vérifier que Socket.IO event name est exact |
| DB connection error | Vérifier les .env variables (DB_USER, password, host) |
| Port déjà utilisé | Changer PORT dans .env (3000, 5173, 5174) |

## 📚 Ressources

- [Socket.IO Docs](https://socket.io/docs/v4/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev)

---

**Système prêt!** Commencez par le login client → Admin envoie notification → Client la reçoit en temps réel! 🎉
