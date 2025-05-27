import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTasks } from "@/hooks/use-tasks";
import { useQuery } from "@tanstack/react-query";
import { Clock, Trophy, Settings, ListTodo, ChartLine, Flame } from "lucide-react";

export function Sidebar() {
  const { data: tasks = [] } = useTasks();
  const { data: todaySessions = [] } = useQuery<any[]>({
    queryKey: ["/api/pomodoro/sessions/today"],
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completedPomodoros = todaySessions.filter((session: any) => session.completed && session.type === 'focus').length;
  const dailyPomodoroGoal = 8;
  const currentStreak = 7; // This would be calculated from historical data

  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const pomodoroProgress = (completedPomodoros / dailyPomodoroGoal) * 100;

  return (
    <aside className="w-full lg:w-80 bg-card border-r border-border p-6">
      {/* Logo and Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          <span className="neon-teal">Dopa</span>
          <span className="neon-pink">Tasks</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Productividad gamificada con recompensas de dopamina
        </p>
      </div>

      {/* Daily Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <ChartLine className="text-primary mr-2 h-5 w-5" />
          Progreso de Hoy
        </h2>

        {/* Pomodoros Completed */}
        <Card className="bg-background p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pomodoros</span>
            <span className="neon-pink font-bold">
              {completedPomodoros}/{dailyPomodoroGoal}
            </span>
          </div>
          <Progress 
            value={pomodoroProgress} 
            className="h-2"
          />
        </Card>

        {/* Tasks Completed */}
        <Card className="bg-background p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Tareas Completadas</span>
            <span className="neon-teal font-bold">
              {completedTasks}/{totalTasks}
            </span>
          </div>
          <Progress 
            value={taskProgress} 
            className="h-2"
          />
        </Card>

        {/* Streak Counter */}
        <Card className="bg-background p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Racha Actual</span>
            <div className="flex items-center">
              <Flame className="text-orange-400 mr-1 h-4 w-4" />
              <span className="text-orange-400 font-bold">{currentStreak} días</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <button className="w-full flex items-center py-3 px-4 rounded-lg bg-primary/20 text-primary">
          <ListTodo className="mr-3 h-5 w-5" />
          <span>Tareas</span>
        </button>
        <button className="w-full flex items-center py-3 px-4 rounded-lg hover:bg-muted transition-colors text-left">
          <Clock className="mr-3 h-5 w-5" />
          <span>Pomodoro</span>
        </button>
        <button className="w-full flex items-center py-3 px-4 rounded-lg hover:bg-muted transition-colors text-left">
          <Trophy className="mr-3 h-5 w-5" />
          <span>Logros</span>
        </button>
        <button className="w-full flex items-center py-3 px-4 rounded-lg hover:bg-muted transition-colors text-left">
          <Settings className="mr-3 h-5 w-5" />
          <span>Configuración</span>
        </button>
        <button 
          className="w-full flex items-center py-3 px-4 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors text-left mt-4"
          onClick={() => window.location.href = '/api/logout'}
        >
          <span className="mr-3 h-5 w-5">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </nav>
    </aside>
  );
}
