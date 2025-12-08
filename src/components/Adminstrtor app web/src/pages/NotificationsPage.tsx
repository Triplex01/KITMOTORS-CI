import React, { useState } from 'react'
import { Send, Plus, Filter, Clock, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import useNotificationStore from '../stores/notificationStore'
import toast from 'react-hot-toast'

export const NotificationsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    imageUrl: '',
    targetGroup: 'all' as const,
  })

  const { notifications, sendNotification, isLoading } = useNotificationStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.message) {
      toast.error('Remplissez tous les champs obligatoires')
      return
    }

    try {
      await sendNotification({
        ...formData,
        status: 'sent',
      })
      toast.success('Notification envoyée avec succès!')
      setFormData({ title: '', message: '', imageUrl: '', targetGroup: 'all' })
      setShowForm(false)
    } catch (error) {
      toast.error('Erreur lors de l\'envoi')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-luxury-900">
                  Gestion des Notifications
                </h1>
                <p className="text-luxury-600 mt-2">
                  Envoyez des notifications push aux utilisateurs
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-luxury-900 font-semibold rounded-lg hover:shadow-luxury transition"
              >
                <Plus size={20} />
                Nouvelle Notification
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-xl shadow-luxury p-6 mb-8">
                <h2 className="text-lg font-bold text-luxury-900 mb-6">
                  Créer une Notification
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Titre *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                        placeholder="Ex: Maintenance requise"
                      />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                        placeholder="Contenu du message..."
                      />
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        URL Image
                      </label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Target Group */}
                    <div>
                      <label className="block text-sm font-medium text-luxury-700 mb-2">
                        Groupe Cible
                      </label>
                      <select
                        value={formData.targetGroup}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            targetGroup: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                      >
                        <option value="all">Tous les utilisateurs</option>
                        <option value="specific">Utilisateurs spécifiques</option>
                        <option value="segment">Par segment</option>
                      </select>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-luxury-900 font-semibold rounded-lg hover:shadow-luxury transition disabled:opacity-50"
                    >
                      <Send size={20} />
                      {isLoading ? 'Envoi...' : 'Envoyer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 bg-luxury-100 text-luxury-900 font-semibold rounded-lg hover:bg-luxury-200 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-luxury p-12 text-center">
                  <p className="text-luxury-600">
                    Aucune notification trouvée. Créez-en une nouvelle!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="bg-white rounded-xl shadow-luxury p-6 hover:shadow-luxury-lg transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-luxury-900">
                            {notification.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              notification.status === 'sent'
                                ? 'bg-green-100 text-green-700'
                                : notification.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {notification.status === 'sent'
                              ? 'Envoyée'
                              : 'Brouillon'}
                          </span>
                        </div>
                        <p className="text-luxury-600 mb-4">
                          {notification.message}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-luxury-500">
                          <span className="flex items-center gap-2">
                            <CheckCircle size={16} />
                            {notification.readCount} lues
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock size={16} />
                            {new Date(
                              notification.sentAt || notification.createdAt
                            ).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-gold-500">
                          {((notification.readCount /
                            notification.totalCount) *
                            100).toFixed(0)}
                          %
                        </p>
                        <p className="text-xs text-luxury-500">Taux de lecture</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default NotificationsPage
