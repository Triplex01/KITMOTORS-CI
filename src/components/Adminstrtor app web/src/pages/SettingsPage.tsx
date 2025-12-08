import React, { useState } from 'react'
import { Settings, Save, Lock, Bell as BellIcon, Shield } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import toast from 'react-hot-toast'

export const SettingsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    autoApprove: false,
    maxFileSize: 10,
  })

  const handleSave = () => {
    toast.success('Paramètres sauvegardés avec succès!')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-luxury-900">
                Paramètres Administrateur
              </h1>
              <p className="text-luxury-600 mt-2">
                Configurez votre tableau de bord et vos préférences
              </p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-luxury p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BellIcon className="text-gold-500" size={24} />
                  <h2 className="text-lg font-bold text-luxury-900">
                    Notifications
                  </h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative w-12 h-6 bg-luxury-300 rounded-full transition">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.emailNotifications ? 'translate-x-6 bg-gold-500' : ''
                        }`}
                      />
                    </div>
                    <span className="text-luxury-900">
                      Notifications par email
                    </span>
                  </label>

                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative w-12 h-6 bg-luxury-300 rounded-full transition">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            smsNotifications: e.target.checked,
                          })
                        }
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.smsNotifications ? 'translate-x-6 bg-gold-500' : ''
                        }`}
                      />
                    </div>
                    <span className="text-luxury-900">
                      Notifications par SMS
                    </span>
                  </label>

                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative w-12 h-6 bg-luxury-300 rounded-full transition">
                      <input
                        type="checkbox"
                        checked={settings.weeklyReports}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            weeklyReports: e.target.checked,
                          })
                        }
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.weeklyReports ? 'translate-x-6 bg-gold-500' : ''
                        }`}
                      />
                    </div>
                    <span className="text-luxury-900">
                      Rapports hebdomadaires
                    </span>
                  </label>
                </div>
              </div>

              {/* Security */}
              <div className="bg-white rounded-xl shadow-luxury p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-gold-500" size={24} />
                  <h2 className="text-lg font-bold text-luxury-900">Sécurité</h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative w-12 h-6 bg-luxury-300 rounded-full transition">
                      <input
                        type="checkbox"
                        checked={settings.autoApprove}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            autoApprove: e.target.checked,
                          })
                        }
                        className="absolute w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                          settings.autoApprove ? 'translate-x-6 bg-gold-500' : ''
                        }`}
                      />
                    </div>
                    <div>
                      <span className="text-luxury-900 block">
                        Approbation automatique
                      </span>
                      <p className="text-sm text-luxury-600 mt-1">
                        Approuver automatiquement les petits fichiers
                      </p>
                    </div>
                  </label>

                  <button className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full text-left">
                    <Lock size={20} />
                    <div>
                      <p className="font-medium">Changer le mot de passe</p>
                      <p className="text-sm text-red-500">
                        Dernière modification: il y a 3 mois
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-white rounded-xl shadow-luxury p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="text-gold-500" size={24} />
                  <h2 className="text-lg font-bold text-luxury-900">
                    Gestion des fichiers
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-luxury-700 mb-2">
                      Taille maximale de fichier (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxFileSize: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500"
                      min={1}
                      max={100}
                    />
                    <p className="text-sm text-luxury-600 mt-2">
                      Limite par défaut pour les uploads
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 mt-8 sticky bottom-0">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-luxury-900 font-semibold rounded-lg hover:shadow-luxury transition"
              >
                <Save size={20} />
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage
