import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Bell, Settings } from 'lucide-react'
import useAuthStore from '../stores/authStore'

interface HeaderProps {
  onMenuClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-gradient-to-r from-luxury-900 to-luxury-800 text-white shadow-luxury">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white hover:text-gold-500 transition"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-2xl font-serif font-bold text-gold-500">
            Luxe Admin
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white hover:text-gold-500 transition" aria-label="Notifications">
            <Bell size={20} />
          </button>
          <button className="text-white hover:text-gold-500 transition" aria-label="Settings">
            <Settings size={20} />
          </button>
          
          <div className="flex items-center gap-3 border-l border-luxury-700 pl-6">
            <div className="text-right">
              <p className="font-semibold text-sm">{user?.name || 'Admin'}</p>
              <p className="text-xs text-luxury-300">{user?.role || 'admin'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gold-500 transition"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
