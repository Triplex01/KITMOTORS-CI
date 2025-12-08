# 🏎️ LUXE DRIVE HUB - Full System

Complete **Admin-to-Client Notification System** with real-time WebSocket communication, database integration, and authentication.

## 🎯 System Overview

```
Admin Dashboard (React 18, Port 5174)
         ↓ (Socket.IO)
    Node.js Backend (Express, Port 3000)
         ↓ (HTTP/WebSocket)
Client App (React 18, Port 5173)
```

## 📁 Project Structure

```
luxe-drive-hub/
├── server/                              # 🔥 NEW: Backend API + WebSocket
│   ├── src/
│   │   ├── index.ts                    # Express + Socket.IO server
│   │   ├── types/index.ts              # TypeScript interfaces
│   │   ├── middleware/auth.ts          # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.ts                 # Login/Register
│   │   │   ├── vehicles.ts             # Vehicle endpoints
│   │   │   └── notifications.ts        # Notification endpoints
│   │   └── socket/handlers.ts          # Socket.IO event handlers
│   ├── schema.sql                      # 🗄️ Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── src/
│   ├── components/
│   │   ├── NotificationCenter.tsx       # 🆕 Real-time notification display
│   │   └── ...existing
│   │
│   ├── stores/
│   │   ├── authStore.ts                # Client authentication
│   │   ├── clientNotificationStore.ts  # 🆕 Notification state (Zustand)
│   │   └── ...existing
│   │
│   ├── services/
│   │   ├── socketClient.ts             # 🆕 Socket.IO client service
│   │   └── ...existing
│   │
│   ├── hooks/
│   │   ├── useAdminNotifications.ts    # 🆕 Notification hook
│   │   └── ...existing
│   │
│   ├── pages/
│   │   └── ...existing
│   │
│   └── App.tsx                         # Include <NotificationCenter />
│
├── src/components/Adminstrtor app web/
│   ├── src/
│   │   ├── pages/NotificationsPage.tsx # Updated to send via Socket.IO
│   │   └── ...existing admin dashboard
│   └── package.json
│
├── INTEGRATION_GUIDE.md                # 📖 Complete integration guide
├── setup.sh                            # 🚀 Automated setup script
└── README.md                           # This file
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

**1. Setup Database**
```bash
# Create PostgreSQL database
createdb luxe_drive_hub

# Import schema
psql luxe_drive_hub < server/schema.sql
```

**2. Configure Environment**
```bash
# Server configuration
cd server
cp .env.example .env
# Edit .env with your database credentials

# Client configuration
cd ../src/components/Adminstrtor\ app\ web
cat > .env << EOF
VITE_APP_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
EOF
```

**3. Install Dependencies**
```bash
# Backend
cd server && npm install

# Admin Dashboard
cd ../src/components/Adminstrtor\ app\ web && npm install

# Client App
cd ../../../ && npm install
```

**4. Start All Services**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Admin Dashboard:
```bash
cd src/components/Adminstrtor\ app\ web
npm run dev -- --port 5174
```

Terminal 3 - Client App:
```bash
npm run dev
```

## 🔐 Demo Credentials

| Role   | Email                  | Password     | URL              |
|--------|------------------------|--------------|------------------|
| Admin  | admin@luxedrive.com    | admin123     | localhost:5174   |
| Client | client@luxedrive.com   | password123  | localhost:5173   |

## 🔄 Communication Flow

### Admin Sends Notification

```
Admin Dashboard (5174)
  ↓ socket.emit('notification:send', {title, message, targetType, vehicleIds})
  ↓
Node.js Server (3000)
  ↓ Query DB for recipients
  ↓ Save to notification_history
  ↓ io.emit('notification:received', notification)
  ↓
Client App (5173)
  ↓ socket.on('notification:received', (notification) => showToast())
  ↓
User sees toast + browser notification
```

## 📊 Database Schema

### Tables
- **users** - Client accounts
- **admin_users** - Admin accounts
- **vehicles** - User's vehicles
- **notifications** - Created notifications
- **notification_history** - Delivery tracking
- **documents** - Vehicle documents
- **vehicle_updates** - Maintenance/updates
- **sessions** - WebSocket sessions

## 🌐 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new client
POST   /api/auth/login        - Login (client/admin)
GET    /api/auth/me           - Get current user
```

### Vehicles
```
GET    /api/vehicles          - List user's vehicles
GET    /api/vehicles/:id      - Get vehicle details
```

### Notifications
```
POST   /api/notifications     - Create notification (admin)
GET    /api/notifications/my-notifications - Get user notifications
PATCH  /api/notifications/:id/read - Mark as read
```

## 🔌 WebSocket Events

### Client Events
```javascript
socket.on('notification:received', (notification) => {})
socket.on('vehicle:update-request', (data) => {})
socket.on('vehicle:update-response', (data) => {})

socket.emit('notification:acknowledge', {notificationId})
socket.emit('vehicle:update-response', {vehicleId, approved, reason})
```

### Admin Events
```javascript
socket.emit('notification:send', {title, message, targetType, vehicleIds})
socket.emit('vehicle:update-request', {vehicleId, updateType, title, description})

socket.on('notification:sent', (data) => {})
socket.on('vehicle:update-response', (data) => {})
```

## 🛠️ Architecture Highlights

### 🔐 Authentication
- JWT tokens with 7-day expiration
- Bcrypt password hashing
- Token stored in localStorage (client)
- Interceptors for authorization header

### 🔄 Real-time Communication
- Socket.IO with WebSocket + polling fallback
- Automatic reconnection with exponential backoff
- Session tracking in database
- Keep-alive heartbeat (30s interval)

### 💾 Persistent Storage
- PostgreSQL with strong referential integrity
- Notification history for audit trail
- Session tracking for online status
- Indexes for performance optimization

### 📱 Client UX
- Toast notifications (react-hot-toast)
- Browser native notifications (Notifications API)
- Unread count badge
- Real-time status indicators
- Responsive design (Tailwind CSS)

## 📖 Documentation

- **INTEGRATION_GUIDE.md** - Detailed integration steps with code examples
- **server/schema.sql** - Complete database schema
- **PUSH_NOTIFICATIONS.md** - Browser notifications setup

## 🧪 Testing

### Test Flow
1. Login as admin (5174)
2. Create a notification
3. Switch to client (5173) - should see toast
4. Mark as read - updates database
5. Admin sees delivery status in dashboard

### Manual Socket.IO Testing
```javascript
// In browser console (client)
const socket = io('http://localhost:3000')
socket.emit('user:login', {userId: 'test-user', userType: 'client'})
socket.on('notification:received', console.log)
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Socket not connecting | Check CORS in server/src/index.ts, firewall |
| DB connection failed | Verify .env credentials, PostgreSQL running |
| Notification not received | Check Socket.IO event names, user IDs match |
| Port already in use | `lsof -i :3000` then kill process |
| Module not found | Run `npm install` in all directories |

## 🔒 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use HTTPS/WSS in production
- [ ] Set CORS_ORIGIN to production domains
- [ ] Hash passwords with bcryptjs (✅ done)
- [ ] Validate all inputs on backend
- [ ] Rate limit API endpoints
- [ ] Use environment variables for secrets
- [ ] Enable database SSL connection
- [ ] Set secure cookies (httpOnly, secure)

## 🚀 Deployment

### Deploy Backend (Heroku/Railway)
```bash
cd server
git init
git add .
git commit -m "Initial commit"
# Follow platform-specific deployment guides
```

### Deploy Client (Vercel/Netlify)
```bash
# Update VITE_SOCKET_URL to production backend
npm run build
# Upload dist/ folder to Vercel/Netlify
```

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Admin) | React 18, TypeScript, Vite, Tailwind |
| Frontend (Client) | React 18, TypeScript, Vite, Tailwind |
| Backend | Node.js, Express, Socket.IO |
| Database | PostgreSQL |
| State | Zustand |
| Auth | JWT + Bcrypt |
| Real-time | Socket.IO |
| HTTP Client | Axios |

## 🤝 Contributing

See `CONTRIBUTING.md` in admin dashboard folder.

## 📞 Support

- 📖 Read INTEGRATION_GUIDE.md
- 🐛 Check troubleshooting section
- 💬 Review code comments
- 📧 Contact admin@luxedrive.com

## 📄 License

© 2024-2025 Luxe Drive Hub. All rights reserved.

---

## 📋 Checklist for Production

- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] CORS whitelist set correctly
- [ ] Rate limiting enabled
- [ ] Error logging (Sentry)
- [ ] Monitoring (DataDog/New Relic)
- [ ] SSL certificates installed
- [ ] WebSocket events validated
- [ ] Load testing completed
- [ ] Performance optimized

---

**Ready to connect admin and clients in real-time?** 🚀

Start with: `./setup.sh` or read `INTEGRATION_GUIDE.md` for detailed steps.
