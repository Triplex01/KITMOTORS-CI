# ⚡ Quick Start Guide

Démarrez le Admin Dashboard en **5 minutes**.

## 🚀 Installation & Lancement

### Étape 1: Cloner (Optionnel)
```bash
git clone https://github.com/yourusername/luxe-admin-dashboard.git
cd luxe-admin-dashboard
```

### Étape 2: Installer les Dépendances
```bash
npm install
```
⏱️ Prend ~2 minutes

### Étape 3: Lancer
```bash
npm run dev
```

### Étape 4: Ouvrir dans Navigateur
```
http://localhost:5173
```

### Étape 5: Se Connecter
```
Email: admin@luxedrive.com
Mot de passe: password123
```

✅ **Terminé!** Le dashboard est opérationnel.

---

## 📱 Interface Principal

### Pages Disponibles

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Statistiques & Activités |
| Notifications | `/notifications` | Créer & Envoyer push |
| Documents | `/documents` | Upload & Validation |
| Véhicules | `/vehicles` | Gestion des véhicules |
| Paramètres | `/settings` | Configuration admin |

---

## 🎯 Fonctionnalités de Base

### 1️⃣ Créer une Notification
1. Allez à **/notifications**
2. Cliquez **"Nouvelle Notification"**
3. Remplissez:
   - **Titre**: "Maintenance Due"
   - **Message**: "Your vehicle needs maintenance"
   - **Groupe Cible**: "All users"
4. Cliquez **"Envoyer"**

### 2️⃣ Uploader un Document
1. Allez à **/documents**
2. Glissez-déposez un PDF ou cliquez pour sélectionner
3. Validation automatique (max 10MB)
4. Cliquez **"Approuver"** ou **"Rejeter"**

### 3️⃣ Gérer les Véhicules
1. Allez à **/vehicles**
2. Filtrez par statut
3. Approuvez les mises à jour demandées
4. Consultez les détails des véhicules

### 4️⃣ Vérifier le Dashboard
1. Allez à **/**
2. Consultez les KPIs:
   - Total Utilisateurs
   - Véhicules Actifs
   - Documents en Attente
   - Notifications Actives

---

## ⚙️ Configuration

### Variables d'Environnement (.env)
```env
VITE_APP_API_URL=http://localhost:3000/api
VITE_APP_SOCKET_URL=http://localhost:3000
```

⚠️ Créez un `.env` avec ces variables ou modifiez `.env.example`.

---

## 🔧 Commandes Utiles

```bash
# Démarrer en développement
npm run dev

# Compiler pour production
npm run build

# Prévisualiser la build
npm run preview

# Vérifier les types TypeScript
npm run type-check

# Linter le code
npm run lint
```

---

## 🎨 Personnaliser l'Apparence

### Changer les Couleurs
Modifiez `tailwind.config.ts`:

```typescript
colors: {
  gold: {
    500: '#YOUR_COLOR',
  }
}
```

### Changer les Polices
Modifiez `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font" rel="stylesheet">
```

Puis mettez à jour `tailwind.config.ts`:

```typescript
fontFamily: {
  serif: ['Your Font', 'serif'],
}
```

---

## 🔌 Intégrer Votre API

### 1️⃣ Configurer l'URL de Base
`.env`:
```env
VITE_APP_API_URL=https://your-api.com
```

### 2️⃣ Appeler l'API
```typescript
import { notificationService } from '@/services/api'

const notifications = await notificationService.getAll()
```

### 3️⃣ Ajouter la Gestion d'Erreurs
```typescript
try {
  const data = await notificationService.getAll()
} catch (error) {
  console.error('API Error:', error)
}
```

---

## 🐛 Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| Port 5173 en use | Changer dans `vite.config.ts` ou `killall node` |
| Styles non appliqués | `npm install` + redémarrer dev server |
| API non répondant | Vérifier `.env` et backend sur port 3000 |
| Erreur module | Supprimer `node_modules/` et `npm install` |
| Blanc après reload | Hard refresh: Ctrl+Shift+R |

---

## 📚 Ressources

- 📖 [README Complet](./README.md)
- 📚 [API Documentation](./API_DOCUMENTATION.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 👨‍💻 [Contributing Guide](./CONTRIBUTING.md)
- 📁 [Project Structure](./PROJECT_STRUCTURE.md)

---

## 💡 Pro Tips

1. **Utilisez VS Code Extensions**:
   - Tailwind CSS IntelliSense
   - ES7+ React/Redux/React-Native snippets
   - Thunder Client (pour tester API)

2. **Hot Module Replacement**:
   - Saves are automatic
   - Vous verrez les changements en temps réel

3. **Browser DevTools**:
   - React DevTools pour inspecter l'état
   - Network tab pour déboguer l'API

4. **Dark Mode** (À Implémenter):
   - Tailwind support `dark:` classes
   - Utilisez `prefers-color-scheme`

---

## 🎓 Prochaines Étapes

1. Consultez le [Contributing Guide](./CONTRIBUTING.md)
2. Explorez le [Project Structure](./PROJECT_STRUCTURE.md)
3. Intégrez votre [Backend API](./API_DOCUMENTATION.md)
4. Déployez sur [Vercel, Netlify, etc](./DEPLOYMENT.md)

---

## 🆘 Besoin d'Aide?

- 📧 Email: admin@luxedrive.com
- 📞 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

**Prêt à développer? Let's go! 🚀**

Happy coding! 💻✨
