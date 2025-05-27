import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, SkipForward, Settings, Bell, Timer } from "lucide-react";
import { usePomodoro } from "@/hooks/use-pomodoro";
import { useTasks } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export function PomodoroTimer() {
  const {
    timeLeft,
    isRunning,
    sessionType,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  } = usePomodoro();

  const { data: tasks = [] } = useTasks();
  const { data: todaySessions = [] } = useQuery<any[]>({
    queryKey: ["/api/pomodoro/sessions/today"],
  });
  const { toast } = useToast();

  const activeTasks = tasks.filter(task => !task.completed);
  const currentTask = activeTasks[0]; // For simplicity, use first active task

  const completedPomodoros = todaySessions.filter(
    (session: any) => session.completed && session.type === 'focus'
  ).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = sessionType === 'focus' ? 25 * 60 : 5 * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const handleToggleTimer = () => {
    if (isRunning) {
      pauseTimer();
      toast({
        title: "Timer Paused",
        description: "Take a breather, you can resume anytime.",
      });
    } else {
      startTimer();
      toast({
        title: `${sessionType === 'focus' ? 'Focus' : 'Break'} Session Started`,
        description: sessionType === 'focus' 
          ? "Time to focus! Let's get things done." 
          : "Enjoy your break! You've earned it.",
      });
    }
  };

  return (
    <div className="w-full lg:w-96 bg-card border-l border-border p-6">
      <div className="sticky top-6">
        {/* Timer Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Temporizador Pomodoro</h2>
          <p className="text-muted-foreground text-sm">Mantente enfocado y productivo</p>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 144 144">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={sessionType === 'focus' ? "text-accent" : "text-primary"}
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * getProgressPercentage()) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
              <div className="text-sm text-muted-foreground">
                {sessionType === 'focus' ? 'Tiempo de Enfoque' : 'Tiempo de Descanso'}
              </div>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            size="lg"
            className={`w-16 h-16 rounded-full p-0 bg-accent hover:bg-accent/80 text-black ${
              isRunning ? "timer-glow" : ""
            }`}
            onClick={handleToggleTimer}
          >
            {isRunning ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-16 h-16 rounded-full p-0"
            onClick={resetTimer}
          >
            <Square className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-16 h-16 rounded-full p-0"
            onClick={skipSession}
          >
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>

        {/* Session Info */}
        <Card className="bg-background p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Sesión</span>
            <span className="text-primary font-semibold">
              {completedPomodoros}/8
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Próximo Descanso</span>
            <span className="text-accent font-semibold">
              {sessionCount % 4 === 3 ? "15 min" : "5 min"}
            </span>
          </div>
        </Card>

        {/* Current Task */}
        {currentTask && (
          <Card className="bg-background p-4 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              TRABAJANDO EN
            </h3>
            <p className="font-medium">{currentTask.title}</p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Timer className="mr-1 h-4 w-4" />
              <span>{currentTask.estimatedPomodoros} pomodoros estimados</span>
            </div>
          </Card>
        )}

        {/* Quick Settings */}
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-start"
          >
            <Settings className="mr-3 h-4 w-4" />
            Configuración del Temporizador
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start"
          >
            <Bell className="mr-3 h-4 w-4" />
            Notificaciones: <span className="ml-2 text-primary">Activo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
