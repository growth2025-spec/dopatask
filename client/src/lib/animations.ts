// Animation utilities for DopaTasks

export const taskCompleteAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const rewardParticleAnimation = (x: number, y: number) => ({
  initial: { x: 0, y: 0, scale: 1, opacity: 1 },
  animate: { x, y, scale: 0, opacity: 0 },
  transition: { duration: 1, ease: "easeOut" }
});

export const modalAnimation = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
  transition: { duration: 0.2, ease: "easeOut" }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
