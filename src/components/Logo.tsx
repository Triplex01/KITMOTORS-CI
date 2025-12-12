export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="KitMotors" 
        className="h-10 w-auto"
        onError={(e) => {
          // Fallback si l'image n'existe pas
          e.currentTarget.style.display = 'none';
        }}
      />
      <span className="text-xl font-bold text-foreground">KitMotors</span>
    </div>
  );
}
