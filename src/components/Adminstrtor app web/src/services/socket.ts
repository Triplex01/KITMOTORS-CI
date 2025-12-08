import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000'

let socket: Socket | null = null

export const initializeSocket = (token: string) => {
  if (socket?.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = (): Socket | null => {
  return socket
}

export const onDashboardUpdate = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('dashboard:update', callback)
  }
}

export const onNotificationSent = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('notification:sent', callback)
  }
}

export const onDocumentStatusChange = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('document:status-changed', callback)
  }
}

export const onVehicleUpdateRequest = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('vehicle:update-request', callback)
  }
}

export const emitEvent = (eventName: string, data: any) => {
  if (socket) {
    socket.emit(eventName, data)
  }
}
