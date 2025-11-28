import { Link, useLocation, Outlet } from "react-router-dom";
import { Car, Bell, FileText, Settings, Activity } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Car, label: "Dashboard" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/diagnostics", icon: Activity, label: "Diagnostics" },
    { path: "/history", icon: FileText, label: "Historique" },
    { path: "/settings", icon: Settings, label: "Paramètres" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-light tracking-wide">
              <span className="text-gradient">Auto</span>
              <span className="text-foreground">Premium</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <Outlet />
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
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? "text-primary scale-110"
                      : "text-muted-foreground hover:text-foreground hover:scale-105"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "animate-scale-in" : ""}`} strokeWidth={1.5} />
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
