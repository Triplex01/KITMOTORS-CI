import { Activity, Battery, Droplet, Disc, Car, Loader2, Gauge, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVehiclesByUser, Vehicle } from "@/lib/firestore";

const Diagnostics = () => {
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
          console.error("Erreur:", error);
        }
      }
      setLoading(false);
    };
    loadVehicles();
  }, [user?.id]);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Diagnostics</span>
        </h1>
        <p className="text-muted-foreground font-light">État de santé de votre véhicule</p>
      </div>

      {/* Vehicle Card */}
      {mainVehicle ? (
        <>
          <Card className="glass-card border-border overflow-hidden">
            <div className="relative h-48">
              <img
                src={mainVehicle.images?.[0] || getDefaultImage(mainVehicle.brand)}
                alt={mainVehicle.brand + " " + mainVehicle.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-red-500/90 text-white border-0 mb-2">{mainVehicle.brand}</Badge>
                <h2 className="text-2xl font-light text-foreground">{mainVehicle.model}</h2>
                <p className="text-muted-foreground text-sm">{mainVehicle.licensePlate}</p>
              </div>
            </div>
          </Card>

          {/* Vehicle Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <Gauge className="w-6 h-6 text-red-500 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground mb-1">Kilométrage</p>
                <p className="font-medium">{mainVehicle.mileage ? mainVehicle.mileage.toLocaleString() + " km" : "N/A"}</p>
              </CardContent>
            </Card>
            <Card className="glass-card border-border">
              <CardContent className="p-4 text-center">
                <Car className="w-6 h-6 text-red-500 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-xs text-muted-foreground mb-1">Année</p>
                <p className="font-medium">{mainVehicle.year || "N/A"}</p>
              </CardContent>
            </Card>
            {mainVehicle.fuelType && (
              <Card className="glass-card border-border">
                <CardContent className="p-4 text-center">
                  <Droplet className="w-6 h-6 text-red-500 mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground mb-1">Carburant</p>
                  <p className="font-medium capitalize">{mainVehicle.fuelType}</p>
                </CardContent>
              </Card>
            )}
            {mainVehicle.transmission && (
              <Card className="glass-card border-border">
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 text-red-500 mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground mb-1">Transmission</p>
                  <p className="font-medium capitalize">{mainVehicle.transmission}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Diagnostic Status */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-xl font-light flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                État du véhicule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-green-500 font-medium mb-1">Aucune alerte</p>
                <p className="text-sm text-muted-foreground">
                  Votre véhicule ne présente aucun problème détecté. Les diagnostics avancés seront disponibles après une visite chez KitMotors.
                </p>
              </div>
              
              {mainVehicle.color && (
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">Couleur</span>
                  <span className="font-medium">{mainVehicle.color}</span>
                </div>
              )}
              {mainVehicle.vin && (
                <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                  <span className="text-muted-foreground">VIN</span>
                  <span className="font-mono text-sm">{mainVehicle.vin}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="glass-card border-border">
          <CardContent className="p-12 text-center">
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-xl font-light mb-2">Aucun véhicule</h3>
            <p className="text-muted-foreground text-sm">
              Aucun véhicule n'est associé à votre compte. Contactez KitMotors pour ajouter votre véhicule.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Diagnostics;
