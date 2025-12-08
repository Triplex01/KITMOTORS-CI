import { Shield, Wrench, Gauge, Activity, AlertTriangle, Clock, Download, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useVehicleNotifications } from "@/hooks/use-vehicle-notifications";

const Notifications = () => {
  const [showInsuranceDoc, setShowInsuranceDoc] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useVehicleNotifications();

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

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Notifications</span>
        </h1>
        <p className="text-muted-foreground font-light">Suivi intelligent de votre véhicule</p>
      </div>

      {/* Insurance Document Section */}
      <Card className="glass-card border-border animate-slide-in">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" strokeWidth={1.5} />
            Document d'Assurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-light">Assurance Actuelle</p>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="font-light text-lg mb-1">Mercedes-Benz Assurance</p>
                <p className="text-sm text-muted-foreground font-light">Contrat N°: AB-2024-123456</p>
                <p className="text-sm text-muted-foreground font-light">Validité: 15 Dec 2025</p>
                <Badge className="mt-3 bg-destructive/20 text-destructive border-destructive/30" variant="outline">
                  À renouveler dans 15 jours
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-light">Actions</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowInsuranceDoc(!showInsuranceDoc)}
                  className="py-2 px-4 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors font-light flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  {showInsuranceDoc ? "Masquer" : "Consulter"} le PDF
                </button>
                <a
                  href="/insurance-sample.pdf"
                  download
                  className="py-2 px-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-light flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le PDF
                </a>
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          {showInsuranceDoc && (
            <div className="mt-6 animate-slide-in">
              <div className="rounded-lg overflow-hidden bg-card/50 border border-border">
                <div className="bg-secondary/50 p-4 flex items-center justify-between">
                  <p className="text-sm font-light">Assurance - Mercedes-Benz (AB-2024-123456)</p>
                  <button
                    onClick={() => setShowInsuranceDoc(false)}
                    className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕ Fermer
                  </button>
                </div>
                <div className="bg-muted/20 p-6 min-h-96 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary/50 flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                      <p className="font-light text-lg mb-2">Document d'Assurance</p>
                      <p className="text-sm text-muted-foreground font-light mb-4">
                        Contrat: AB-2024-123456
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground font-light mb-6">
                        <p>Assureur: Mercedes-Benz Assurance</p>
                        <p>Type: Assurance Automobile Tous Risques</p>
                        <p>Validité: 15 décembre 2025</p>
                        <p>Bonus/Malus: -15%</p>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground font-light">
                          📄 Pour visualiser le PDF complet, téléchargez le document
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-light">
            Notifications en temps réel
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-gold/20 text-gold border-gold/30">{unreadCount} non lue(s)</Badge>
            )}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-gold hover:text-gold/80 transition-colors font-light"
          >
            Marquer tout comme lue
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            const urgencyConfig = getUrgencyConfig(notification.urgency);

            return (
              <Card
                key={notification.id}
                className={`glass-card border-border hover-lift animate-slide-in ${urgencyConfig.glow} ${
                  !notification.read ? "border-gold/30" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center flex-shrink-0 relative text-2xl">
                      {notification.icon}
                      {!notification.read && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-gold rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
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

                      {/* Message */}
                      <p className="text-sm text-muted-foreground font-light mb-3">
                        {notification.message}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-4 h-4" strokeWidth={1.5} />
                          <span className="font-light">{formatTime(notification.timestamp)}</span>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-gold hover:text-gold/80 transition-colors font-light"
                            >
                              Marquer comme lue
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="glass-card border-border">
            <CardContent className="p-12 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-xl bg-secondary/30 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <p className="text-muted-foreground font-light">Aucune notification pour le moment</p>
                <p className="text-xs text-muted-foreground">Les alertes s'afficheront ici en temps réel</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
