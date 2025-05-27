import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTasks } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import type { InsertTask } from "@shared/schema";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const [formData, setFormData] = useState<InsertTask>({
    title: "",
    description: "",
    priority: "medium",
    goal: "daily",
    estimatedPomodoros: 1,
  });

  const { createTask } = useTasks();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTask.mutateAsync(formData);
      toast({
        title: "Task Created!",
        description: "Your new task has been added successfully.",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        goal: "daily",
        estimatedPomodoros: 1,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof InsertTask, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Tarea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título de la Tarea</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ingresa el título de la tarea..."
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Agrega una descripción..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal">Objetivo</Label>
              <Select
                value={formData.goal}
                onValueChange={(value) => handleInputChange("goal", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="pomodoros">Pomodoros Estimados</Label>
            <Input
              id="pomodoros"
              type="number"
              min="1"
              max="10"
              value={formData.estimatedPomodoros}
              onChange={(e) => handleInputChange("estimatedPomodoros", parseInt(e.target.value))}
              className="mt-1"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-black"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? "Agregando..." : "Agregar Tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
