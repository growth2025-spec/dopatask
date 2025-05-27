import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Target, Trophy, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo y título principal */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-6">
            <span className="neon-teal">Dopa</span>
            <span className="neon-pink">Tasks</span>
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            Productividad gamificada con recompensas de dopamina
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Combina la técnica Pomodoro con gestión de tareas y un sistema de recompensas visuales 
            para mantener tu motivación al máximo nivel.
          </p>
        </div>

        {/* Características principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-card border-primary/20 hover:border-primary/50 transition-colors">
            <Timer className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Técnica Pomodoro</h3>
            <p className="text-sm text-muted-foreground">
              Sesiones de enfoque de 25 minutos con descansos automáticos
            </p>
          </Card>

          <Card className="p-6 bg-card border-accent/20 hover:border-accent/50 transition-colors">
            <Target className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestión de Tareas</h3>
            <p className="text-sm text-muted-foreground">
              Organiza tus objetivos diarios y semanales de forma eficiente
            </p>
          </Card>

          <Card className="p-6 bg-card border-yellow-400/20 hover:border-yellow-400/50 transition-colors">
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sistema de Logros</h3>
            <p className="text-sm text-muted-foreground">
              Gana puntos y desbloquea logros por completar tareas
            </p>
          </Card>

          <Card className="p-6 bg-card border-purple-400/20 hover:border-purple-400/50 transition-colors">
            <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Recompensas Visuales</h3>
            <p className="text-sm text-muted-foreground">
              Animaciones y efectos que liberan dopamina al completar tareas
            </p>
          </Card>
        </div>

        {/* Call to action */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-black font-bold"
            onClick={() => window.location.href = '/api/login'}
          >
            Comenzar Mi Viaje de Productividad
          </Button>
          <p className="text-sm text-muted-foreground">
            Inicia sesión con tu cuenta de Replit para guardar tu progreso
          </p>
        </div>

        {/* Demo visual */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
          <Card className="relative bg-card/50 backdrop-blur-sm border-primary/30 p-8">
            <h3 className="text-2xl font-bold mb-4">¿Listo para ser más productivo?</h3>
            <p className="text-muted-foreground">
              Únete a miles de usuarios que ya están mejorando su productividad con DopaTasks
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}