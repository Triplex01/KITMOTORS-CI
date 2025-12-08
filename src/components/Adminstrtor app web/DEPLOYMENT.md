# 🚀 Guide de Déploiement

Instructions pour déployer le Admin Dashboard en production.

## 📦 Build pour Production

### Étape 1: Build
```bash
npm run build
```

Cela crée un dossier `dist/` avec la build optimisée.

### Étape 2: Vérifier la build
```bash
npm run preview
```

Cela lance un serveur local pour tester la build production sur `http://localhost:4173`.

## ☁️ Déploiement Options

### Option 1: Vercel (Recommandé)

#### Prérequis
- Compte Vercel (gratuit)
- Repository GitHub
- Node.js 16+

#### Étapes

1. **Push votre code sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Importer sur Vercel**
   - Allez sur https://vercel.com/new
   - Importez votre repository GitHub
   - Sélectionnez `Vite` comme framework
   - Configurez les variables d'environnement:
     ```
     VITE_APP_API_URL=https://api.yourdomain.com
     VITE_APP_SOCKET_URL=https://api.yourdomain.com
     ```
   - Cliquez "Deploy"

3. **Domain personnalisé** (optionnel)
   - Settings → Domains
   - Ajoutez votre domaine

#### Avantages
- ✅ Déploiement gratuit
- ✅ HTTPS automatique
- ✅ CDN global
- ✅ CI/CD automatique

---

### Option 2: Netlify

#### Étapes

1. **Créer un `netlify.toml`**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[env]
  VITE_APP_API_URL = "https://api.yourdomain.com"
  VITE_APP_SOCKET_URL = "https://api.yourdomain.com"
```

2. **Déployer**
   - Allez sur https://app.netlify.com/start
   - Importez votre repository GitHub
   - Netlify détecte automatiquement les paramètres
   - Cliquez "Deploy"

---

### Option 3: AWS S3 + CloudFront

#### Prérequis
- Compte AWS
- AWS CLI configuré

#### Étapes

1. **Build**
```bash
npm run build
```

2. **Créer un bucket S3**
```bash
aws s3 mb s3://luxe-admin-dashboard
```

3. **Activer le hosting statique**
```bash
aws s3api put-bucket-website \
  --bucket luxe-admin-dashboard \
  --website-configuration '{
    "IndexDocument": {"Suffix": "index.html"},
    "ErrorDocument": {"Key": "index.html"}
  }'
```

4. **Upload les fichiers**
```bash
aws s3 sync dist/ s3://luxe-admin-dashboard --delete
```

5. **Créer CloudFront distribution** (pour CDN + HTTPS)
   - Allez sur AWS CloudFront Console
   - Créez une distribution pointant vers votre bucket S3

---

### Option 4: Docker + Railway/Render

#### Dockerfile déjà inclus ✓

**Déployer sur Railway:**
```bash
npm install -g railway
railway login
railway init
railway up
```

**Déployer sur Render:**
- https://dashboard.render.com
- New → Web Service
- Connectez votre GitHub
- Configurez:
  - Build Command: `npm run build`
  - Start Command: `npm run preview`
  - Port: 4173

---

### Option 5: Serveur Traditionnel (Apache/Nginx)

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    
    # Root directory
    root /var/www/luxe-admin-dashboard/dist;
    index index.html;
    
    # SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets (images, JS, CSS)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

#### Étapes de Déploiement

1. **Connectez-vous au serveur**
```bash
ssh user@your-server.com
```

2. **Clone le repository**
```bash
cd /var/www
git clone https://github.com/yourusername/luxe-admin-dashboard.git
cd luxe-admin-dashboard
```

3. **Installez et build**
```bash
npm install
npm run build
```

4. **Mettez à jour Nginx**
- Copiez la config ci-dessus dans `/etc/nginx/sites-available/your-domain`
- Activez: `sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/`
- Testez: `sudo nginx -t`
- Rechargez: `sudo systemctl reload nginx`

5. **Configurez SSL (Let's Encrypt)**
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 Variables d'Environnement Production

Créez un fichier `.env.production`:

```env
VITE_APP_API_URL=https://api.yourdomain.com
VITE_APP_SOCKET_URL=https://api.yourdomain.com
```

⚠️ **Important**: Ne mettez jamais de secrets (tokens, clés) dans l'environment frontend.

---

## ✅ Checklist Pré-Déploiement

- [ ] Build testé localement: `npm run build && npm run preview`
- [ ] Pas d'erreurs TypeScript: `npm run type-check`
- [ ] Linter OK: `npm run lint`
- [ ] Variables d'environnement vérifiées
- [ ] Backend API accessible depuis production
- [ ] WebSocket fonctionnel sur le domaine production
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Cache headers configurés
- [ ] Logs accessibles

---

## 📊 Monitoring en Production

### Google Analytics
```html
<!-- Ajouter dans index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Sentry (Error Tracking)
```typescript
// Dans main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/123456",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### UptimeRobot
- Monitorer: https://your-domain.com
- Vérifier la disponibilité toutes les 5 minutes
- Alertes email en cas de downtime

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Créez `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      run: npx vercel --prod --token=$VERCEL_TOKEN
```

---

## 📈 Performance Optimization

### Code Splitting
Vite le fait automatiquement avec les routes dynamiques:

```typescript
// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
```

### Bundle Analysis
```bash
npm install -D rollup-plugin-visualizer
```

Vérifiez les tailles dans `dist/stats.html`.

### Image Optimization
Utilisez WebP:
```html
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." />
</picture>
```

---

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| Blanc après déploiement | Vérifier la route `/index.html` dans la config serveur |
| API non accessible | Vérifier CORS backend et variables d'env |
| WebSocket ne connecte pas | Vérifier WSS (WebSocket Secure) en production |
| Cache stale | Ajouter hash dans filenames (Vite le fait par défaut) |
| Large bundle | Analyser avec visualizer et lazy load les routes |

---

Pour besoin de support: contactez l'équipe admin.

**Déploiement réussi? 🎉 Bravo!**
