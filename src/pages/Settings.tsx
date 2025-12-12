import { User, Bell, Car, Mail, Lock, Moon, Sun, TestTube, Phone, Shield, Smartphone, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useState } from "react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { isNotificationEnabled, requestNotificationPermission } = usePushNotifications();
  const [pushEnabled, setPushEnabled] = useState(isNotificationEnabled());

  const handlePushNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      setPushEnabled(granted);
    } else {
      setPushEnabled(false);
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Paramètres</span>
        </h1>
        <p className="text-muted-foreground font-light">Personnalisez votre expérience</p>
      </div>

      {/* Profile Section */}
      <Card className="glass-card border-border animate-slide-in">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <User className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full premium-gradient flex items-center justify-center text-2xl">
              JD
            </div>
            <div>
              <p className="font-light text-lg">Jean Dupont</p>
              <p className="text-sm text-muted-foreground font-light">jean.dupont@email.com</p>
            </div>
          </div>
          <button className="w-full py-2 px-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors font-light">
            Modifier le Profil
          </button>
        </CardContent>
      </Card>

      {/* Vehicles Section */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "100ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Car className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Véhicules Enregistrés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div>
              <p className="font-light">Mercedes-Benz GLE 350d</p>
              <p className="text-sm text-muted-foreground font-light">AB-123-CD</p>
            </div>
            <Badge variant="outline" className="bg-success/20 text-success border-success/30">
              Actif
            </Badge>
          </div>
          <button className="w-full py-2 px-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors font-light">
            + Ajouter un Véhicule
          </button>
        </CardContent>
      </Card>

      {/* Notifications Settings */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "200ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-light">Email</p>
                <p className="text-xs text-muted-foreground font-light">Recevoir par email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-light">Notifications Push</p>
                <p className="text-xs text-muted-foreground font-light">
                  {pushEnabled 
                    ? "Actives - Alertes en temps réel" 
                    : "Inactives - Cliquez pour activer"}
                </p>
              </div>
            </div>
            <Switch 
              checked={pushEnabled} 
              onCheckedChange={handlePushNotificationToggle}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-light">SMS</p>
                <p className="text-xs text-muted-foreground font-light">Alertes par SMS</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            ) : (
              <Sun className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            )}
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
                </div>
              )}
              <div>
                <p className="font-light">Mode {theme === "dark" ? "Sombre" : "Clair"}</p>
                <p className="text-xs text-muted-foreground font-light">
                  {theme === "dark" ? "Thème sombre activé" : "Thème clair activé"}
                </p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "400ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="font-light">Mot de Passe</p>
                <p className="text-xs text-muted-foreground font-light">Modifier votre mot de passe</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="font-light">Double Authentification</p>
                <p className="text-xs text-muted-foreground font-light">Sécurité renforcée 2FA</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card className="glass-card border-border animate-slide-in" style={{ animationDelay: "500ms" }}>
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <TestTube className="w-5 h-5 text-red-500" strokeWidth={1.5} />
            Tester les Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground font-light mb-3">
            Testez le système de notifications push en envoyant des notifications de démonstration.
          </p>
          <Link
            to="/test-notifications"
            className="w-full py-3 px-4 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors font-light text-center flex items-center justify-center gap-2"
          >
            <TestTube className="w-4 h-4" strokeWidth={1.5} />
            Accéder à la Page de Test
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
