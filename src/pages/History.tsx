import { Wrench, Euro, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const historyItems = [
    {
      id: 1,
      title: "Changement Plaquettes de Frein",
      date: "15 Oct 2025",
      mileage: "44,200 km",
      cost: "229 600 CFA",
      garage: "Garage Premium Auto",
      type: "Réparation",
    },
    {
      id: 2,
      title: "Vidange + Filtres",
      date: "28 Août 2025",
      mileage: "42,000 km",
      cost: "118 080 CFA",
      garage: "Mercedes-Benz Service",
      type: "Entretien",
    },
    {
      id: 3,
      title: "Contrôle Technique",
      date: "08 Mai 2025",
      mileage: "40,500 km",
      cost: "55 760 CFA",
      garage: "Dekra Contrôle Technique",
      type: "Contrôle",
    },
    {
      id: 4,
      title: "Remplacement Pneus (x4)",
      date: "20 Mars 2025",
      mileage: "39,800 km",
      cost: "472 320 CFA",
      garage: "Garage Premium Auto",
      type: "Réparation",
    },
    {
      id: 5,
      title: "Révision Complète",
      date: "05 Jan 2025",
      mileage: "38,000 km",
      cost: "295 200 CFA",
      garage: "Mercedes-Benz Service",
      type: "Entretien",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Réparation":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "Entretien":
        return "bg-info/20 text-info border-info/30";
      case "Contrôle":
        return "bg-success/20 text-success border-success/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Historique</span>
        </h1>
        <p className="text-muted-foreground font-light">Réparations et entretiens</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[23px] top-8 bottom-8 w-px bg-border" />

        <div className="space-y-6">
          {historyItems.map((item, index) => (
            <Card
              key={item.id}
              className="glass-card border-border hover-lift animate-slide-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div className="absolute left-[-23px] top-6 w-12 h-12 rounded-full bg-secondary border-4 border-background flex items-center justify-center">
                <Wrench className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              </div>

              <CardContent className="p-6 ml-8">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-light">{item.title}</h3>
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(item.type)} border font-light text-xs`}
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-light text-gold">{item.cost}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-light">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-light">{item.mileage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-light truncate">{item.garage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="glass-card border-border animate-fade-in">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-light text-gold mb-1">5</p>
              <p className="text-xs text-muted-foreground font-light">Interventions</p>
            </div>
            <div>
              <p className="text-2xl font-light text-gold mb-1">1,785 €</p>
              <p className="text-xs text-muted-foreground font-light">Total dépensé</p>
            </div>
            <div>
              <p className="text-2xl font-light text-gold mb-1">357 €</p>
              <p className="text-xs text-muted-foreground font-light">Coût moyen</p>
            </div>
            <div>
              <p className="text-2xl font-light text-gold mb-1">2 mois</p>
              <p className="text-xs text-muted-foreground font-light">Dernière visite</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
