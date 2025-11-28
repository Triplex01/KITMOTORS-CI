import { Shield, Wrench, Gauge, Activity, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "Assurance",
      icon: Shield,
      title: "Renouvellement Assurance",
      description: "Votre assurance arrive à échéance dans 15 jours",
      date: "15 Dec 2025",
      urgency: "high",
      action: "Renouveler maintenant",
    },
    {
      id: 2,
      type: "Visite Technique",
      icon: Wrench,
      title: "Contrôle Technique",
      description: "Votre véhicule est à jour jusqu'au 08 Mai 2026",
      date: "08 Mai 2026",
      urgency: "low",
      action: "Voir détails",
    },
    {
      id: 3,
      type: "Vidange",
      icon: Gauge,
      title: "Prochaine Vidange",
      description: "Vidange recommandée dans 2,500 km",
      date: "À 50,000 km",
      urgency: "medium",
      action: "Programmer",
    },
    {
      id: 4,
      type: "Diagnostic",
      icon: Activity,
      title: "Scan Moteur",
      description: "Dernier diagnostic effectué - Aucun problème détecté",
      date: "22 Nov 2025",
      urgency: "low",
      action: "Voir rapport",
    },
    {
      id: 5,
      type: "Réparation",
      icon: AlertTriangle,
      title: "Plaquettes de Frein",
      description: "Remplacement recommandé dans 3 mois",
      date: "Prévu Fév 2026",
      urgency: "medium",
      action: "Prendre RDV",
    },
  ];

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case "high":
        return {
          badge: "bg-destructive/20 text-destructive border-destructive/30",
          label: "Urgent",
          glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        };
      case "medium":
        return {
          badge: "bg-warning/20 text-warning border-warning/30",
          label: "Attention",
          glow: "shadow-[0_0_20px_rgba(251,191,36,0.2)]",
        };
      case "low":
        return {
          badge: "bg-success/20 text-success border-success/30",
          label: "OK",
          glow: "",
        };
      default:
        return {
          badge: "bg-muted/20 text-muted-foreground border-muted/30",
          label: "Info",
          glow: "",
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Notifications</span>
        </h1>
        <p className="text-muted-foreground font-light">Suivi intelligent de votre véhicule</p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification, index) => {
          const Icon = notification.icon;
          const urgencyConfig = getUrgencyConfig(notification.urgency);

          return (
            <Card
              key={notification.id}
              className={`glass-card border-border hover-lift animate-slide-in ${urgencyConfig.glow}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <Badge
                          variant="outline"
                          className="mb-2 text-xs font-light bg-card/50"
                        >
                          {notification.type}
                        </Badge>
                        <h3 className="text-lg font-light">{notification.title}</h3>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${urgencyConfig.badge} border font-light px-3 py-1 flex-shrink-0`}
                      >
                        {urgencyConfig.label}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground font-light mb-3">
                      {notification.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-4 h-4" strokeWidth={1.5} />
                        <span className="font-light">{notification.date}</span>
                      </div>
                      <button className="text-sm text-primary hover:text-primary/80 transition-colors font-light">
                        {notification.action} →
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
