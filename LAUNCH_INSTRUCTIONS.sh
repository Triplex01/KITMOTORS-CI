#!/bin/bash

# ============================================
# LUXE DRIVE HUB - Quick Start (Single Terminal)
# ============================================

ROOT_DIR="/Users/cherifaboubacar/Desktop/APP WEB/luxe-drive-hub"
cd "$ROOT_DIR"

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                    🚀 LUXE DRIVE HUB - DÉMARRAGE RAPIDE                    ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if npm packages are installed
check_dependencies() {
  local dir=$1
  local name=$2

  if [ ! -d "$dir/node_modules" ]; then
    echo "📦 Installation des dépendances pour $name..."
    cd "$dir"
    npm install > /dev/null 2>&1
    cd "$ROOT_DIR"
    echo "✅ $name - Dépendances installées"
  else
    echo "✅ $name - Dépendances déjà présentes"
  fi
}

# Check backend
check_dependencies "$ROOT_DIR/server" "Backend"

# Check admin
check_dependencies "$ROOT_DIR/src/components/Adminstrtor app web" "Admin Dashboard"

# Check client
check_dependencies "$ROOT_DIR" "Client App"

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║              🎯 INSTRUCTIONS POUR LES 3 TERMINAUX SÉPARÉS                  ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                            ║"
echo "║  Pour lancer les 3 services, ouvrez 3 TERMINAUX SÉPARÉS et exécutez:      ║"
echo "║                                                                            ║"
echo "║  TERMINAL 1 - Backend Server (Port 3000)                                   ║"
echo "║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║"
echo "║  cd \"$ROOT_DIR/server\"  ║"
echo "║  npm run dev                                                               ║"
echo "║                                                                            ║"
echo "║  TERMINAL 2 - Admin Dashboard (Port 5174)                                  ║"
echo "║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║"
echo "║  cd \"$ROOT_DIR/src/components/Adminstrtor app web\" ║"
echo "║  npm run dev -- --port 5174                                               ║"
echo "║                                                                            ║"
echo "║  TERMINAL 3 - Client App (Port 5173)                                       ║"
echo "║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║"
echo "║  cd \"$ROOT_DIR\"         ║"
echo "║  npm run dev                                                               ║"
echo "║                                                                            ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                         📱 ACCÈS AUX APPLICATIONS                          ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                            ║"
echo "║  🖥️  Backend API:           http://localhost:3000                         ║"
echo "║  📊 Admin Dashboard:        http://localhost:5174                         ║"
echo "║  👥 Client App:             http://localhost:5173                         ║"
echo "║                                                                            ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                        🔐 IDENTIFIANTS DE DÉMO                             ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                            ║"
echo "║  ADMIN:                                                                    ║"
echo "║     Email:    admin@luxedrive.com                                          ║"
echo "║     Password: admin123                                                     ║"
echo "║                                                                            ║"
echo "║  CLIENT:                                                                   ║"
echo "║     Email:    client@luxedrive.com                                         ║"
echo "║     Password: password123                                                  ║"
echo "║                                                                            ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                          🧪 TEST DU FLUX COMPLET                           ║"
echo "╠════════════════════════════════════════════════════════════════════════════╣"
echo "║                                                                            ║"
echo "║  1️⃣  Ouvrir 2 onglets navigateur:                                          ║"
echo "║     - Onglet Admin: http://localhost:5174                                  ║"
echo "║     - Onglet Client: http://localhost:5173                                 ║"
echo "║                                                                            ║"
echo "║  2️⃣  Login:                                                                ║"
echo "║     - Admin: admin@luxedrive.com / admin123                                ║"
echo "║     - Client: client@luxedrive.com / password123                           ║"
echo "║                                                                            ║"
echo "║  3️⃣  Admin envoie une notification:                                        ║"
echo "║     - Aller à: NotificationsPage (Admin Dashboard)                         ║"
echo "║     - Remplir le formulaire (titre, message)                               ║"
echo "║     - Cliquer \"Envoyer\"                                                   ║"
echo "║                                                                            ║"
echo "║  4️⃣  Vérifier la réception client:                                         ║"
echo "║     - Aller à l'onglet Client                                              ║"
echo "║     - 📬 Une notification devrait apparaître en bas à droite                ║"
echo "║     - Toast + Notification navigateur                                      ║"
echo "║                                                                            ║"
echo "║  5️⃣  Cliquer sur la notification pour la marquer comme lue                 ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Offer to copy commands
echo "💡 Commandes à copier-coller:"
echo ""
echo "Backend:"
echo "  cd \"$ROOT_DIR/server\" && npm run dev"
echo ""
echo "Admin:"
echo "  cd \"$ROOT_DIR/src/components/Adminstrtor app web\" && npm run dev -- --port 5174"
echo ""
echo "Client:"
echo "  cd \"$ROOT_DIR\" && npm run dev"
echo ""

echo "✨ C'est parti! Ouvrez 3 terminaux et copiez les commandes ci-dessus."
