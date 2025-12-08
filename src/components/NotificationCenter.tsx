import { FC, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAdminNotifications } from '../hooks/useAdminNotifications.js'
import { Bell, X, CheckCircle2 } from 'lucide-react'

export const NotificationCenter: FC = () => {
  const { notifications, unreadCount, isConnected, error, markAsRead, clearNotification } =
    useAdminNotifications()

  // Show error toast if connection fails
  useEffect(() => {
    if (error) {
      toast.error(`Connection error: ${error}`)
    }
  }, [error])

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-lg text-sm">
          ⚠️ Reconnecting to server...
        </div>
      )}

      {/* Notifications Stack */}
      <div className="space-y-2">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm transition-all ${
              notification.read ? 'bg-gray-100 border-gray-300' : 'bg-blue-50 border-blue-500 animate-pulse'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{notification.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>

                  {/* Vehicle IDs if applicable */}
                  {notification.vehicleIds && notification.vehicleIds.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      🚗 {notification.vehicleIds.join(', ')}
                    </div>
                  )}

                  {/* Timestamp */}
                  <time className="text-xs text-gray-400 mt-2 block">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </time>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0 ml-2">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 hover:bg-blue-100 rounded transition"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </button>
                )}
                <button
                  onClick={() => clearNotification(notification.id)}
                  className="p-1 hover:bg-red-100 rounded transition"
                  title="Dismiss"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && isConnected && (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
          ✨ No notifications yet
        </div>
      )}

      {/* Notification Badge */}
      {unreadCount > 0 && (
        <div className="fixed top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
          {unreadCount}
        </div>
      )}
    </div>
  )
}
