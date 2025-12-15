import { Car, Calendar, Fuel, Gauge, Settings as SettingsIcon, FileText, ArrowLeft, Loader2, AlertCircle, Shield, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Vehicle } from "@/lib/firestore";

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadVehicle = async () => {
      if (!id) {
        setError("ID du véhicule manquant");
        setLoading(false);
        return;
      }

      try {
        const vehicleDoc = await getDoc(doc(db, "vehicles", id));
        if (vehicleDoc.exists()) {
          setVehicle({ id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle);
        } else {
          setError("Véhicule non trouvé");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement du véhicule");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-3 text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="text-xl text-muted-foreground">{error || "Véhicule non trouvé"}</p>
        <button 
          onClick={() => navigate("/settings")}
          className="flex items-center gap-2 text-red-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux paramètres
        </button>
      </div>
    );
  }

  const vehicleSpecs = [
    { label: "Marque", value: vehicle.brand, icon: Car },
    { label: "Modèle", value: vehicle.model, icon: Car },
    { label: "Année", value: vehicle.year?.toString() || "N/A", icon: Calendar },
    { label: "Couleur", value: vehicle.color || "N/A", icon: Fuel },
    { label: "Kilométrage", value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "N/A", icon: Gauge },
    { label: "Plaque", value: vehicle.licensePlate, icon: CreditCard },
  ];

  const maintenanceSchedule = [
    { service: "Vidange", next: "50,000 km", progress: 90 },
    { service: "Filtre à Air", next: "55,000 km", progress: 82 },
    { service: "Plaquettes", next: "60,000 km", progress: 75 },
    { service: "Courroie", next: "120,000 km", progress: 38 },
  ];

  // Image par défaut selon la marque ou images téléchargées
  const getVehicleImage = () => {
    // Si le véhicule a des images téléchargées, utiliser la première
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    
    // Sinon, image par défaut selon la marque
    const brandImages: Record<string, string> = {
      "MG": "https://mgmotor.co.in/images/mg-hs-exclusive-exterior-1.jpg",
      "MG MOTORS": "https://mgmotor.co.in/images/mg-hs-exclusive-exterior-1.jpg",
      "CHANGAN": "http://services.kitmotors-ci.com/wp-content/uploads/2024/05/12-1-1.jpg",
      "SOUEAST": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/2018_Soueast_DX7_Prime.jpg/1200px-2018_Soueast_DX7_Prime.jpg",
      "JETOUR": "https://jetour.com.eg/images/x70-plus-exterior.jpg",
    };
    return brandImages[vehicle.brand.toUpperCase()] || "http://services.kitmotors-ci.com/wp-content/uploads/2024/05/12-1-1.jpg";
  };

  const vehicleImages = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [getVehicleImage()];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/settings")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">{vehicle.brand} {vehicle.model}</span>
        </h1>
        <p className="text-muted-foreground font-light">Informations complètes de votre véhicule</p>
      </div>

      {/* Vehicle Hero */}
      <Card className="glass-card border-border overflow-hidden">
        <div className="relative h-64">
          <img
            src={vehicleImages[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          {/* Image Navigation */}
          {vehicleImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
              {vehicleImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-red-500 w-4' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
          
          <div className="absolute bottom-6 left-6">
            <Badge variant="outline" className="bg-card/80 backdrop-blur border-border px-3 py-1 mb-2">
              {vehicle.licensePlate}
            </Badge>
            <h2 className="text-2xl font-light">{vehicle.brand} {vehicle.model}</h2>
            <Badge 
              className={
                vehicle.status === 'active' 
                  ? "bg-green-500/20 text-green-500 border-green-500/30 mt-2"
                  : vehicle.status === 'pending'
                  ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 mt-2"
                  : "bg-gray-500/20 text-gray-500 border-gray-500/30 mt-2"
              }
            >
              {vehicle.status === 'active' ? 'Actif' : vehicle.status === 'pending' ? 'En attente de validation' : 'Inactif'}
            </Badge>
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        {vehicleImages.length > 1 && (
          <div className="p-4 flex gap-2 overflow-x-auto">
            {vehicleImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-red-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Specifications */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Spécifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicleSpecs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="p-4 rounded-lg bg-secondary/30">
                  <Icon className="w-5 h-5 text-red-500 mb-2" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground font-light mb-1">{spec.label}</p>
                  <p className="font-light">{spec.value}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      {vehicle.documents && (
        <Card className="glass-card border-border">
          <CardHeader>
            <CardTitle className="text-xl font-light flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle.documents.insurance && (
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">Assurance</p>
                <p className="font-light">{vehicle.documents.insurance.company}</p>
                <p className="text-sm text-muted-foreground">N° {vehicle.documents.insurance.number}</p>
                <p className="text-sm text-muted-foreground">Expire: {vehicle.documents.insurance.expiry}</p>
              </div>
            )}
            {vehicle.documents.registration && (
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">Carte Grise</p>
                <p className="font-light">N° {vehicle.documents.registration.number}</p>
                <p className="text-sm text-muted-foreground">Expire: {vehicle.documents.registration.expiry}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mileage */}
      <Card className="glass-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-light mb-1">Kilométrage Actuel</p>
              <p className="text-3xl font-light text-gradient">
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : "Non renseigné"}
              </p>
            </div>
            <Gauge className="w-12 h-12 text-red-500" strokeWidth={1} />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-red-500" strokeWidth={1.5} />
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
              <Progress value={item.progress} className="h-2 [&>div]:bg-red-500" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* VIN */}
      {vehicle.vin && (
        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-light mb-1">Numéro VIN</p>
            <p className="font-mono text-sm">{vehicle.vin}</p>
          </CardContent>
        </Card>
      )}

      {/* Concessionnaire */}
      {vehicle.dealerName && (
        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground font-light mb-1">Concessionnaire</p>
            <p className="font-light">{vehicle.dealerName}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleDetails;
