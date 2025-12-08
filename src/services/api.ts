const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : (import.meta.env.PROD ? "/api" : "http://localhost:3000/api");

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
      throw new Error(error.message || "Erreur de connexion");
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
      throw new Error(error.message || "Erreur lors de l'inscription");
    }

    return response.json();
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Non authentifié");
    }

    return response.json();
  }

  async getVehicles() {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des véhicules");
    }

    return response.json();
  }

  async getVehicle(id: string) {
    const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du véhicule");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
