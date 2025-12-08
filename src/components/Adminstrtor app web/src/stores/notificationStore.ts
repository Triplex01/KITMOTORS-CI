import { create } from 'zustand'
import { PushNotification } from '../types'

interface NotificationStore {
  notifications: PushNotification[]
  isLoading: boolean
  error: string | null
  fetchNotifications: () => Promise<void>
  sendNotification: (notification: Omit<PushNotification, 'id' | 'createdAt' | 'readCount' | 'totalCount'>) => Promise<void>
  updateNotification: (id: string, updates: Partial<PushNotification>) => void
  deleteNotification: (id: string) => void
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null })
    try {
      // Mock data
      const mockNotifications: PushNotification[] = [
        {
          id: '1',
          title: 'Maintenance Required',
          message: 'Your vehicle is due for maintenance',
          status: 'sent',
          createdAt: new Date().toISOString(),
          sentAt: new Date().toISOString(),
          readCount: 245,
          totalCount: 500,
        },
      ]
      set({ notifications: mockNotifications, isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notifications'
      set({ error: message, isLoading: false })
    }
  },

  sendNotification: async (notification) => {
    set({ isLoading: true, error: null })
    try {
      const newNotification: PushNotification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        readCount: 0,
        totalCount: 0,
      }
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        isLoading: false,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send notification'
      set({ error: message, isLoading: false })
    }
  },

  updateNotification: (id, updates) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    }))
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
}))

export default useNotificationStore
