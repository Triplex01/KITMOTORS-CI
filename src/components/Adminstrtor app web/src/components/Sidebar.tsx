import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Bell,
  FileText,
  Car,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react'
import { clsx } from 'clsx'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: FileText, label: 'Gestion Documents', path: '/documents' },
  { icon: Car, label: 'Véhicules', path: '/vehicles' },
  { icon: Settings, label: 'Paramètres', path: '/settings' },
]

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-luxury-900 text-white overflow-y-auto transition-transform duration-300 z-50 lg:relative lg:top-0 lg:h-screen lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 lg:hidden flex justify-between items-center">
          <span className="text-gold-500 font-semibold">Menu</span>
          <button onClick={onClose} className="text-white hover:text-gold-500">
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <div key={item.label}>
                <Link
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-gold-500 text-luxury-900 font-semibold'
                      : 'text-white hover:bg-luxury-800'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-luxury-800">
          <div className="text-xs text-luxury-400">
            <p>Luxe Drive Hub</p>
            <p>Admin Dashboard v1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
