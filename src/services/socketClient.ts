import io, { Socket } from 'socket.io-client'
import { useClientNotificationStore } from '../stores/clientNotificationStore.js'
import { useAuthStore } from '../stores/authStore.js'
import { usePushNotifications } from '../hooks/use-push-notifications.js'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket: Socket | null = null

export const connectSocket = (userId: string, userType: 'client' | 'admin'): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      resolve(socket)
      return
    }

    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id)

      // Authenticate
      socket?.emit('user:login', { userId, userType })

      socket?.on('user:login-success', (data) => {
        console.log('👤 Authenticated:', data)
        resolve(socket!)
      })
    })

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
      reject(error)
    })

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })
  })
}

export const setupNotificationListeners = () => {
  if (!socket) return

  const notificationStore = useClientNotificationStore()

  // Listen for new notifications from admin
  socket.on('notification:received', (notification) => {
    console.log('📬 New notification received:', notification)

    notificationStore.addNotification({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: new Date(notification.timestamp),
      vehicleIds: notification.vehicleIds,
      read: false,
    })

    // Show browser notification if enabled
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        tag: notification.id,
      })
    }

    // Emit acknowledgment
    socket?.emit('notification:acknowledge', { notificationId: notification.id })
  })

  // Listen for vehicle updates
  socket.on('vehicle:update-request', (data) => {
    console.log('🔧 Vehicle update request:', data)

    notificationStore.addNotification({
      id: data.vehicleId,
      title: `Update for ${data.updateType}`,
      message: data.title + ': ' + data.description,
      type: 'vehicle-update',
      timestamp: new Date(data.timestamp),
      vehicleIds: [data.vehicleId],
      read: false,
    })
  })

  // Keep-alive heartbeat
  setInterval(() => {
    socket?.emit('ping')
  }, 30000)
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const sendNotificationToAdmin = (message: string, data?: Record<string, any>): void => {
  socket?.emit('notification:admin', { message, ...data })
}
