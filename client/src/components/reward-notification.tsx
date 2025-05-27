import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RewardNotificationState {
  isVisible: boolean;
  message: string;
}

export function RewardNotification() {
  const [notification, setNotification] = useState<RewardNotificationState>({
    isVisible: false,
    message: "",
  });

  // Listen for custom reward events
  useEffect(() => {
    const handleReward = (event: CustomEvent) => {
      setNotification({
        isVisible: true,
        message: event.detail.message || "Great job!",
      });

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, isVisible: false }));
      }, 3000);
    };

    window.addEventListener('show-reward' as any, handleReward);
    return () => window.removeEventListener('show-reward' as any, handleReward);
  }, []);

  // Particle positions for explosion effect
  const particles = [
    { x: 100, y: -100, color: "bg-accent" },
    { x: -100, y: -100, color: "bg-primary" },
    { x: 100, y: 100, color: "bg-yellow-400" },
    { x: -100, y: 100, color: "bg-accent" },
    { x: 0, y: -150, color: "bg-primary" },
    { x: 0, y: 150, color: "bg-yellow-400" },
    { x: 150, y: 0, color: "bg-accent" },
    { x: -150, y: 0, color: "bg-primary" },
  ];

  return (
    <AnimatePresence>
      {notification.isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          {/* Main reward message */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="bg-gradient-to-r from-accent to-primary text-black font-bold text-xl px-8 py-4 rounded-xl shadow-2xl"
          >
            <span className="mr-2">⭐</span>
            {notification.message}
          </motion.div>

          {/* Particle explosion */}
          <div className="absolute">
            {particles.map((particle, index) => (
              <motion.div
                key={index}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 1, 
                  opacity: 1 
                }}
                animate={{ 
                  x: particle.x, 
                  y: particle.y, 
                  scale: 0, 
                  opacity: 0 
                }}
                transition={{ 
                  duration: 1, 
                  ease: "easeOut",
                  delay: index * 0.1 
                }}
                className={`absolute w-3 h-3 rounded-full ${particle.color}`}
              />
            ))}
          </div>

          {/* Confetti-like elements */}
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={`confetti-${index}`}
              initial={{ 
                x: 0, 
                y: 0, 
                rotate: 0,
                opacity: 1 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 400, 
                y: (Math.random() - 0.5) * 400, 
                rotate: Math.random() * 360,
                opacity: 0 
              }}
              transition={{ 
                duration: 2, 
                ease: "easeOut",
                delay: Math.random() * 0.5 
              }}
              className="absolute w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-sm"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
