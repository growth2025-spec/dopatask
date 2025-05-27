import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertPomodoroSession } from "@shared/schema";

type SessionType = "focus" | "break";

export function usePomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const createSession = useMutation({
    mutationFn: async (session: InsertPomodoroSession) => {
      const response = await apiRequest("POST", "/api/pomodoro/sessions", session);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pomodoro/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pomodoro/sessions/today"] });
    },
  });

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Session completed
        setIsRunning(false);
        completeCurrentSession();
        return 0;
      }
      return prev - 1;
    });
  }, []);

  const completeCurrentSession = async () => {
    // Create session record
    await createSession.mutateAsync({
      type: sessionType,
      duration: sessionType === "focus" ? 25 * 60 : 5 * 60,
      completed: true,
      taskId: null, // For now, not linking to specific tasks
    });

    // Play completion sound (browser notification sound)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEa');
      audio.play().catch(() => {
        // Silent fail if audio doesn't work
      });
    } catch (error) {
      // Silent fail
    }

    // Show reward notification
    if (sessionType === "focus") {
      setSessionCount(prev => prev + 1);
      window.dispatchEvent(new CustomEvent('show-reward', {
        detail: { message: 'Pomodoro completed! Great focus! 🍅' }
      }));
      
      // Switch to break
      setSessionType("break");
      const isLongBreak = (sessionCount + 1) % 4 === 0;
      setTimeLeft(isLongBreak ? 15 * 60 : 5 * 60); // Long break every 4 sessions
      
      toast({
        title: "🍅 Pomodoro Completed!",
        description: `Time for a ${isLongBreak ? 'long' : 'short'} break!`,
        duration: 5000,
      });
    } else {
      window.dispatchEvent(new CustomEvent('show-reward', {
        detail: { message: 'Break time over! Ready to focus? 💪' }
      }));
      
      // Switch to focus
      setSessionType("focus");
      setTimeLeft(25 * 60);
      
      toast({
        title: "Break Complete!",
        description: "Ready to get back to work?",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === "focus" ? 25 * 60 : 5 * 60);
  };

  const skipSession = () => {
    setIsRunning(false);
    completeCurrentSession();
  };

  return {
    timeLeft,
    isRunning,
    sessionType,
    sessionCount,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
  };
}
