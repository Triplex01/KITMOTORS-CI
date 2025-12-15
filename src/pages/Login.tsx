import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserCheck } from "lucide-react";
import { getUserByEmail, createUser } from "@/lib/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Normaliser l'email (trim + lowercase)
      const normalizedEmail = email.trim().toLowerCase();
      console.log('Tentative de connexion avec:', normalizedEmail);
      
      const user = await getUserByEmail(normalizedEmail);
      console.log('Utilisateur trouvé:', user);
      
      if (!user) {
        toast({
          title: "Erreur de connexion",
          description: "Aucun compte trouvé avec cet email. Vérifiez l'orthographe.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        console.log('Mot de passe incorrect. Attendu:', user.password, 'Reçu:', password);
        toast({
          title: "Erreur de connexion",
          description: "Mot de passe incorrect",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", "token-" + user.id);
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: "client"
      }));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${user.firstName} ${user.lastName}`,
      });
      
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-red-950/10 p-4 overflow-hidden">
      {/* Background pattern with animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <Card className="w-full max-w-md relative z-10 border-red-950/20 bg-card/95 backdrop-blur-sm animate-scale-in">
        <CardHeader className="space-y-1 text-center pb-6">
          {/* Logo KitMotors */}
          <div className="flex justify-center mb-6 auth-logo">
            <img 
              src="/logo.png" 
              alt="KitMotors Logo" 
              className="h-48 w-48 object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <CardDescription className="text-base mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Connectez-vous à votre compte
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-red-950/20 focus:border-red-500 focus:ring-red-500 transition-all duration-300"
              />
            </div>

            <div className="space-y-2 animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-red-950/20 focus:border-red-500 focus:ring-red-500 pr-10 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/forgot-password"
                className="text-sm text-red-500 hover:text-red-400 transition-colors underline-hover"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 btn-press animate-slide-up transition-all duration-300 hover:shadow-xl hover:shadow-red-600/30"
              disabled={isLoading}
              style={{ animationDelay: '0.5s' }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : "Se connecter"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-red-950/30 hover:bg-red-950/10 btn-press animate-slide-up transition-all duration-300"
              onClick={async () => {
                // Créer ou utiliser le compte démo
                const demoEmail = 'demo@kitmotors.com';
                const demoPassword = 'demo123';
                
                let user = await getUserByEmail(demoEmail);
                
                if (!user) {
                  // Créer le compte démo s'il n'existe pas
                  user = await createUser({
                    email: demoEmail,
                    password: demoPassword,
                    firstName: 'Utilisateur',
                    lastName: 'Demo',
                    phone: '+225 00 00 00 00',
                    role: 'client',
                    status: 'active'
                  });
                }
                
                setEmail(demoEmail);
                setPassword(demoPassword);
                toast({
                  title: "Compte démo",
                  description: "Identifiants démo remplis. Cliquez sur Se connecter.",
                });
              }}
              disabled={isLoading}
              style={{ animationDelay: '0.6s' }}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Utiliser compte démo
            </Button>

            <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.7s' }}>
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-400 font-medium transition-colors underline-hover"
              >
                Créer un compte
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
