import React, { useState } from 'react'
import { Car, CheckCircle, AlertCircle, Trash2, Eye } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import useVehicleStore from '../stores/vehicleStore'
import dayjs from 'dayjs'

export const VehiclesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending_review' | 'inactive'>('all')
  const { vehicles, updates, approveUpdate, rejectUpdate } = useVehicleStore()

  // Mock data
  const mockVehicles = [
    {
      id: 'v1',
      ownerId: 'u1',
      make: 'BMW',
      model: '750i',
      year: 2023,
      color: 'Noir',
      licensePlate: 'AB-123-CD',
      vin: 'WBADH7C50DE123456',
      status: 'active' as const,
      mileage: 5250,
      createdAt: '2024-01-15',
      updatedAt: '2024-11-20',
      documents: [],
    },
    {
      id: 'v2',
      ownerId: 'u2',
      make: 'Mercedes',
      model: 'S-Class',
      year: 2024,
      color: 'Blanc',
      licensePlate: 'EF-456-GH',
      vin: 'WDDZF3CB3JD123456',
      status: 'pending_review' as const,
      mileage: 2100,
      createdAt: '2024-11-01',
      updatedAt: '2024-11-25',
      documents: [],
    },
  ]

  const mockUpdates = [
    {
      id: 'u1',
      vehicleId: 'v1',
      field: 'mileage',
      oldValue: 5000,
      newValue: 5250,
      status: 'pending' as const,
      requestedAt: '2024-11-28',
    },
    {
      id: 'u2',
      vehicleId: 'v2',
      field: 'color',
      oldValue: 'Argent',
      newValue: 'Blanc',
      status: 'pending' as const,
      requestedAt: '2024-11-27',
    },
  ]

  const filteredVehicles = mockVehicles.filter((v) => {
    if (filterStatus === 'all') return true
    return v.status === filterStatus
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-luxury-900">
                Gestion des Véhicules
              </h1>
              <p className="text-luxury-600 mt-2">
                Gérez les véhicules et approuvez les mises à jour
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-luxury-200">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'active', label: 'Actifs' },
                { value: 'pending_review', label: 'En révision' },
                { value: 'inactive', label: 'Inactifs' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() =>
                    setFilterStatus(
                      tab.value as
                        | 'all'
                        | 'active'
                        | 'pending_review'
                        | 'inactive'
                    )
                  }
                  className={`px-4 py-3 font-medium border-b-2 transition ${
                    filterStatus === tab.value
                      ? 'border-gold-500 text-gold-500'
                      : 'border-transparent text-luxury-600 hover:text-luxury-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Vehicles List */}
            <div className="space-y-4 mb-8">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-xl shadow-luxury p-6 hover:shadow-luxury-lg transition"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Car size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-luxury-900">
                          {vehicle.make} {vehicle.model}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-luxury-600">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-luxury-500">
                              Plaque
                            </p>
                            <p className="font-mono font-semibold">
                              {vehicle.licensePlate}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-luxury-500">
                              Année
                            </p>
                            <p>{vehicle.year}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-luxury-500">
                              Couleur
                            </p>
                            <p>{vehicle.color}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-luxury-500">
                              Kilométrage
                            </p>
                            <p className="font-semibold">{vehicle.mileage} km</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-right">
                      {vehicle.status === 'active' && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mb-4">
                          <CheckCircle size={16} />
                          Actif
                        </div>
                      )}
                      {vehicle.status === 'pending_review' && (
                        <div className="flex items-center gap-2 text-orange-600 text-sm font-semibold mb-4">
                          <AlertCircle size={16} />
                          En révision
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-luxury-200">
                    <button className="flex items-center gap-2 px-4 py-2 bg-luxury-100 text-luxury-700 font-semibold rounded-lg hover:bg-luxury-200 transition">
                      <Eye size={16} />
                      Détails
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-luxury-100 text-luxury-700 font-semibold rounded-lg hover:bg-luxury-200 transition">
                      Voir Documents
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Updates Section */}
            <div className="bg-white rounded-xl shadow-luxury p-6">
              <h2 className="text-lg font-bold text-luxury-900 mb-6">
                Mises à jour en attente ({mockUpdates.length})
              </h2>

              <div className="space-y-4">
                {mockUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="border border-luxury-200 rounded-lg p-4 hover:bg-gold-50 transition"
                  >
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-luxury-900">
                          Mise à jour de {update.field}
                        </h4>
                        <p className="text-sm text-luxury-600 mt-1">
                          Véhicule: {update.vehicleId} |{' '}
                          {dayjs(update.requestedAt).format('DD/MM/YYYY HH:mm')}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <p className="text-luxury-600">Ancien</p>
                          <p className="font-mono font-semibold text-luxury-900">
                            {update.oldValue}
                          </p>
                        </div>
                        <span className="text-luxury-400">→</span>
                        <div>
                          <p className="text-luxury-600">Nouveau</p>
                          <p className="font-mono font-semibold text-gold-500">
                            {update.newValue}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-luxury-200">
                      <button
                        onClick={() => approveUpdate(update.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition flex-1"
                      >
                        <CheckCircle size={16} />
                        Approuver
                      </button>
                      <button
                        onClick={() =>
                          rejectUpdate(update.id, 'Informations non vérifiées')
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition flex-1"
                      >
                        <AlertCircle size={16} />
                        Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VehiclesPage
