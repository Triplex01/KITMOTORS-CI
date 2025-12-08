#!/bin/bash

# ============================================
# LUXE DRIVE HUB - Launch All Services
# ============================================

set -e

ROOT_DIR="/Users/cherifaboubacar/Desktop/APP WEB/luxe-drive-hub"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  🚀 Lancement des Services - Luxe Drive Hub               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to launch in new terminal
launch_service() {
  local name=$1
  local cwd=$2
  local command=$3
  local port=$4

  echo -e "${BLUE}🚀 Lancement $name (Port $port)...${NC}"
  echo "   Répertoire: $cwd"
  echo "   Commande: $command"
  echo ""

  # For macOS
  if [[ "$OSTYPE" == "darwin"* ]]; then
    osascript <<EOF
      tell application "Terminal"
        do script "cd '$cwd' && $command"
      end tell
EOF
  else
    # For Linux
    gnome-terminal -- bash -c "cd '$cwd' && $command; exec bash"
  fi

  sleep 2
}

# Check if in correct directory
if [ ! -d "$ROOT_DIR" ]; then
  echo -e "${YELLOW}❌ Répertoire non trouvé: $ROOT_DIR${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Répertoire racine trouvé${NC}"
echo ""

# Launch Backend Server
launch_service \
  "Backend Server" \
  "$ROOT_DIR/server" \
  "npm run dev" \
  "3000"

# Wait a bit for backend to start
sleep 3

# Launch Admin Dashboard
launch_service \
  "Admin Dashboard" \
  "$ROOT_DIR/src/components/Adminstrtor app web" \
  "npm run dev -- --port 5174" \
  "5174"

sleep 2

# Launch Client App
launch_service \
  "Client App" \
  "$ROOT_DIR" \
  "npm run dev" \
  "5173"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ Services En Cours de Démarrage             ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║                                                            ║"
echo "║  Les trois services vont s'ouvrir dans des terminaux      ║"
echo "║  séparés.                                                 ║"
echo "║                                                            ║"
echo "║  📍 Accès:                                                 ║"
echo "║     🖥️  Backend API:      http://localhost:3000           ║"
echo "║     📊 Admin Dashboard:   http://localhost:5174           ║"
echo "║     👥 Client App:        http://localhost:5173           ║"
echo "║                                                            ║"
echo "║  🔐 Identifiants:                                          ║"
echo "║     Admin:  admin@luxedrive.com / admin123                ║"
echo "║     Client: client@luxedrive.com / password123            ║"
echo "║                                                            ║"
echo "║  ⏱️  Attendez 30 secondes pour que tout soit prêt         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Appuyez sur Ctrl+C dans chaque terminal pour arrêter"
echo ""
