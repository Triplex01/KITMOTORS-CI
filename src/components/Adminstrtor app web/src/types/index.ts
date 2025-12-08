// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'support'
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// Types pour les notifications
export interface PushNotification {
  id: string
  title: string
  message: string
  imageUrl?: string
  userId?: string
  targetGroup?: 'all' | 'specific' | 'segment'
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  createdAt: string
  sentAt?: string
  readCount: number
  totalCount: number
}

// Types pour les documents
export interface VehicleDocument {
  id: string
  vehicleId: string
  ownerId: string
  type: 'insurance' | 'registration' | 'inspection' | 'maintenance' | 'other'
  fileName: string
  fileUrl: string
  uploadDate: string
  expiryDate?: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

// Types pour les véhicules
export interface Vehicle {
  id: string
  ownerId: string
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  vin: string
  status: 'active' | 'inactive' | 'pending_review'
  mileage: number
  lastMaintenance?: string
  documents: VehicleDocument[]
  createdAt: string
  updatedAt: string
}

export interface VehicleUpdate {
  id: string
  vehicleId: string
  field: string
  oldValue: any
  newValue: any
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

// Types pour le dashboard
export interface DashboardStats {
  totalUsers: number
  totalVehicles: number
  pendingDocuments: number
  pendingUpdates: number
  notificationsSent: number
  activeNotifications: number
}

export interface RecentActivity {
  id: string
  type: 'document_upload' | 'notification_sent' | 'update_request' | 'user_registration'
  description: string
  timestamp: string
  userId?: string
  vehicleId?: string
}
