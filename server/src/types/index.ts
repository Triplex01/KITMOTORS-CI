// Auth types
export interface LoginRequest {
  email: string
  password: string
  userType: 'client' | 'admin'
}

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  role?: string
  userType: 'client' | 'admin'
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// Vehicle types
export interface Vehicle {
  id: string
  userId: string
  vin: string
  licensePlate: string
  make: string
  model: string
  year: number
  color: string
  mileage: number
  transmissionType?: string
  fuelType: string
  status: 'active' | 'pending' | 'suspended' | 'archived'
  createdAt: Date
  updatedAt: Date
}

// Notification types
export interface Notification {
  id: string
  adminId: string
  title: string
  message: string
  imageUrl?: string
  notificationType: 'general' | 'alert' | 'maintenance' | 'document' | 'update'
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  targetType: 'all' | 'vehicle' | 'user' | 'group'
  targetId?: string
  createdAt: Date
  sentAt?: Date
}

export interface NotificationHistory {
  id: string
  notificationId: string
  userId: string
  vehicleId?: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  deliveredAt?: Date
  readAt?: Date
}

// Socket.IO event types
export interface SocketMessage {
  type: string
  data: any
  timestamp: Date
}
