import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePushNotifications } from "@/hooks/use-push-notifications";

const TestNotifications = () => {
  const { sendPushNotification, isNotificationEnabled, requestNotificationPermission } = usePushNotifications();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(isNotificationEnabled());

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    if (granted) {
      setMessage("✅ Notifications activées ! Vous pouvez maintenant envoyer un test.");
    } else {
      setMessage("❌ Permission refusée. Vérifiez les paramètres de notification du navigateur.");
    }
  };

  const sendTestNotification = async (type: "assurance" | "maintenance" | "diagnostic" | "alert" | "reminder") => {
    setLoading(true);

    interface NotificationConfig {
      title: string;
      body: string;
      icon: string;
      badge: string;
      tag: string;
      requireInteraction: boolean;
    }

    const notificationConfigs: Record<string, NotificationConfig> = {
      assurance: {
        title: "🛡️ Test - Renouvellement Assurance",
        body: "Ceci est une notification de test pour l'assurance. Votre assurance arrive à échéance dans 15 jours.",
        icon: "/notification-icons/shield.png",
        badge: "/notification-icons/shield.png",
        tag: `test-assurance-${Date.now()}`,
        requireInteraction: true,
      },
      maintenance: {
        title: "🔧 Test - Entretien Programmé",
        body: "Ceci est une notification de test pour la maintenance. Vidange recommandée dans 2,500 km.",
        icon: "/notification-icons/wrench.png",
        badge: "/notification-icons/wrench.png",
        tag: `test-maintenance-${Date.now()}`,
        requireInteraction: false,
      },
      diagnostic: {
        title: "✅ Test - Diagnostic Complété",
        body: "Ceci est une notification de test pour le diagnostic. Scan moteur effectué avec succès.",
        icon: "/notification-icons/check.png",
        badge: "/notification-icons/check.png",
        tag: `test-diagnostic-${Date.now()}`,
        requireInteraction: false,
      },
      alert: {
        title: "⚠️ Test - Alerte Moteur",
        body: "Ceci est une notification de test pour une alerte. Vérification recommandée du système de refroidissement.",
        icon: "/notification-icons/warning.png",
        badge: "/notification-icons/warning.png",
        tag: `test-alert-${Date.now()}`,
        requireInteraction: true,
      },
      reminder: {
        title: "📋 Test - Visite Technique",
        body: "Ceci est une notification de test pour un rappel. Votre visite technique est valide jusqu'au 08 Mai 2026.",
        icon: "/notification-icons/clipboard.png",
        badge: "/notification-icons/clipboard.png",
        tag: `test-reminder-${Date.now()}`,
        requireInteraction: false,
      },
    };

    const config = notificationConfigs[type];

    try {
      const success = await sendPushNotification({
        ...config,
        data: {
          type: type,
          testMode: "true",
          timestamp: new Date().toISOString(),
        },
      });

      if (success) {
        setMessage(`✅ Notification de test ${type} envoyée ! Vérifiez votre écran.`);
      } else {
        setMessage("⚠️ Impossible d'envoyer la notification. Vérifiez les permissions.");
      }
    } catch (error) {
      setMessage("❌ Erreur lors de l'envoi de la notification.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Test Notifications Push</span>
        </h1>
        <p className="text-muted-foreground font-light">Envoyez des notifications de test pour vérifier le système</p>
      </div>

      {/* Status Card */}
      <Card className="glass-card border-border animate-slide-in">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold" strokeWidth={1.5} />
            État des Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div>
              <p className="font-light">Notifications Push</p>
              <p className="text-sm text-muted-foreground font-light">
                {notificationEnabled
                  ? "✅ Activées et prêtes à être testées"
                  : "❌ Désactivées - Cliquez sur le bouton ci-dessous"}
              </p>
            </div>
            <Badge
              variant="outline"
              className={notificationEnabled ? "bg-success/20 text-success border-success/30" : "bg-destructive/20 text-destructive border-destructive/30"}
            >
              {notificationEnabled ? "Actif" : "Inactif"}
            </Badge>
          </div>

          {!notificationEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="w-full py-2 px-4 rounded-lg bg-gold text-white hover:bg-gold/90 transition-colors font-light flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" strokeWidth={1.5} />
              Activer les Notifications Push
            </button>
          )}

          {message && (
            <div className={`p-3 rounded-lg text-sm font-light ${
              message.startsWith("✅")
                ? "bg-success/20 text-success border border-success/30"
                : message.startsWith("⚠️")
                ? "bg-warning/20 text-warning border border-warning/30"
                : "bg-destructive/20 text-destructive border border-destructive/30"
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Buttons */}
      {notificationEnabled && (
        <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="text-xl font-light">Envoyer une Notification de Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => sendTestNotification("assurance")}
                disabled={loading}
                className="py-3 px-4 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors font-light flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="text-xl">🛡️</span>
                {loading ? "Envoi..." : "Tester Assurance"}
              </button>

              <button
                onClick={() => sendTestNotification("maintenance")}
                disabled={loading}
                className="py-3 px-4 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors font-light flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="text-xl">🔧</span>
                {loading ? "Envoi..." : "Tester Maintenance"}
              </button>

              <button
                onClick={() => sendTestNotification("diagnostic")}
                disabled={loading}
                className="py-3 px-4 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors font-light flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="text-xl">✅</span>
                {loading ? "Envoi..." : "Tester Diagnostic"}
              </button>

              <button
                onClick={() => sendTestNotification("alert")}
                disabled={loading}
                className="py-3 px-4 rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors font-light flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="text-xl">⚠️</span>
                {loading ? "Envoi..." : "Tester Alerte"}
              </button>

              <button
                onClick={() => sendTestNotification("reminder")}
                disabled={loading}
                className="py-3 px-4 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors font-light flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="text-xl">📋</span>
                {loading ? "Envoi..." : "Tester Rappel"}
              </button>

              <button
                onClick={() => {
                  setMessage("Testez chaque type de notification en cliquant sur les boutons ci-dessus!");
                }}
                disabled={loading}
                className="py-3 px-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-light flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                {loading ? "Envoi..." : "Réinitialiser"}
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light">📖 Instructions de Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm font-light">
          <div>
            <h3 className="font-semibold mb-2">1️⃣ Activez les notifications</h3>
            <p className="text-muted-foreground">
              Cliquez sur "Activer les Notifications Push" pour autoriser les notifications du navigateur.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2️⃣ Envoyez un test</h3>
            <p className="text-muted-foreground">
              Cliquez sur l'un des boutons de test pour envoyer une notification push correspondant au type.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3️⃣ Vérifiez la notification</h3>
            <p className="text-muted-foreground">
              Une notification devrait apparaître sur votre écran. Elle s'affichera même si vous minimisez l'app.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4️⃣ Testez en arrière-plan</h3>
            <p className="text-muted-foreground">
              Fermez cette page (pas l'app) et attendez quelques secondes. La notification devrait quand même s'afficher.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-gold/10 border border-gold/30 text-gold">
            💡 <span className="font-semibold">Conseil :</span> Sur certains navigateurs (Chrome), les notifications
            s'affichent en bas à droite de l'écran.
          </div>
        </CardContent>
      </Card>

      {/* Technical Info */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light">🔧 Informations Techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs font-light text-muted-foreground">
          <div className="p-3 rounded bg-secondary/30 font-mono">
            <p>Service Worker: {navigator.serviceWorker ? "✅ Enregistré" : "❌ Non disponible"}</p>
            <p>Notifications API: {typeof Notification !== "undefined" ? "✅ Supportée" : "❌ Non supportée"}</p>
            <p>Permission actuelle: {Notification?.permission || "N/A"}</p>
            <p>HTTPS/Localhost: {window.location.protocol === "https:" || window.location.hostname === "localhost" ? "✅ Oui" : "❌ Non"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestNotifications;
