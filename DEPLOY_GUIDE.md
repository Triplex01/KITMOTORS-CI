# 🚀 Guide Déploiement Complet - KitMotors

## ✅ Solution Simple : Vercel (Frontend + Backend ensemble)

### Étape 1 : Se connecter à Vercel
```bash
npx vercel login
```
Cela ouvrira votre navigateur. Connectez-vous avec GitHub.

### Étape 2 : Déployer
```bash
cd "/Users/cherifaboubacar/Desktop/APP WEB/luxe-drive-hub"
npx vercel --prod
```

Suivez les instructions :
- Nom du projet : `kitmotors` (ou laissez par défaut)
- Configurer automatiquement : `yes`

### Étape 3 : Copier l'URL
Vercel vous donnera une URL comme : `https://kitmotors.vercel.app`

C'est tout ! Le frontend ET le backend seront déployés ensemble. ✅

---

## 📱 URL Actuelle

**Frontend GitHub Pages** : https://triplex01.github.io/luxe-drive-hub/
(Mais le backend ne fonctionne pas)

**Nouveau déploiement Vercel** : À venir après `npx vercel --prod`
(Frontend + Backend fonctionnels)

---

## 🔧 Alternative si problème

Si Vercel ne fonctionne pas, utilisez **Netlify** :

1. Aller sur https://netlify.com
2. Connecter GitHub
3. Sélectionner le repo `luxe-drive-hub`
4. Build command : `npm run build`
5. Publish directory : `dist`
6. Déployer

Pour le backend sur Netlify, utilisez **Netlify Functions** ou déployez le backend séparément sur **Render**.

---

## 📝 Ce qui a été configuré

- ✅ `vercel.json` : Configuration pour frontend + backend
- ✅ `vite.config.ts` : Base URL corrigée
- ✅ `src/services/api.ts` : API URL automatique (prod vs dev)
- ✅ Fichiers 404.html et .nojekyll pour GitHub Pages

---

## 🎯 Commande rapide

```bash
# Se connecter (une seule fois)
npx vercel login

# Déployer
npx vercel --prod
```

C'est tout ! 🚀
