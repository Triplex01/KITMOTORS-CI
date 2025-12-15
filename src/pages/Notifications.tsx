import { Shield, Bell, Car, Loader2, Info, Wrench, Gauge, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVehiclesByUser, Vehicle, getNotificationsByUser, Notification, markNotificationAsRead } from "@/lib/firestore";

// Catégories de notifications
const categories = [
  { id: 'all', name: 'Toutes', icon: Bell },
  { id: 'insurance', name: 'Assurance', icon: Shield },
  { id: 'technical_visit', name: 'Visite Tech.', icon: Wrench },
  { id: 'oil_change', name: 'Vidange', icon: Gauge },
  { id: 'maintenance', name: 'Entretien', icon: Car },
  { id: 'general', name: 'Général', icon: Info },
];

const Notifications = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        try {
          const [userVehicles, userNotifications] = await Promise.all([
            getVehiclesByUser(user.id),
            getNotificationsByUser(user.id)
          ]);
          setVehicles(userVehicles);
          setNotifications(userNotifications);
        } catch (error) {
          console.error("Erreur:", error);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error("Erreur marquage notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  const mainVehicle = vehicles[0];

  // Image par défaut selon la marque
  const getDefaultImage = (brand: string) => {
    const brandImages: Record<string, string> = {
      'MG MOTORS': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'JETOUR': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'SOUEAST': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
      'CHANGAN': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    };
    return brandImages[brand] || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800';
  };

  const getNotificationIcon = (type: string, category?: string) => {
    // Priorité à la catégorie
    switch (category) {
      case 'insurance':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'technical_visit':
        return <Wrench className="w-5 h-5 text-purple-500" />;
      case 'oil_change':
        return <Gauge className="w-5 h-5 text-orange-500" />;
      case 'maintenance':
        return <Car className="w-5 h-5 text-green-500" />;
      case 'general':
        return <Info className="w-5 h-5 text-gray-500" />;
    }
    
    // Fallback sur le type
    switch (type) {
      case "warning":
        return <Shield className="w-5 h-5 text-yellow-500" />;
      case "alert":
        return <Shield className="w-5 h-5 text-red-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case 'urgent':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Urgent</Badge>;
      case 'important':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Important</Badge>;
      default:
        return null;
    }
  };

  const filteredNotifications = selectedCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === selectedCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Récent';
    try {
      const date = typeof timestamp?.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "À l'instant";
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return 'Récent';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-light mb-2">
          <span className="gradient-text-animate">Notifications</span>
        </h1>
        <p className="text-muted-foreground font-light">Alertes et informations importantes</p>
      </div>

      {/* Vehicle Card */}
      {mainVehicle && (
        <Card className="glass-card border-border overflow-hidden animate-slide-up card-hover">
          <div className="relative h-32">
            <img
              src={mainVehicle.images?.[0] || getDefaultImage(mainVehicle.brand)}
              alt={mainVehicle.brand + " " + mainVehicle.model}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <Badge className="bg-red-500/90 text-white border-0 mb-1 animate-pulse-glow">{mainVehicle.brand}</Badge>
                <h2 className="text-lg font-light text-foreground">{mainVehicle.model}</h2>
              </div>
              <Badge variant="outline" className="bg-card/80 backdrop-blur">
                {mainVehicle.licensePlate}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 animate-slide-in">
        {categories.map((cat, index) => {
          const count = cat.id === 'all' 
            ? notifications.length 
            : notifications.filter(n => n.category === cat.id).length;
          const isActive = selectedCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 btn-press ${
                isActive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <cat.icon className={`w-4 h-4 ${isActive ? 'animate-bounce-in' : ''}`} />
              <span className="text-sm font-medium">{cat.name}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-muted'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Historique des notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  onClick={() => !notification.read && handleMarkAsRead(notification.id!)}
                  className={`p-4 rounded-xl transition-all cursor-pointer ${
                    !notification.read 
                      ? 'bg-red-500/5 border border-red-500/30 hover:border-red-500/50' 
                      : 'bg-secondary/30 hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      !notification.read ? 'bg-red-500/10' : 'bg-secondary'
                    }`}>
                      {getNotificationIcon(notification.type, notification.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </p>
                        {getUrgencyBadge(notification.urgency)}
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </p>
                        {notification.category && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {categories.find(c => c.id === notification.category)?.name || notification.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
              <h3 className="text-lg font-medium mb-2">Aucune notification</h3>
              <p className="text-sm text-muted-foreground">
                {selectedCategory === 'all' 
                  ? "Vous n'avez pas encore de notifications"
                  : `Aucune notification dans la catégorie "${categories.find(c => c.id === selectedCategory)?.name}"`
                }
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Les rappels d'assurance, visites techniques et vidanges apparaîtront ici
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents Section */}
      {mainVehicle?.documents && (mainVehicle.documents.insurance || mainVehicle.documents.registration) && (
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-xl font-light flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              Documents du véhicule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mainVehicle.documents.insurance && (
              <div className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    Assurance
                  </span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Actif</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Compagnie: {mainVehicle.documents.insurance.company}</p>
                <p className="text-sm text-muted-foreground">N°: {mainVehicle.documents.insurance.number}</p>
                <p className="text-sm text-muted-foreground">Expire le: {mainVehicle.documents.insurance.expiry}</p>
              </div>
            )}
            {mainVehicle.documents.registration && (
              <div className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-purple-500" />
                    Carte Grise / Visite Technique
                  </span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Valide</Badge>
                </div>
                <p className="text-sm text-muted-foreground">N°: {mainVehicle.documents.registration.number}</p>
                <p className="text-sm text-muted-foreground">Expire le: {mainVehicle.documents.registration.expiry}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Vehicle Message */}
      {!mainVehicle && (
        <Card className="glass-card border-border">
          <CardContent className="p-12 text-center">
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light mb-2">Aucun véhicule</h3>
            <p className="text-muted-foreground text-sm">
              Aucun véhicule n'est associé à votre compte.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
