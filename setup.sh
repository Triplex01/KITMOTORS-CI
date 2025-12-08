#!/bin/bash

# ============================================
# LUXE DRIVE HUB - Full System Setup Script
# ============================================

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 LUXE DRIVE HUB - System Setup                          ║"
echo "║  Admin Dashboard + Client App + Backend Server             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js not found. Please install Node.js 16+${NC}"
  exit 1
fi

if ! command -v psql &> /dev/null; then
  echo -e "${YELLOW}⚠️  PostgreSQL client not found. You'll need to setup DB manually.${NC}"
fi

echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
echo ""

# Setup Server
echo -e "${BLUE}📦 Setting up Backend Server...${NC}"
cd server

if [ ! -f .env ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
  echo -e "${YELLOW}⚠️  Please update server/.env with your database credentials${NC}"
fi

echo "Installing server dependencies..."
npm install

echo -e "${GREEN}✅ Server setup complete${NC}"
echo ""

# Setup Admin Dashboard
echo -e "${BLUE}📦 Setting up Admin Dashboard...${NC}"
cd ../src/components/Adminstrtor\ app\ web

if [ ! -f .env ]; then
  echo "Creating .env.example..."
  cat > .env << EOF
VITE_APP_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
EOF
fi

echo "Installing admin dependencies..."
npm install

echo -e "${GREEN}✅ Admin dashboard setup complete${NC}"
echo ""

# Setup Client App
echo -e "${BLUE}📦 Setting up Client App...${NC}"
cd ../../../

if [ ! -f .env.local ]; then
  echo "Creating .env.local..."
  cat > .env.local << EOF
VITE_APP_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
EOF
fi

echo "Installing client dependencies..."
npm install

echo -e "${GREEN}✅ Client app setup complete${NC}"
echo ""

# Database setup
echo -e "${BLUE}🗄️  Database Setup...${NC}"
if command -v psql &> /dev/null; then
  read -p "Create PostgreSQL database? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    createdb luxe_drive_hub 2>/dev/null || echo "Database may already exist"
    psql luxe_drive_hub < server/schema.sql
    echo -e "${GREEN}✅ Database initialized${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  PostgreSQL not installed. Run this to create database:${NC}"
  echo "createdb luxe_drive_hub"
  echo "psql luxe_drive_hub < server/schema.sql"
fi
echo ""

# Create startup script
echo -e "${BLUE}📝 Creating startup script...${NC}"
cat > start.sh << 'EOF'
#!/bin/bash

echo "Starting Luxe Drive Hub System..."
echo ""

# Start backend
echo "🚀 Starting backend server..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

sleep 2

# Start admin dashboard
echo "🚀 Starting admin dashboard..."
cd src/components/Adminstrtor\ app\ web
npm run dev -- --port 5174 &
ADMIN_PID=$!
cd ../../../

# Start client app
echo "🚀 Starting client app..."
npm run dev &
CLIENT_PID=$!

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✅ All Services Running                  ║"
echo "├════════════════════════════════════════════════════════════┤"
echo "║  🖥️  Backend Server:     http://localhost:3000             ║"
echo "║  📊 Admin Dashboard:     http://localhost:5174             ║"
echo "║  👥 Client App:          http://localhost:5173             ║"
echo "├════════════════════════════════════════════════════════════┤"
echo "║  Admin Demo: admin@luxedrive.com / admin123                ║"
echo "║  Client Demo: client@luxedrive.com / password123           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

wait $SERVER_PID $ADMIN_PID $CLIENT_PID
EOF

chmod +x start.sh
echo -e "${GREEN}✅ Created start.sh${NC}"
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║             ✅ Setup Complete!                             ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  📖 Next Steps:                                            ║"
echo "║                                                            ║"
echo "║  1. Update database credentials in: server/.env            ║"
echo "║                                                            ║"
echo "║  2. Run all services:                                      ║"
echo "║     ./start.sh                                             ║"
echo "║                                                            ║"
echo "║  3. Or start manually:                                     ║"
echo "║     Terminal 1: cd server && npm run dev                   ║"
echo "║     Terminal 2: cd src/components/Adminstrtor... && npm run dev -- --port 5174"
echo "║     Terminal 3: npm run dev                                ║"
echo "║                                                            ║"
echo "║  4. Read: INTEGRATION_GUIDE.md                             ║"
echo "║                                                            ║"
echo "║  Admin URL:    http://localhost:5174                       ║"
echo "║  Client URL:   http://localhost:5173                       ║"
echo "║  API URL:      http://localhost:3000/api                   ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
