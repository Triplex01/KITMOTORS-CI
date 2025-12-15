import { User, Bell, Car, Mail, Lock, Moon, Sun, TestTube, Phone, Shield, Smartphone, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVehiclesByUser, Vehicle } from "@/lib/firestore";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { isGranted, requestPermission } = usePushNotifications();
  const [pushEnabled, setPushEnabled] = useState(false);
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Synchroniser l'état des notifications push
  useEffect(() => {
    setPushEnabled(isGranted);
  }, [isGranted]);

  // Charger les véhicules de l'utilisateur
  useEffect(() => {
    const loadVehicles = async () => {
      if (user?.id) {
        try {
          const userVehicles = await getVehiclesByUser(user.id);
          setVehicles(userVehicles);
        } catch (error) {
          console.error("Erreur lors du chargement des véhicules:", error);
        } finally {
          setLoadingVehicles(false);
        }
      } else {
        setLoadingVehicles(false);
      }
    };
    loadVehicles();
  }, [user?.id]);

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermission();
      setPushEnabled(granted);
    } else {
      setPushEnabled(false);
    }
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "Utilisateur";
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-light mb-2">
          <span className="gradient-text-animate">Paramètres</span>
        </h1>
        <p className="text-muted-foreground font-light">Personnalisez votre expérience</p>
      </div>

      {/* Profile Section */}
      <Card className="glass-card border-border animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full premium-gradient flex items-center justify-center text-2xl text-white font-medium animate-pulse-glow">
              {getUserInitials()}
            </div>
            <div>
              <p className="font-light text-lg">{getUserDisplayName()}</p>
              <p className="text-sm text-muted-foreground font-light">{user?.email}</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-300 font-light btn-press hover:shadow-lg">
            Modifier le Profil
          </button>
        </CardContent>
      </Card>

      {/* Vehicles Section */}
      <Card className="glass-card border-border animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Car className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Véhicules Enregistrés
            {vehicles.length > 0 && (
              <Badge variant="secondary" className="ml-2 notification-pulse">{vehicles.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingVehicles ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-red-500" />
              <span className="ml-2 text-muted-foreground">Chargement...</span>
            </div>
          ) : vehicles.length > 0 ? (
            <div className="stagger-animation">
              {vehicles.map((vehicle, index) => {
                // Image par défaut selon la marque
                const getDefaultImage = () => {
                  const brandImages: Record<string, string> = {
                    "MG": "https://mgmotor.co.in/images/mg-hs-exclusive-exterior-1.jpg",
                    "MG MOTORS": "https://mgmotor.co.in/images/mg-hs-exclusive-exterior-1.jpg",
                    "CHANGAN": "http://services.kitmotors-ci.com/wp-content/uploads/2024/05/12-1-1.jpg",
                    "SOUEAST": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2018_Soueast_DX7_Prime.jpg/1200px-2018_Soueast_DX7_Prime.jpg",
                    "JETOUR": "https://jetour.com.eg/images/x70-plus-exterior.jpg",
                  };
                  return brandImages[vehicle.brand.toUpperCase()] || "http://services.kitmotors-ci.com/wp-content/uploads/2024/05/12-1-1.jpg";
                };
                const vehicleImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : getDefaultImage();
                
                return (
                  <Link 
                    key={vehicle.id} 
                    to={`/vehicle/${vehicle.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group card-hover animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Vehicle Image */}
                    <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={vehicleImage} 
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{vehicle.brand} {vehicle.model}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            vehicle.status === 'active' 
                              ? "bg-success/20 text-success border-success/30"
                              : vehicle.status === 'pending'
                              ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                              : "bg-gray-500/20 text-gray-500 border-gray-500/30"
                          }`}
                        >
                          {vehicle.status === 'active' ? 'Actif' : vehicle.status === 'pending' ? 'En attente' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vehicle.licensePlate} • {vehicle.year}</p>
                      {vehicle.color && (
                        <p className="text-xs text-muted-foreground">{vehicle.color} • {vehicle.transmission || 'Auto'}</p>
                      )}
                    </div>
                    
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-light">Aucun véhicule enregistré</p>
              <p className="text-sm">Ajoutez votre premier véhicule</p>
            </div>
          )}
          <Link 
            to="/add-vehicle"
            className="w-full py-3 px-4 rounded-lg border border-red-500/50 hover:bg-red-500/10 transition-colors font-light flex items-center justify-center gap-2 text-red-500"
          >
            <Car className="w-4 h-4" />
            + Ajouter un Véhicule
          </Link>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-light">Email</p>
                <p className="text-xs text-muted-foreground font-light">Recevoir par email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-light">Notifications Push</p>
                <p className="text-xs text-muted-foreground font-light">
                  {pushEnabled 
                    ? "Actives - Alertes en temps réel" 
                    : "Inactives - Cliquez pour activer"}
                </p>
              </div>
            </div>
            <Switch 
              checked={pushEnabled} 
              onCheckedChange={handlePushNotificationToggle}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-light">SMS</p>
                <p className="text-xs text-muted-foreground font-light">Alertes par SMS</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            ) : (
              <Sun className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            )}
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
                </div>
              )}
              <div>
                <p className="font-light">Mode {theme === "dark" ? "Sombre" : "Clair"}</p>
                <p className="text-xs text-muted-foreground font-light">
                  {theme === "dark" ? "Thème sombre activé" : "Thème clair activé"}
                </p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "400ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="font-light">Mot de Passe</p>
                <p className="text-xs text-muted-foreground font-light">Modifier votre mot de passe</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="font-light">Double Authentification</p>
                <p className="text-xs text-muted-foreground font-light">Sécurité renforcée 2FA</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "500ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <TestTube className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Tester les Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground font-light mb-3">
            Testez le système de notifications push en envoyant des notifications de démonstration.
          </p>
          <Link
            to="/test-notifications"
            className="w-full py-3 px-4 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-light text-center flex items-center justify-center gap-2"
          >
            <TestTube className="w-4 h-4" strokeWidth={1.5} />
            Accéder à la Page de Test
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
