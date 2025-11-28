import { Activity, Battery, Droplet, Disc, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Diagnostics = () => {
  const systemStatus = [
    {
      name: "Moteur",
      icon: Activity,
      level: 95,
      status: "Excellent",
      color: "success",
    },
    {
      name: "Batterie",
      icon: Battery,
      level: 88,
      status: "Bon",
      color: "success",
    },
    {
      name: "Huile Moteur",
      icon: Droplet,
      level: 72,
      status: "Acceptable",
      color: "warning",
    },
    {
      name: "Freins",
      icon: Disc,
      level: 65,
      status: "À surveiller",
      color: "warning",
    },
  ];

  const diagnosticCodes = [
    {
      code: "P0000",
      description: "Aucun code d'erreur détecté",
      severity: "success",
    },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getProgressColor = (color: string) => {
    switch (color) {
      case "success":
        return "[&>div]:bg-success";
      case "warning":
        return "[&>div]:bg-warning";
      case "error":
        return "[&>div]:bg-destructive";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">
          <span className="text-gradient">Diagnostics</span>
        </h1>
        <p className="text-muted-foreground font-light">État détaillé des systèmes</p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systemStatus.map((system, index) => {
          const Icon = system.icon;
          return (
            <Card
              key={system.name}
              className="glass-card border-border hover-lift animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${getColorClass(system.color)}`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-light">{system.name}</h3>
                      <p className="text-xs text-muted-foreground font-light">{system.status}</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-light ${getColorClass(system.color)}`}>
                    {system.level}%
                  </span>
                </div>
                <Progress
                  value={system.level}
                  className={`h-2 ${getProgressColor(system.color)}`}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Diagnostic Codes */}
      <Card className="glass-card border-border animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl font-light flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" strokeWidth={1.5} />
            Codes de Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {diagnosticCodes.map((code, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={getColorClass(code.severity)}
                    strokeWidth={1.5}
                  />
                  <div>
                    <Badge variant="outline" className="mb-1 font-mono text-xs">
                      {code.code}
                    </Badge>
                    <p className="text-sm font-light">{code.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Scan Info */}
      <Card className="glass-card border-border animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-light mb-1">Dernier scan</p>
              <p className="font-light">22 Novembre 2025 à 14:35</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-light">
              Nouveau Scan
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Diagnostics;
