import { create } from 'zustand'
import { Vehicle, VehicleDocument, VehicleUpdate } from '../types'

interface VehicleStore {
  vehicles: Vehicle[]
  documents: VehicleDocument[]
  updates: VehicleUpdate[]
  isLoading: boolean
  error: string | null
  fetchVehicles: () => Promise<void>
  fetchDocuments: () => Promise<void>
  fetchUpdates: () => Promise<void>
  addVehicle: (vehicle: Vehicle) => void
  uploadDocument: (document: VehicleDocument) => Promise<void>
  approveDocument: (documentId: string) => void
  rejectDocument: (documentId: string, reason: string) => void
  approveUpdate: (updateId: string) => void
  rejectUpdate: (updateId: string, reason: string) => void
}

const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: [],
  documents: [],
  updates: [],
  isLoading: false,
  error: null,

  fetchVehicles: async () => {
    set({ isLoading: true, error: null })
    try {
      // Mock data
      set({ vehicles: [], isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch vehicles'
      set({ error: message, isLoading: false })
    }
  },

  fetchDocuments: async () => {
    set({ isLoading: true, error: null })
    try {
      set({ documents: [], isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch documents'
      set({ error: message, isLoading: false })
    }
  },

  fetchUpdates: async () => {
    set({ isLoading: true, error: null })
    try {
      set({ updates: [], isLoading: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch updates'
      set({ error: message, isLoading: false })
    }
  },

  addVehicle: (vehicle) => {
    set((state) => ({
      vehicles: [...state.vehicles, vehicle],
    }))
  },

  uploadDocument: async (document) => {
    set({ isLoading: true, error: null })
    try {
      set((state) => ({
        documents: [...state.documents, document],
        isLoading: false,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload document'
      set({ error: message, isLoading: false })
    }
  },

  approveDocument: (documentId) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId ? { ...d, status: 'approved' as const } : d
      ),
    }))
  },

  rejectDocument: (documentId, reason) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? { ...d, status: 'rejected' as const, notes: reason }
          : d
      ),
    }))
  },

  approveUpdate: (updateId) => {
    set((state) => ({
      updates: state.updates.map((u) =>
        u.id === updateId
          ? {
              ...u,
              status: 'approved' as const,
              reviewedAt: new Date().toISOString(),
            }
          : u
      ),
    }))
  },

  rejectUpdate: (updateId, reason) => {
    set((state) => ({
      updates: state.updates.map((u) =>
        u.id === updateId
          ? {
              ...u,
              status: 'rejected' as const,
              reviewedAt: new Date().toISOString(),
              notes: reason,
            }
          : u
      ),
    }))
  },
}))

export default useVehicleStore
