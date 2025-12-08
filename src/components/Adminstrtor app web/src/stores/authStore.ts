import { create } from 'zustand'
import { AuthUser, AuthResponse } from '../types'

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AuthUser | null) => void
  setToken: (token: string | null) => void
}

const useAuthStore = create<AuthStore>((set) => ({
  user: localStorage.getItem('auth_user') 
    ? JSON.parse(localStorage.getItem('auth_user')!) 
    : null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      // Simulation d'une API login (à remplacer par un vrai appel API)
      const mockResponse: AuthResponse = {
        token: 'mock_token_' + Date.now(),
        user: {
          id: '1',
          email,
          name: 'Admin User',
          role: 'admin',
        },
      }

      localStorage.setItem('auth_token', mockResponse.token)
      localStorage.setItem('auth_user', JSON.stringify(mockResponse.user))

      set({
        token: mockResponse.token,
        user: mockResponse.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
    set({ user })
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
    set({ token, isAuthenticated: !!token })
  },
}))

export default useAuthStore
