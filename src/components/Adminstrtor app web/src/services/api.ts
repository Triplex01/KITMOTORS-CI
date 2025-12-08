import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
}

export const notificationService = {
  getAll: () => apiClient.get('/notifications'),
  create: (data: any) => apiClient.post('/notifications', data),
  update: (id: string, data: any) => apiClient.put(`/notifications/${id}`, data),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  send: (id: string) => apiClient.post(`/notifications/${id}/send`),
}

export const vehicleService = {
  getAll: () => apiClient.get('/vehicles'),
  getById: (id: string) => apiClient.get(`/vehicles/${id}`),
  create: (data: any) => apiClient.post('/vehicles', data),
  update: (id: string, data: any) => apiClient.put(`/vehicles/${id}`, data),
}

export const documentService = {
  getAll: () => apiClient.get('/documents'),
  getByVehicle: (vehicleId: string) =>
    apiClient.get(`/documents/vehicle/${vehicleId}`),
  upload: (formData: FormData) =>
    apiClient.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  approve: (id: string) => apiClient.post(`/documents/${id}/approve`),
  reject: (id: string, reason: string) =>
    apiClient.post(`/documents/${id}/reject`, { reason }),
}

export const updateService = {
  getAll: () => apiClient.get('/updates'),
  getPending: () => apiClient.get('/updates?status=pending'),
  approve: (id: string) => apiClient.post(`/updates/${id}/approve`),
  reject: (id: string, reason: string) =>
    apiClient.post(`/updates/${id}/reject`, { reason }),
}

export default apiClient
