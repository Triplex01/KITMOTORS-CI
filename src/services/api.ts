const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`






























































- Ou déployer sur Azure/AWS avec votre infrastructure- Utiliser un plan payant ($7/mois)🔧 **Pour production réelle** :- Parfait pour une démo client !- Prend 30-60 secondes pour se réveiller- S'endort après 15 min d'inactivité⚠️ **Le backend gratuit de Render** :## Notes importantes6. Déployer5. Ajouter variables d'environnement4. Configurer root directory: `server`3. Deploy from repo → Sélectionner `luxe-drive-hub`2. Connecter GitHub1. Aller sur https://railway.appSi Render ne fonctionne pas, vous pouvez utiliser Railway :## Alternative : Railway   - Redéployer : `npm run deploy`   - Modifier `.env.production` avec la vraie URL7. **Mettre à jour le frontend** :6. **Copier l'URL du backend** (ex: `https://kitmotors-api.onrender.com`)5. **Déployer** : Cliquer "Create Web Service"   - `DATABASE_URL` = (optionnel, pour PostgreSQL plus tard)   - `JWT_SECRET` = (générer un secret aléatoire)   - `PORT` = `3000`   - `NODE_ENV` = `production`   Ajouter dans Render :4. **Variables d'environnement** :   - **Plan**: Free   - **Start Command**: `npm start`   - **Build Command**: `npm install && npm run build`   - **Runtime**: Node   - **Root Directory**: `server`   - **Name**: `kitmotors-api`3. **Configuration du service** :   - Sélectionner le repo `luxe-drive-hub`   - Connecter votre compte GitHub   - Cliquer "New +" → "Web Service"   - Aller sur Render Dashboard2. **Connecter votre repo GitHub** :1. **Créer un compte sur Render** : https://render.com (gratuit)### Étapes pour déployer le backend :## Backend - Déploiement sur RenderLe frontend est déployé sur GitHub Pages.✅ **URL**: https://triplex01.github.io/luxe-drive-hub/## Frontend déployé  : "http://localhost:3000/api";

interface LoginData {
  email: string;
  password: string;
  userType: "client" | "admin";
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

class ApiService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async login(data: LoginData) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  }

  async register(data: RegisterData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  }

  async getVehicles() {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicles");
    }

    return response.json();
  }

  async getVehicle(vehicleId: string) {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch vehicle");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
