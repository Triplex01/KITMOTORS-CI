import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Car, Bell, FileText, Settings, Activity, LogOut, User, Sun, Moon } from "lucide-react";
import { useVehicleNotifications } from "@/hooks/use-vehicle-notifications";
import { PushNotificationPrompt } from "./PushNotificationPrompt";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "./ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { unreadCount } = useVehicleNotifications();
  const { user, logout } = useAuth();
  const { actualTheme, setTheme } = useTheme();

  const isDark = actualTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const navItems = [
    { path: "/", icon: Car, label: "Dashboard" },
    { path: "/notifications", icon: Bell, label: "Notifications", badge: unreadCount > 0 ? unreadCount : null },
    { path: "/diagnostics", icon: Activity, label: "Diagnostics" },
    { path: "/history", icon: FileText, label: "Historique" },
    { path: "/settings", icon: Settings, label: "Paramètres" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Push Notification Prompt */}
      <PushNotificationPrompt />

      {/* Top Bar - Réduit */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Bouton Theme - Gauche */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-9 h-9"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </Button>

          {/* Logo Centré */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/logo.png" 
              alt="KitMotors Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          
          <div className="flex items-center gap-2">

            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {user.firstName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="rounded-full w-9 h-9 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 relative ${
                    active
                      ? "text-red-500 scale-110"
                      : "text-muted-foreground hover:text-red-500 hover:scale-105"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "animate-scale-in text-red-500" : ""}`} strokeWidth={1.5} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                  <span className="text-xs font-light">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
