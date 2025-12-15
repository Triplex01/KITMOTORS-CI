import { useState, useEffect } from "react";
import { Shield, Wrench, Gauge, AlertTriangle, Clock, ChevronRight, FileText, Download, Car, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getVehiclesByUser, Vehicle } from "@/lib/firestore";

const Dashboard = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      if (user?.id) {
        try {
          const userVehicles = await getVehiclesByUser(user.id);
          setVehicles(userVehicles);
        } catch (error) {
          console.error('Erreur chargement véhicules:', error);
        }
      }
      setLoading(false);
    };
    loadVehicles();
  }, [user?.id]);

  const mainVehicle = vehicles[0];

  const getDefaultImage = (brand: string) => {
    const brandImages: Record<string, string> = {
      'MG MOTORS': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
      'JETOUR': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      'SOUEAST': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
      'CHANGAN': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    };
    return brandImages[brand] || 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800';
  };

  const getMileageStatus = () => {
    if (!mainVehicle?.mileage) return "Non renseigné";
    return "Kilométrage: " + mainVehicle.mileage.toLocaleString() + " km";
  };

  const statusCards = [
    {
      title: "Assurance",
      icon: Shield,
      status: mainVehicle?.documents?.insurance ? "À jour" : "Non renseigné",
      urgency: mainVehicle?.documents?.insurance ? "success" : "info",
      date: mainVehicle?.documents?.insurance?.expiry || "Ajoutez vos informations",
      link: "/notifications",
    },
    {
      title: "Visite Technique",
      icon: Wrench,
      status: mainVehicle?.documents?.registration ? "À jour" : "Non renseigné",
      urgency: mainVehicle?.documents?.registration ? "success" : "info",
      date: mainVehicle?.documents?.registration?.expiry || "Ajoutez vos informations",
      link: "/notifications",
    },
    {
      title: "Prochaine Vidange",
      icon: Gauge,
      status: getMileageStatus(),
      urgency: "info",
      date: "Consultez votre carnet d'entretien",
      link: "/diagnostics",
    },
    {
      title: "Diagnostic Moteur",
      icon: AlertTriangle,
      status: "Aucune alerte",
      urgency: "success",
      date: "Véhicule en bon état",
      link: "/diagnostics",
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "warning":
        return "bg-warning/20 text-warning border-warning/30";
      case "success":
        return "bg-success/20 text-success border-success/30";
      case "info":
        return "bg-info/20 text-info border-info/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  const vehicleCountText = vehicles.length > 0 
    ? "Vous avez " + vehicles.length + " véhicule" + (vehicles.length > 1 ? 's' : '') + " enregistré" + (vehicles.length > 1 ? 's' : '')
    : "Aucun véhicule enregistré pour le moment";

  return (
    <div className="space-y-8">
      <div className="text-center py-4 animate-fade-in">
        <h1 className="text-2xl font-light text-foreground">
          Bienvenue, <span className="text-red-500 font-medium gradient-text-animate">{user?.firstName} {user?.lastName}</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{vehicleCountText}</p>
      </div>

      {mainVehicle ? (
        <Card className="glass-card border-border overflow-hidden card-hover group animate-slide-up">
          <div className="relative h-64 overflow-hidden">
            <img
              src={mainVehicle.images?.[0] || getDefaultImage(mainVehicle.brand)}
              alt={mainVehicle.brand + " " + mainVehicle.model}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-red-500/90 text-white border-0 animate-pulse-glow">{mainVehicle.brand}</Badge>
                {mainVehicle.year && (
                  <Badge variant="outline" className="bg-card/80 backdrop-blur border-border">{mainVehicle.year}</Badge>
                )}
              </div>
              <h2 className="text-3xl font-light mb-2 text-foreground">{mainVehicle.model}</h2>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-card/80 backdrop-blur border-border px-3 py-1">
                  {mainVehicle.licensePlate}
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 animate-float" strokeWidth={1.5} />
                  <span className="text-sm font-light">
                    {mainVehicle.mileage ? mainVehicle.mileage.toLocaleString() + " km" : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <Link to={"/vehicle/" + mainVehicle.id} className="flex items-center justify-between group/link">
              <span className="text-sm text-muted-foreground font-light underline-hover">Voir les détails de votre véhicule</span>
              <ChevronRight className="w-4 h-4 text-red-500 transition-transform group-hover/link:translate-x-1" strokeWidth={1.5} />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card border-border overflow-hidden">
          <CardContent className="p-12 text-center">
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light mb-2">Aucun véhicule</h3>
            <p className="text-muted-foreground text-sm">
              Vous n'avez pas encore de véhicule enregistré. Contactez KitMotors pour ajouter votre véhicule.
            </p>
          </CardContent>
        </Card>
      )}

      {mainVehicle && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainVehicle.color && (
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Couleur</p>
                <p className="font-medium">{mainVehicle.color}</p>
              </CardContent>
            </Card>
          )}
          {mainVehicle.fuelType && (
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Carburant</p>
                <p className="font-medium capitalize">{mainVehicle.fuelType}</p>
              </CardContent>
            </Card>
          )}
          {mainVehicle.transmission && (
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Transmission</p>
                <p className="font-medium capitalize">{mainVehicle.transmission}</p>
              </CardContent>
            </Card>
          )}
          {mainVehicle.purchaseDate && (
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Date d'achat</p>
                <p className="font-medium">{new Date(mainVehicle.purchaseDate).toLocaleDateString('fr-FR')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-animation">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.link} className="block">
              <Card className="glass-card border-border card-hover group h-full animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors icon-spin-hover">
                      <Icon className="w-6 h-6 text-red-500" strokeWidth={1.5} />
                    </div>
                    <Badge variant="outline" className={getUrgencyColor(card.urgency) + " border font-light px-3 py-1"}>
                      {card.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-light mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground font-light">{card.date}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="glass-card border-border animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <CardContent className="p-6">
          <h3 className="text-lg font-light mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-animation">
            <Link to="/history" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group btn-press ripple animate-scale-in">
              <Clock className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Historique</span>
            </Link>
            <Link to="/diagnostics" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group btn-press ripple animate-scale-in">
              <AlertTriangle className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Scanner</span>
            </Link>
            <Link to="/notifications" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group btn-press ripple animate-scale-in">
              <Shield className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Assurance</span>
            </Link>
            <Link to="/settings" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group btn-press ripple animate-scale-in">
              <Wrench className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Paramètres</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-border animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Rapports d'Activités
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-light text-lg">Rapport Mensuel</p>
                  <p className="text-xs text-muted-foreground font-light">Décembre 2025</p>
                </div>
                <FileText className="w-5 h-5 text-red-500/50" />
              </div>
              <p className="text-sm text-muted-foreground font-light mb-3">
                Résumé complet des activités, entretiens et diagnostics du mois
              </p>
              <a href="/reports/activity-report-dec-2025.pdf" download className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors font-light">
                <Download className="w-4 h-4" />
                Télécharger en PDF
              </a>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-light text-lg">Rapport Annuel</p>
                  <p className="text-xs text-muted-foreground font-light">Année 2025</p>
                </div>
                <FileText className="w-5 h-5 text-red-500/50" />
              </div>
              <p className="text-sm text-muted-foreground font-light mb-3">
                Vue d'ensemble annuelle complète avec statistiques et tendances
              </p>
              <a href="/reports/activity-report-annual-2025.pdf" download className="inline-flex items-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors font-light">
                <Download className="w-4 h-4" />
                Télécharger en PDF
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
