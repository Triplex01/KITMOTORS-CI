#!/bin/bash

# Script d'installation - Luxe Admin Dashboard
# Utilisation: bash install.sh

set -e

echo "🏆 Luxe Admin Dashboard - Installation"
echo "========================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}✓ Vérification des prérequis...${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js n'est pas installé${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm n'est pas installé${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}"
echo ""

# Installer les dépendances
echo -e "${BLUE}→ Installation des dépendances (cela peut prendre quelques minutes)...${NC}"
npm install

# Copier .env.example
if [ ! -f .env ]; then
    echo -e "${BLUE}→ Création du fichier .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env créé${NC}"
else
    echo -e "${YELLOW}⚠ .env existe déjà, non modifié${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Installation terminée avec succès!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Prochaines étapes:${NC}"
echo ""
echo "1. Lancer le serveur de développement:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. Ouvrir dans le navigateur:"
echo -e "   ${YELLOW}http://localhost:5173${NC}"
echo ""
echo "3. Se connecter avec:"
echo -e "   Email: ${YELLOW}admin@luxedrive.com${NC}"
echo -e "   Mot de passe: ${YELLOW}password123${NC}"
echo ""
echo "Pour plus d'informations, consultez ${YELLOW}README.md${NC}"
echo ""
