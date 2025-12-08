import { Car, Calendar, Fuel, Gauge, Settings as SettingsIcon, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const VehicleDetails = () => {
  const vehicleSpecs = [
    { label: "Marque", value: "Mercedes-Benz", icon: Car },
    { label: "Modèle", value: "GLE 350d 4MATIC", icon: Car },
    { label: "Année", value: "2022", icon: Calendar },
    { label: "Carburant", value: "Diesel", icon: Fuel },
    { label: "Moteur", value: "2.0L Turbo", icon: SettingsIcon },
    { label: "Puissance", value: "272 ch", icon: Gauge },
  ];

  const maintenanceSchedule = [
    { service: "Vidange", next: "50,000 km", progress: 90 },
    { service: "Filtre à Air", next: "55,000 km", progress: 82 },
    { service: "Plaquettes", next: "60,000 km", progress: 75 },
    { service: "Courroie", next: "120,000 km", progress: 38 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Caracteristiques de votre Véhicule</span>
        </h1>
        <p className="text-muted-foreground font-light">Informations complètes</p>
      </div>

      {/* Vehicle Hero */}
      <Card className="glass-card border-border overflow-hidden">
        <div className="relative h-64">
          <img
            src="http://services.kitmotors-ci.com/wp-content/uploads/2024/05/12-1-1.jpg"
            alt="UNI-T"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Badge variant="outline" className="bg-card/80 backdrop-blur border-border px-3 py-1 mb-2">
              AB-123-CD
            </Badge>
            <h2 className="text-2xl font-light">UNI-T</h2>
          </div>
        </div>
      </Card>

      {/* Specifications */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" strokeWidth={1.5} />
            Spécifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicleSpecs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="p-4 rounded-lg bg-secondary/30">
                  <Icon className="w-5 h-5 text-gold mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground font-light mb-1">{spec.label}</p>
                  <p className="font-light">{spec.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mileage */}
      <Card className="glass-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-light mb-1">Kilométrage Actuel</p>
              <p className="text-3xl font-light text-gradient">45,230 km</p>
            </div>
            <Gauge className="w-12 h-12 text-gold" strokeWidth={1} />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-gold" strokeWidth={1.5} />
            Entretiens Programmés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenanceSchedule.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-light">{item.service}</p>
                <span className="text-sm text-muted-foreground font-light">{item.next}</span>
              </div>
              <Progress value={item.progress} className="h-2 [&>div]:bg-gold" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* VIN */}
      <Card className="glass-card border-border">
        <CardContent className="p-6">
          <p className="text-xs text-muted-foreground font-light mb-1">Numéro VIN</p>
          <p className="font-mono text-sm">WDB1670331N123456</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDetails;
