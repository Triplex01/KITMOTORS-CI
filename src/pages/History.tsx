import { Wrench, Calendar, Car, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getVehiclesByUser, Vehicle } from "@/lib/firestore";

const History = () => {
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Historique</span>
        </h1>
        <p className="text-muted-foreground font-light">
          Réparations et entretiens de votre véhicule
        </p>
      </div>

      {/* Vehicle Summary */}
      {mainVehicle && (
        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center">
                <Car className="w-8 h-8 text-red-500" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-light">{mainVehicle.brand} {mainVehicle.model}</h3>
                <p className="text-muted-foreground text-sm">{mainVehicle.licensePlate}</p>
                {mainVehicle.purchaseDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Acquis le {new Date(mainVehicle.purchaseDate).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Content */}
      <Card className="glass-card border-border">
        <CardContent className="p-8 text-center">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
          <h3 className="text-xl font-light mb-2">Historique d'entretien</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            L'historique des entretiens et réparations de votre véhicule sera affiché ici. 
            Les interventions effectuées par KitMotors seront automatiquement ajoutées.
          </p>
          
          {mainVehicle && (
            <div className="mt-6 p-4 rounded-lg bg-secondary/30 max-w-sm mx-auto">
              <p className="text-xs text-muted-foreground mb-2">Informations du véhicule</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marque:</span>
                  <span>{mainVehicle.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modèle:</span>
                  <span>{mainVehicle.model}</span>
                </div>
                {mainVehicle.mileage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kilométrage:</span>
                    <span>{mainVehicle.mileage.toLocaleString()} km</span>
                  </div>
                )}
                {mainVehicle.year && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Année:</span>
                    <span>{mainVehicle.year}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
