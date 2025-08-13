import React from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import { useRef, useEffect } from 'react';

// Modern animation variants with latest effects
export const modernAnimations = {
  // Smooth entrance animations
  slideInFromBottom: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1
    }
  },

  slideInFromLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
    transition: { 
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  },

  slideInFromRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
    transition: { 
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  },

  // Modern scale animations
  scaleInBounce: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        mass: 0.8
      }
    },
    exit: { scale: 0, opacity: 0 },
    whileHover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  },

  // Morphing animations
  morphIn: {
    initial: { 
      scale: 0.8, 
      opacity: 0, 
      rotateX: -90,
      transformPerspective: 1000
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        staggerChildren: 0.1
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0, 
      rotateX: 90 
    }
  },

  // Floating animations
  floatingCard: {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    whileHover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 }
    }
  },

  // Stagger container
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },

  // Stagger items
  staggerItem: {
    initial: { y: 60, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  },

  // Gradient text animation
  gradientText: {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  },

  // Button interactions
  buttonHover: {
    whileHover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    whileTap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  },

  // Card interactions
  cardHover: {
    whileHover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  },

  // Loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Swipe animations
  swipeCard: {
    initial: { scale: 0.9, opacity: 0, y: 50 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: (direction: number) => ({
      x: direction * 1000,
      opacity: 0,
      scale: 0.5,
      rotate: direction * 30,
      transition: { duration: 0.3 }
    }),
    drag: "x",
    dragConstraints: { left: 0, right: 0 }
  }
};

// Enhanced Motion Components
interface EnhancedMotionProps {
  children: React.ReactNode;
  animation?: keyof typeof modernAnimations;
  delay?: number;
  className?: string;
  onClick?: () => void;
  custom?: any;
}

export const EnhancedMotion: React.FC<EnhancedMotionProps> = ({
  children,
  animation = 'slideInFromBottom',
  delay = 0,
  className,
  onClick,
  custom
}) => {
  const animConfig = modernAnimations[animation];
  
  return (
    <motion.div
      initial={animConfig.initial}
      animate={animConfig.animate}
      exit={animConfig.exit}
      whileHover={animConfig.whileHover}
      whileTap={animConfig.whileTap}
      transition={{
        ...animConfig.transition,
        delay
      }}
      className={className}
      onClick={onClick}
      custom={custom}
    >
      {children}
    </motion.div>
  );
};

// Scroll-triggered animations
export const ScrollTriggeredMotion: React.FC<EnhancedMotionProps> = ({
  children,
  animation = 'slideInFromBottom',
  className,
  onClick
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  const animConfig = modernAnimations[animation];

  return (
    <motion.div
      ref={ref}
      initial={animConfig.initial}
      animate={controls}
      variants={animConfig}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Staggered list animation
interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className,
  itemClassName,
  staggerDelay = 0.1
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      initial="initial"
      animate="animate"
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={modernAnimations.staggerItem}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={modernAnimations.pageTransition}
    >
      {children}
    </motion.div>
  );
};

// Interactive button with enhanced animations
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false
}) => {
  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-lg focus:ring-jobequal-green",
    secondary: "bg-white border-2 border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white shadow-md focus:ring-jobequal-green",
    accent: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg focus:ring-purple-500"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <motion.div
        className="flex items-center justify-center space-x-2"
        animate={loading ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
      >
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        <span>{children}</span>
      </motion.div>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileTap={{
          opacity: [0, 0.3, 0],
          scale: [0, 1]
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

// Animated card component
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}> = ({ children, className, onClick, hoverable = true }) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      variants={hoverable ? modernAnimations.cardHover : {}}
      whileHover={hoverable ? "whileHover" : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Gradient animated text
export const GradientText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <motion.span
      className={`bg-gradient-to-r from-jobequal-green via-jobequal-teal to-purple-500 bg-clip-text text-transparent bg-300% ${className}`}
      variants={modernAnimations.gradientText}
      animate="animate"
      style={{
        backgroundSize: "300% 300%"
      }}
    >
      {children}
    </motion.span>
  );
};

export default {
  EnhancedMotion,
  ScrollTriggeredMotion,
  StaggeredList,
  PageTransition,
  AnimatedButton,
  AnimatedCard,
  GradientText,
  modernAnimations
};
