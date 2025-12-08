import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../stores/authStore'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@luxedrive.com')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      toast.success('Bienvenue!')
      navigate('/')
    } catch (error) {
      toast.error('Erreur de connexion. Vérifiez vos identifiants.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-900 via-luxury-800 to-luxury-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-gold-500 mb-2">
            Luxe Drive
          </h1>
          <p className="text-luxury-300">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-luxury-lg p-8">
          <h2 className="text-2xl font-bold text-luxury-900 mb-6 text-center">
            Connexion Administrateur
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-luxury-700 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  placeholder="admin@luxedrive.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-luxury-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-luxury-300 rounded-lg focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-luxury-900 font-semibold py-3 rounded-lg hover:shadow-luxury transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo Hint */}
          <div className="mt-6 p-4 bg-luxury-50 rounded-lg">
            <p className="text-xs text-luxury-600">
              <strong>Démonstration:</strong> Les identifiants sont préremplis.
              Cliquez sur « Se connecter » pour accéder.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-luxury-300 text-sm">
          <p>&copy; 2025 Luxe Drive Hub. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
