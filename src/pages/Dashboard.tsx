import { Shield, Wrench, Gauge, AlertTriangle, Clock, ChevronRight, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const vehicleInfo = {
    model: "UNI-T",
    plate: "AB-123-CD",
    imageUrl: "http://services.kitmotors-ci.com/wp-content/uploads/2024/05/12-1-1.jpg",
    mileage: "45,230 km",
  };

  const statusCards = [
    {
      title: "Assurance",
      icon: Shield,
      status: "Expire dans 15 jours",
      urgency: "warning",
      date: "15 Dec 2025",
      link: "/notifications",
    },
    {
      title: "Visite Technique",
      icon: Wrench,
      status: "À jour",
      urgency: "success",
      date: "Valid jusqu'au 08 Mai 2026",
      link: "/notifications",
    },
    {
      title: "Prochaine Vidange",
      icon: Gauge,
      status: "Dans 2,500 km",
      urgency: "info",
      date: "Prévu à 50,000 km",
      link: "/diagnostics",
    },
    {
      title: "Diagnostic Moteur",
      icon: AlertTriangle,
      status: "Aucune alerte",
      urgency: "success",
      date: "Scan: 22 Nov 2025",
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Vehicle Card */}
      <Card className="glass-card border-border overflow-hidden hover-lift group">
        <div className="relative h-64 overflow-hidden">
          <img
            src={vehicleInfo.imageUrl}
            alt={vehicleInfo.model}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl font-light mb-2 text-foreground">{vehicleInfo.model}</h2>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-card/80 backdrop-blur border-border px-3 py-1">
                {vehicleInfo.plate}
              </Badge>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-light">{vehicleInfo.mileage}</span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <Link
            to="/vehicle"
            className="flex items-center justify-between group/link"
          >
            <span className="text-sm text-muted-foreground font-light">Caracteristiques de votre Véhicule</span>
            <ChevronRight className="w-4 h-4 text-gold transition-transform group-hover/link:translate-x-1" strokeWidth={1.5} />
          </Link>
        </CardContent>
      </Card>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="glass-card border-border hover-lift group h-full animate-slide-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                      <Icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getUrgencyColor(card.urgency)} border font-light px-3 py-1`}
                    >
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

      {/* Quick Actions */}
      <Card className="glass-card border-border animate-fade-in">
        <CardContent className="p-6">
          <h3 className="text-lg font-light mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/history"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <Clock className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Historique</span>
            </Link>
            <Link
              to="/diagnostics"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <AlertTriangle className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Scanner</span>
            </Link>
            <Link
              to="/notifications"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <Shield className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Assurance</span>
            </Link>
            <Link
              to="/settings"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <Wrench className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="text-xs font-light text-center">Paramètres</span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Activity Report Section */}
      <Card className="glass-card border-border animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" strokeWidth={1.5} />
            Rapports d'Activités
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Card 1: Monthly Activity */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-light text-lg">Rapport Mensuel</p>
                  <p className="text-xs text-muted-foreground font-light">Novembre 2025</p>
                </div>
                <FileText className="w-5 h-5 text-gold/50" />
              </div>
              <p className="text-sm text-muted-foreground font-light mb-3">
                Résumé complet des activités, entretiens et diagnostics du mois
              </p>
              <a
                href="/reports/activity-report-nov-2025.pdf"
                download
                className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors font-light"
              >
                <Download className="w-4 h-4" />
                Télécharger en PDF
              </a>
            </div>

            {/* Report Card 2: Annual Activity */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-light text-lg">Rapport Annuel</p>
                  <p className="text-xs text-muted-foreground font-light">Année 2025</p>
                </div>
                <FileText className="w-5 h-5 text-gold/50" />
              </div>
              <p className="text-sm text-muted-foreground font-light mb-3">
                Vue d'ensemble annuelle complète avec statistiques et tendances
              </p>
              <a
                href="/reports/activity-report-annual-2025.pdf"
                download
                className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors font-light"
              >
                <Download className="w-4 h-4" />
                Télécharger en PDF
              </a>
            </div>

            {/* Report Card 3: Maintenance Schedule */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-light text-lg">Calendrier d'Entretien</p>
                  <p className="text-xs text-muted-foreground font-light">Prévisions 2026</p>
                </div>
                <FileText className="w-5 h-5 text-gold/50" />
              </div>
              <p className="text-sm text-muted-foreground font-light mb-3">
                Planning des entretiens programmés et recommandations
              </p>
              <a
                href="/reports/maintenance-schedule-2026.pdf"
                download
                className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors font-light"
              >
                <Download className="w-4 h-4" />
                Télécharger en PDF
              </a>
            </div>

            {/* Report Card 4: Expenses Summary */}
            <div className="p-4 rounded-lg bg-secondary/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-light text-lg">Résumé des Dépenses</p>
                  <p className="text-xs text-muted-foreground font-light">Année 2025</p>
                </div>
                <FileText className="w-5 h-5 text-gold/50" />
              </div>
              <p className="text-sm text-muted-foreground font-light mb-3">
                Analyse détaillée des coûts d'entretien et réparations
              </p>
              <a
                href="/reports/expenses-summary-2025.pdf"
                download
                className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors font-light"
              >
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
