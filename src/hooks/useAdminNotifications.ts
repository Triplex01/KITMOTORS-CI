import { useEffect, useState, useCallback } from 'react'
import { useClientNotificationStore } from '../stores/clientNotificationStore.js'
import { connectSocket, setupNotificationListeners, disconnectSocket, getSocket } from '../services/socketClient.js'
import { useAuthStore } from '../stores/authStore.js'

export const useAdminNotifications = () => {
  const { user } = useAuthStore()
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const notificationStore = useClientNotificationStore()

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user) return

    const initSocket = async () => {
      try {
        await connectSocket(user.id, 'client')
        setupNotificationListeners()
        setIsConnected(true)
        setError(null)
      } catch (err) {
        console.error('Failed to connect socket:', err)
        setError(err instanceof Error ? err.message : 'Connection failed')
        setIsConnected(false)
      }
    }

    initSocket()

    return () => {
      disconnectSocket()
      setIsConnected(false)
    }
  }, [user])

  const markAsRead = useCallback(
    (notificationId: string) => {
      notificationStore.markAsRead(notificationId)

      const socket = getSocket()
      if (socket) {
        socket.emit('notification:read', { notificationId })
      }
    },
    [notificationStore]
  )

  const clearNotification = useCallback(
    (notificationId: string) => {
      notificationStore.clearNotification(notificationId)
    },
    [notificationStore]
  )

  return {
    notifications: notificationStore.notifications,
    unreadCount: notificationStore.unreadCount,
    isConnected,
    error,
    markAsRead,
    clearNotification,
    clearAll: notificationStore.clearAll,
  }
}
