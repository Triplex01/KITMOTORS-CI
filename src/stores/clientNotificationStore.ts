import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface ClientNotification {
  id: string
  title: string
  message: string
  type: string
  timestamp: Date
  vehicleIds?: string[]
  read?: boolean
}

interface ClientNotificationStore {
  notifications: ClientNotification[]
  unreadCount: number
  addNotification: (notification: ClientNotification) => void
  markAsRead: (id: string) => void
  clearNotification: (id: string) => void
  clearAll: () => void
}

export const useClientNotificationStore = create<ClientNotificationStore>()(
  subscribeWithSelector((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification: ClientNotification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + 1,
      })),

    markAsRead: (id: string) =>
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),

    clearNotification: (id: string) =>
      set((state) => ({
        notifications: state.notifications.filter((notif) => notif.id !== id),
      })),

    clearAll: () =>
      set({
        notifications: [],
        unreadCount: 0,
      }),
  }))
)
