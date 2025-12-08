#!/usr/bin/env bash

# ============================================
# QUICK COMMANDS - Luxe Drive Hub
# ============================================

# Copy-paste any of these commands to your terminal

# ────────────────────────────────────────────
# 🚀 QUICK START
# ────────────────────────────────────────────

# Automated setup (RECOMMENDED)
chmod +x setup.sh && ./setup.sh

# ────────────────────────────────────────────
# 📦 INSTALLATION
# ────────────────────────────────────────────

# Create database
createdb luxe_drive_hub

# Import schema
psql luxe_drive_hub < server/schema.sql

# Install all dependencies
cd server && npm install
cd ../src/components/Adminstrtor\ app\ web && npm install
cd ../../../ && npm install

# ────────────────────────────────────────────
# 🖥️  DEVELOPMENT (Start Services)
# ────────────────────────────────────────────

# Terminal 1: Backend Server (port 3000)
cd server && npm run dev

# Terminal 2: Admin Dashboard (port 5174)
cd src/components/Adminstrtor\ app\ web
npm run dev -- --port 5174

# Terminal 3: Client App (port 5173)
npm run dev

# Or use the automatic start script (runs all 3 in one terminal)
./start.sh

# ────────────────────────────────────────────
# 🔨 BUILD (Production)
# ────────────────────────────────────────────

# Server
cd server && npm run build && npm run start

# Admin Dashboard
cd src/components/Adminstrtor\ app\ web && npm run build

# Client App
npm run build

# ────────────────────────────────────────────
# 🧪 TESTING
# ────────────────────────────────────────────

# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test

# ────────────────────────────────────────────
# 🧹 CLEANUP
# ────────────────────────────────────────────

# Remove node_modules
find . -name node_modules -type d -exec rm -rf {} +

# Clear npm cache
npm cache clean --force

# Remove lock files
find . -name "package-lock.json" -delete
find . -name "bun.lockb" -delete

# Fresh install
rm -rf node_modules package-lock.json
npm install

# ────────────────────────────────────────────
# 🔍 DEBUGGING
# ────────────────────────────────────────────

# Check if port is in use
lsof -i :3000    # Backend
lsof -i :5173    # Client
lsof -i :5174    # Admin

# Kill process on port
kill -9 $(lsof -t -i:3000)

# View database
psql luxe_drive_hub

# Check Node version
node --version
npm --version

# ────────────────────────────────────────────
# 🐳 DOCKER (Future)
# ────────────────────────────────────────────

# Build image
docker build -t luxe-drive-hub .

# Run container
docker run -p 3000:3000 luxe-drive-hub

# Docker compose
docker-compose up

# ────────────────────────────────────────────
# 📊 DATABASE COMMANDS
# ────────────────────────────────────────────

# List all databases
psql -U postgres -l

# Connect to database
psql -U postgres -d luxe_drive_hub

# SQL inside psql:
#   \dt              - List tables
#   \d users         - Show users table structure
#   SELECT COUNT(*) FROM users;  - Count users
#   \q              - Quit

# Backup database
pg_dump luxe_drive_hub > backup.sql

# Restore database
psql luxe_drive_hub < backup.sql

# Drop database
dropdb luxe_drive_hub

# ────────────────────────────────────────────
# 🌐 API TESTING (curl examples)
# ────────────────────────────────────────────

# Register client
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@luxedrive.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login client
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@luxedrive.com",
    "password": "password123",
    "userType": "client"
  }'

# Login admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@luxedrive.com",
    "password": "admin123",
    "userType": "admin"
  }'

# Get vehicles (requires token)
curl -X GET http://localhost:3000/api/vehicles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create notification (admin only)
curl -X POST http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Service Maintenance",
    "message": "Your vehicle needs maintenance",
    "targetType": "all"
  }'

# Health check
curl http://localhost:3000/health

# ────────────────────────────────────────────
# 📱 BROWSER CONSOLE TESTING
# ────────────────────────────────────────────

# Paste in browser console (http://localhost:5173):

// Test Socket.IO connection
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.emit('user:login', {
  userId: 'test-user-123',
  userType: 'client'
});

socket.on('notification:received', (notif) => {
  console.log('📬 Notification:', notif);
});

// Simulate receiving notification
// (Admin sends from 5174, watch console here)

# ────────────────────────────────────────────
# 🚀 DEPLOYMENT
# ────────────────────────────────────────────

# Build production
npm run build

# Deploy to Vercel (client)
vercel deploy --prod

# Deploy to Railway (backend)
# Follow platform-specific instructions

# Deploy to Heroku
git push heroku main

# ────────────────────────────────────────────
# 📚 DOCUMENTATION
# ────────────────────────────────────────────

# View all documentation files
ls -la *.md

# Read in order:
# 1. QUICK_START.md           - 5-minute setup
# 2. INTEGRATION_GUIDE.md     - Full integration
# 3. SYSTEM_README.md         - System overview
# 4. ARCHITECTURE.md          - Detailed diagrams
# 5. COMPLETION_SUMMARY.md    - What was built

# ────────────────────────────────────────────
# 🎓 PROJECT STRUCTURE
# ────────────────────────────────────────────

# View file tree
tree -L 2 -I 'node_modules'

# Count lines of code
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# List all TypeScript files
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules

# ────────────────────────────────────────────
# 💻 USEFUL ALIASES (add to ~/.bashrc or ~/.zshrc)
# ────────────────────────────────────────────

# alias lh='cd /Users/cherifaboubacar/Desktop/APP\ WEB/luxe-drive-hub'
# alias lh-server='cd /Users/cherifaboubacar/Desktop/APP\ WEB/luxe-drive-hub/server'
# alias lh-admin='cd /Users/cherifaboubacar/Desktop/APP\ WEB/luxe-drive-hub/src/components/Adminstrtor\ app\ web'
# alias lh-start='./start.sh'
# alias lh-dev='./setup.sh'

# ────────────────────────────────────────────
# ⚡ SHORTCUTS (save time!)
# ────────────────────────────────────────────

# Start everything quickly
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Luxe Drive Hub..."
gnome-terminal -- bash -c "cd server && npm run dev"
gnome-terminal -- bash -c "cd src/components/Adminstrtor\ app\ web && npm run dev -- --port 5174"
gnome-terminal -- bash -c "npm run dev"
echo "✅ All services started!"
EOF

chmod +x start-all.sh
./start-all.sh

# ────────────────────────────────────────────
# 📋 CHECKLIST
# ────────────────────────────────────────────

# Before committing:
# [ ] npm run type-check - no errors
# [ ] npm run lint - no errors
# [ ] npm test - all pass
# [ ] Code compiles
# [ ] DB works

# Before deploying:
# [ ] Update .env for production
# [ ] Change JWT_SECRET
# [ ] Set CORS_ORIGIN
# [ ] Enable HTTPS
# [ ] Backup database
# [ ] Test all flows

# ────────────────────────────────────────────
# 🆘 HELP
# ────────────────────────────────────────────

# If something breaks:
# 1. Check INTEGRATION_GUIDE.md troubleshooting
# 2. Check server console for errors
# 3. Check browser console (F12)
# 4. Check network tab (WebSocket connection)
# 5. Verify .env files exist with correct values
# 6. Verify all npm install completed
# 7. Kill and restart services
# 8. Clear browser cache (Ctrl+Shift+Delete)
# 9. Fresh install: rm -rf node_modules && npm install

# ════════════════════════════════════════════
# 🎉 YOU'RE ALL SET!
# ════════════════════════════════════════════

# Run: ./setup.sh
# Then: ./start.sh
# Open: localhost:5173 (client) & localhost:5174 (admin)

# Happy coding! 🚀
