import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Timer, Edit, Trash2, Check, Clock } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { AddTaskModal } from "./add-task-modal";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import type { Task } from "@shared/schema";

export function TasksSection() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "all">("daily");
  const { data: tasks = [], updateTask, deleteTask } = useTasks();
  const { toast } = useToast();

  const filteredTasks = tasks.filter((task: Task) => {
    if (activeTab === "all") return true;
    return task.goal === activeTab;
  });

  const handleCompleteTask = async (task: Task) => {
    if (task.completed) return;

    await updateTask.mutateAsync({
      id: task.id,
      completed: true,
    });

    toast({
      title: "🎉 Task Completed!",
      description: "Great job! You've earned dopamine points!",
      duration: 3000,
    });
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask.mutateAsync(taskId);
    toast({
      title: "Task Deleted",
      description: "Task has been removed successfully.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "low": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "No due date";
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Due today";
    if (date.toDateString() === tomorrow.toDateString()) return "Due tomorrow";
    return `Due ${date.toLocaleDateString()}`;
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mis Tareas</h1>
            <p className="text-muted-foreground">Gestiona tus objetivos diarios y semanales</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-black font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Agregar Tarea
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: "daily", label: "Objetivos Diarios" },
            { key: "weekly", label: "Objetivos Semanales" },
            { key: "all", label: "Todas las Tareas" },
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "ghost"}
              onClick={() => setActiveTab(key as any)}
              className={activeTab === key ? "bg-primary/20 text-primary" : ""}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-muted-foreground">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Aún no hay tareas</h3>
                <p className="text-sm">¡Agrega tu primera tarea para comenzar tu viaje de productividad!</p>
              </div>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`${task.completed ? "task-complete" : ""}`}
              >
                <Card className={`p-6 border hover:border-primary/50 transition-all duration-300 ${
                  task.completed ? "opacity-60" : ""
                }`}>
                  <div className="flex items-start space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`mt-1 w-6 h-6 rounded-full border-2 p-0 ${
                        task.completed
                          ? "bg-primary border-primary"
                          : "border-muted-foreground hover:border-primary"
                      }`}
                      onClick={() => handleCompleteTask(task)}
                      disabled={task.completed}
                    >
                      {task.completed && <Check className="h-3 w-3 text-black" />}
                    </Button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold text-lg ${
                          task.completed ? "line-through" : ""
                        }`}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        {task.completed && (
                          <Badge className="bg-green-500/20 text-green-400">
                            Completada
                          </Badge>
                        )}
                      </div>

                      {task.description && (
                        <p className={`text-muted-foreground text-sm mb-3 ${
                          task.completed ? "line-through" : ""
                        }`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        {task.completed ? (
                          <span className="flex items-center">
                            <Check className="mr-1 h-4 w-4 text-primary" />
                            Completada {task.completedAt ? `a las ${new Date(task.completedAt).toLocaleTimeString()}` : ""}
                          </span>
                        ) : (
                          <>
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              {task.goal === "daily" ? "Vence hoy" : "Esta semana"}
                            </span>
                            <span className="flex items-center">
                              <Timer className="mr-1 h-4 w-4" />
                              {task.estimatedPomodoros} pomodoro{task.estimatedPomodoros !== 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="p-2">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}