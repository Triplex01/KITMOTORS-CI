# 🚀 Guide de Déploiement - KitMotors

## Prérequis

- Node.js >= 18.x
- npm >= 9.x
- Firebase CLI (`npm install -g firebase-tools`)
- Compte Firebase avec projet créé

---

## 🔥 Configuration Firebase

### 1. Créer un projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquer sur "Créer un projet"
3. Nommer le projet (ex: `kitmotors-app`)
4. Activer Google Analytics (optionnel)

### 2. Activer Firestore

1. Dans la console Firebase, aller dans "Firestore Database"
2. Cliquer sur "Créer une base de données"
3. Choisir le mode "Production" ou "Test"
4. Sélectionner la région (ex: `europe-west1`)

### 3. Configurer le Hosting

1. Dans la console Firebase, aller dans "Hosting"
2. Cliquer sur "Commencer"
3. Suivre les instructions

### 4. Récupérer la configuration

1. Aller dans "Paramètres du projet" > "Général"
2. Dans "Vos applications", ajouter une application Web
3. Copier la configuration Firebase

---

## 🔧 Configuration locale

### 1. Installer Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Se connecter à Firebase

```bash
firebase login
```

### 3. Initialiser le projet

```bash
firebase init
```

Sélectionner :
- ✅ Firestore
- ✅ Hosting

### 4. Configurer les variables d'environnement

Créer `.env.local` à la racine :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

---

## 📦 Build de Production

```bash
# Installer les dépendances
npm install

# Build de production
npm run build
```

Le build sera généré dans le dossier `dist/`.

---

## 🚀 Déploiement

### Déploiement complet

```bash
# Build + Deploy
npm run deploy
```

### Déploiement manuel

```bash
# Déployer uniquement le hosting
firebase deploy --only hosting

# Déployer uniquement les règles Firestore
firebase deploy --only firestore:rules

# Déployer tout
firebase deploy
```

---

## 🌐 URLs de Production

| Application | URL |
|-------------|-----|
| Client | https://kitmotors-app-web.web.app |
| Admin | https://kitmotors-admin.web.app |

---

## 🔄 CI/CD (Optionnel)

### GitHub Actions

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
```

### Configurer les Secrets GitHub

Dans les paramètres du repo GitHub > Secrets :

1. `FIREBASE_API_KEY`
2. `FIREBASE_AUTH_DOMAIN`
3. `FIREBASE_PROJECT_ID`
4. `FIREBASE_STORAGE_BUCKET`
5. `FIREBASE_MESSAGING_SENDER_ID`
6. `FIREBASE_APP_ID`
7. `FIREBASE_SERVICE_ACCOUNT` (JSON du compte de service)

---

## 🐛 Dépannage

### Erreur: "Permission denied"

```bash
firebase login --reauth
```

### Erreur: "Project not found"

Vérifier que le projet est bien configuré dans `.firebaserc` :

```json
{
  "projects": {
    "default": "votre-projet-id"
  }
}
```

### Erreur: "Build failed"

```bash
# Nettoyer le cache
rm -rf node_modules
rm -rf dist
npm install
npm run build
```

---

## 📊 Monitoring

### Firebase Console

- **Hosting**: Voir le trafic et les déploiements
- **Firestore**: Monitorer les lectures/écritures
- **Analytics**: Suivi des utilisateurs (si activé)

### Performance

- Utiliser Lighthouse pour auditer les performances
- Vérifier les Core Web Vitals dans Google Search Console
