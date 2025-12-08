import React, { useState, useEffect } from 'react'
import { BarChart3, Bell, FileText, Car, TrendingUp, Users } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { DashboardStats } from '../types'

export const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 1250,
    totalVehicles: 950,
    pendingDocuments: 43,
    pendingUpdates: 12,
    notificationsSent: 487,
    activeNotifications: 8,
  })

  const statCards = [
    {
      icon: Users,
      label: 'Utilisateurs Total',
      value: stats.totalUsers,
      trend: '+5.2%',
      color: 'text-blue-500',
    },
    {
      icon: Car,
      label: 'Véhicules',
      value: stats.totalVehicles,
      trend: '+2.1%',
      color: 'text-green-500',
    },
    {
      icon: FileText,
      label: 'Docs en Attente',
      value: stats.pendingDocuments,
      trend: '-8.3%',
      color: 'text-orange-500',
    },
    {
      icon: Bell,
      label: 'Notifications Actives',
      value: stats.activeNotifications,
      trend: '+12.5%',
      color: 'text-purple-500',
    },
  ]

  useEffect(() => {
    // Simuler le fetch des données
    console.log('Dashboard loaded')
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Titre */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-luxury-900">Tableau de Bord</h1>
              <p className="text-luxury-600 mt-2">Bienvenue sur votre Admin Dashboard</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-luxury p-6 hover:shadow-luxury-lg transition"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gray-100 ${card.color}`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {card.trend}
                      </span>
                    </div>
                    <h3 className="text-luxury-600 text-sm font-medium mb-1">
                      {card.label}
                    </h3>
                    <p className="text-3xl font-bold text-luxury-900">
                      {card.value}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Area */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-luxury p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-luxury-900">
                    Activités Récentes
                  </h2>
                  <BarChart3 className="text-gold-500" size={24} />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      type: 'upload',
                      description: 'Documents d\'assurance approuvés',
                      time: 'il y a 2h',
                    },
                    {
                      type: 'notification',
                      description: 'Notification envoyée à 125 utilisateurs',
                      time: 'il y a 4h',
                    },
                    {
                      type: 'update',
                      description: 'Mise à jour de véhicule approuvée',
                      time: 'il y a 6h',
                    },
                    {
                      type: 'registration',
                      description: '3 nouveaux utilisateurs inscris',
                      time: 'il y a 1j',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="w-2 h-2 rounded-full bg-gold-500 mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-luxury-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-luxury-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-luxury p-6">
                <h2 className="text-lg font-bold text-luxury-900 mb-6">
                  Actions Rapides
                </h2>

                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-luxury-900 font-semibold rounded-lg hover:shadow-luxury transition">
                    Envoyer Notification
                  </button>
                  <button className="w-full px-4 py-3 bg-luxury-100 text-luxury-900 font-semibold rounded-lg hover:bg-luxury-200 transition">
                    Gérer Documents
                  </button>
                  <button className="w-full px-4 py-3 bg-luxury-100 text-luxury-900 font-semibold rounded-lg hover:bg-luxury-200 transition">
                    Valider Véhicules
                  </button>
                  <button className="w-full px-4 py-3 bg-luxury-100 text-luxury-900 font-semibold rounded-lg hover:bg-luxury-200 transition">
                    Voir Rapports
                  </button>
                </div>

                {/* Stats Footer */}
                <div className="mt-8 p-4 bg-luxury-50 rounded-lg border border-luxury-200">
                  <p className="text-xs text-luxury-600 mb-2">
                    <strong>Prochaines tâches:</strong>
                  </p>
                  <ul className="text-xs text-luxury-500 space-y-1">
                    <li>• 43 documents en attente de validation</li>
                    <li>• 12 mises à jour de véhicules</li>
                    <li>• Rapport mensuel à générer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
