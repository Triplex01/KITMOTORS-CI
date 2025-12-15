import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, ChevronLeft, ChevronRight, Search, Filter, Plus, FileText, Shield, Calendar, CheckCircle, Upload, X, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEALERS, DealerVehicle, Dealer } from "@/data/dealerCatalog";
import { createVehicle } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

// Fonction pour convertir une image en Base64 (compressée)
const convertToBase64 = (file: File, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Redimensionner si trop grand
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compression JPEG à 70% de qualité
        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AddVehicle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<DealerVehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  
  // Formulaire des documents
  const [vehicleData, setVehicleData] = useState({
    licensePlate: "",
    vin: "",
    color: "",
    mileage: "",
    purchaseDate: "",
    insuranceCompany: "",
    insuranceNumber: "",
    insuranceExpiry: "",
    registrationNumber: "",
    registrationExpiry: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Gestion des images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (vehicleImages.length + files.length > 5) {
      setError("Maximum 5 images autorisées");
      return;
    }
    setVehicleImages(prev => [...prev, ...files]);
    setError("");
  };

  const removeImage = (index: number) => {
    setVehicleImages(prev => prev.filter((_, i) => i !== index));
  };

  // Filtrer les véhicules
  const getFilteredVehicles = () => {
    if (!selectedDealer) return [];
    return selectedDealer.vehicles.filter(v => {
      const matchSearch = v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === "all" || v.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  };

  const categories = ["all", "SUV", "Berline", "Crossover", "Pick-up", "Compact"];

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("Vous devez être connecté");
      return;
    }

    if (!vehicleData.licensePlate) {
      setError("L'immatriculation est obligatoire");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      // Convertir les images en Base64 (stockées directement dans Firestore)
      const imageBase64: string[] = [];
      if (vehicleImages.length > 0) {
        try {
          for (const file of vehicleImages) {
            const base64 = await convertToBase64(file, 800); // Max 800px de largeur
            imageBase64.push(base64);
          }
          console.log('Images converties en Base64:', imageBase64.length);
        } catch (uploadError) {
          console.warn('Erreur conversion images (non bloquant):', uploadError);
        }
      }
      
      // Créer le véhicule dans Firestore
      await createVehicle({
        userId: user.id,
        brand: selectedVehicle?.brand || '',
        model: selectedVehicle?.model || '',
        year: selectedVehicle?.year || new Date().getFullYear(),
        licensePlate: vehicleData.licensePlate.toUpperCase(),
        vin: vehicleData.vin,
        color: vehicleData.color,
        mileage: parseInt(vehicleData.mileage) || 0,
        images: imageBase64,
        status: 'active',
        dealerId: selectedDealer?.id,
        dealerName: selectedDealer?.name,
        documents: {
          insurance: {
            company: vehicleData.insuranceCompany,
            number: vehicleData.insuranceNumber,
            expiry: vehicleData.insuranceExpiry
          },
          registration: {
            number: vehicleData.registrationNumber,
            expiry: vehicleData.registrationExpiry
          }
        },
        purchaseDate: vehicleData.purchaseDate,
        notes: vehicleData.notes
      });

      console.log('Véhicule enregistré avec succès');
      setSubmitted(true);
    } catch (err: any) {
      console.error('Erreur création véhicule:', err);
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="glass-card max-w-md w-full text-center p-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Véhicule Enregistré !</h2>
          <p className="text-muted-foreground mb-6">
            Votre {selectedVehicle?.brand} {selectedVehicle?.model} a été enregistré avec succès. 
            Notre équipe va vérifier vos documents et vous contacter rapidement.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/settings')}
              className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
            >
              Retour aux Paramètres
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setSelectedDealer(null);
                setSelectedVehicle(null);
                setVehicleImages([]);
                setError("");
                setVehicleData({
                  licensePlate: "", vin: "", color: "", mileage: "", purchaseDate: "",
                  insuranceCompany: "", insuranceNumber: "", insuranceExpiry: "",
                  registrationNumber: "", registrationExpiry: "", notes: ""
                });
              }}
              className="w-full py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
            >
              Ajouter un autre véhicule
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : navigate('/settings')}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-gradient">Ajouter un Véhicule</span>
          </h1>
          <p className="text-muted-foreground text-sm">Étape {step} sur 3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-red-500' : 'bg-secondary'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Choisir le concessionnaire */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Choisissez votre concessionnaire</h2>
          <p className="text-muted-foreground mb-6">
            Sélectionnez la marque de votre véhicule parmi nos partenaires
          </p>
          
          <div className="grid gap-4">
            {DEALERS.map((dealer) => (
              <Card 
                key={dealer.id}
                onClick={() => { setSelectedDealer(dealer); setStep(2); }}
                className={`glass-card cursor-pointer transition-all hover:border-red-500/50 ${
                  selectedDealer?.id === dealer.id ? 'border-red-500' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl">
                      {dealer.logo}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{dealer.name}</h3>
                      <p className="text-sm text-muted-foreground">{dealer.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {dealer.vehicles.length} modèles
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {dealer.country}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Choisir le véhicule */}
      {step === 2 && selectedDealer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Véhicules {selectedDealer.name}</h2>
              <p className="text-muted-foreground text-sm">{selectedDealer.vehicles.length} modèles disponibles</p>
            </div>
            <div className="text-3xl">{selectedDealer.logo}</div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-red-500 text-white' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {cat === 'all' ? 'Tous' : cat}
              </button>
            ))}
          </div>

          {/* Vehicle Grid */}
          <div className="grid gap-4">
            {getFilteredVehicles().map((vehicle) => (
              <Card 
                key={vehicle.id}
                onClick={() => { setSelectedVehicle(vehicle); setStep(3); }}
                className={`glass-card cursor-pointer transition-all hover:border-red-500/50 overflow-hidden ${
                  selectedVehicle?.id === vehicle.id ? 'border-red-500' : ''
                }`}
              >
                <div className="flex">
                  <div className="w-32 h-32 bg-secondary flex-shrink-0">
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.model}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400';
                      }}
                    />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{vehicle.brand} {vehicle.model}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{vehicle.category}</Badge>
                      </div>
                      <span className="text-red-500 font-bold text-sm">{vehicle.price}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                      <span>🔧 {vehicle.specs.engine}</span>
                      <span>⚡ {vehicle.specs.power}</span>
                      <span>🔄 {vehicle.specs.transmission}</span>
                      <span>⛽ {vehicle.specs.fuel}</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Documents et informations */}
      {step === 3 && selectedVehicle && (
        <div className="space-y-6">
          {/* Véhicule sélectionné */}
          <Card className="glass-card overflow-hidden">
            <div className="flex">
              <div className="w-24 h-24 bg-secondary flex-shrink-0">
                <img 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</h3>
                <p className="text-sm text-muted-foreground">{selectedVehicle.year} • {selectedVehicle.category}</p>
                <Badge className="mt-2 bg-red-500">{selectedDealer?.name}</Badge>
              </CardContent>
            </div>
          </Card>

          <h2 className="text-xl font-semibold">Informations du véhicule</h2>

          {/* Informations de base */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-red-500" />
                Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Immatriculation *</label>
                  <input
                    type="text"
                    placeholder="AB-123-CD"
                    value={vehicleData.licensePlate}
                    onChange={(e) => setVehicleData({...vehicleData, licensePlate: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">N° Châssis (VIN)</label>
                  <input
                    type="text"
                    placeholder="WVWZZZ3CZWE123456"
                    value={vehicleData.vin}
                    onChange={(e) => setVehicleData({...vehicleData, vin: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Couleur</label>
                  <input
                    type="text"
                    placeholder="Noir métallisé"
                    value={vehicleData.color}
                    onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kilométrage</label>
                  <input
                    type="number"
                    placeholder="15000"
                    value={vehicleData.mileage}
                    onChange={(e) => setVehicleData({...vehicleData, mileage: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date d'achat</label>
                <input
                  type="date"
                  value={vehicleData.purchaseDate}
                  onChange={(e) => setVehicleData({...vehicleData, purchaseDate: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Assurance */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Assurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Compagnie d'assurance *</label>
                <select
                  value={vehicleData.insuranceCompany}
                  onChange={(e) => setVehicleData({...vehicleData, insuranceCompany: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Sélectionner une compagnie</option>
                  <option value="AXA">AXA Assurances</option>
                  <option value="Allianz">Allianz</option>
                  <option value="NSIA">NSIA Assurances</option>
                  <option value="SUNU">SUNU Assurances</option>
                  <option value="Saham">Saham Assurance</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">N° de police</label>
                  <input
                    type="text"
                    placeholder="POL-2024-XXXXX"
                    value={vehicleData.insuranceNumber}
                    onChange={(e) => setVehicleData({...vehicleData, insuranceNumber: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date d'expiration *</label>
                  <input
                    type="date"
                    value={vehicleData.insuranceExpiry}
                    onChange={(e) => setVehicleData({...vehicleData, insuranceExpiry: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte Grise */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                Carte Grise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">N° d'immatriculation</label>
                  <input
                    type="text"
                    placeholder="Numéro carte grise"
                    value={vehicleData.registrationNumber}
                    onChange={(e) => setVehicleData({...vehicleData, registrationNumber: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date de validité</label>
                  <input
                    type="date"
                    value={vehicleData.registrationExpiry}
                    onChange={(e) => setVehicleData({...vehicleData, registrationExpiry: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Notes supplémentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Informations complémentaires sur votre véhicule..."
                value={vehicleData.notes}
                onChange={(e) => setVehicleData({...vehicleData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </CardContent>
          </Card>

          {/* Photos du véhicule */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="w-5 h-5 text-red-500" />
                Photos du véhicule (optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ajoutez jusqu'à 5 photos de votre véhicule (extérieur, intérieur, compteur...)
              </p>
              
              {/* Images Preview */}
              {vehicleImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {vehicleImages.map((file, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-secondary">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              {vehicleImages.length < 5 && (
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-red-500/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Cliquez pour ajouter des photos
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {vehicleImages.length}/5 photos
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!vehicleData.licensePlate || !vehicleData.insuranceCompany || !vehicleData.insuranceExpiry || isSubmitting}
            className="w-full py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enregistrement en cours...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Enregistrer mon véhicule
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddVehicle;
