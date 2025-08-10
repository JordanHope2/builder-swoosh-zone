import { motion, Variants, AnimatePresence } from 'framer-motion';
import React from 'react';

// Enhanced animation variants for better fluidity
export const enhancedAnimations = {
  // Smooth fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  scaleInBounce: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { 
      duration: 0.5, 
      ease: [0.68, -0.55, 0.265, 1.55],
      opacity: { duration: 0.3 }
    }
  },

  // Slide animations
  slideInFromBottom: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  slideInFromTop: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  slideInFromLeft: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  slideInFromRight: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },

  // Staggered animations
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },

  // Hover animations
  hoverScale: {
    whileHover: { 
      scale: 1.02,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
    whileTap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  },

  hoverFloat: {
    whileHover: { 
      y: -2,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    }
  },

  hoverRotate: {
    whileHover: { 
      rotate: 5,
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
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

  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },

  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Advanced transitions
  morphShape: {
    initial: { borderRadius: "0%" },
    animate: { borderRadius: "50%" },
    exit: { borderRadius: "0%" },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },

  flipIn: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },

  slideInHeight: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

// Enhanced motion components with built-in animations
interface EnhancedMotionProps {
  children: React.ReactNode;
  animation?: keyof typeof enhancedAnimations;
  delay?: number;
  className?: string;
  onClick?: () => void;
}

export const EnhancedMotionDiv: React.FC<EnhancedMotionProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className,
  onClick
}) => {
  const animConfig = enhancedAnimations[animation];
  
  return (
    <motion.div
      initial={"initial" in animConfig ? (animConfig as any).initial : undefined}
animate={"animate" in animConfig ? (animConfig as any).animate : undefined}
exit={"exit" in animConfig ? (animConfig as any).exit : undefined}
whileHover={"whileHover" in animConfig ? (animConfig as any).whileHover : undefined}
whileTap={"whileTap" in animConfig ? (animConfig as any).whileTap : undefined}
transition={{
  ...(typeof (animConfig as any).transition === "object"
    ? (animConfig as any).transition
    : {}),
  delay:
    typeof (animConfig as any).transition === "object" &&
    typeof (animConfig as any).transition?.delay === "number"
      ? (animConfig as any).transition.delay + (delay ?? 0)
      : (delay ?? 0),
}}

      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Staggered list component
interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  itemDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className,
  itemDelay = 0.1
}) => (
  <motion.div
    className={className}
    initial="initial"
    animate="animate"
    exit="exit"
    variants={{
      initial: {},
      animate: {
        transition: {
          staggerChildren: itemDelay,
          delayChildren: 0.1
        }
      },
      exit: {
        transition: {
          staggerChildren: itemDelay / 2,
          staggerDirection: -1
        }
      }
    }}
  >
    {children.map((child, index) => (
      <motion.div
        key={index}
        variants={enhancedAnimations.staggerItem}
      >
        {child}
      </motion.div>
    ))}
  </motion.div>
);

// Loading skeleton component
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  avatar?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  lines = 3,
  className,
  avatar = false
}) => (
  <div className={`animate-pulse ${className}`}>
    {avatar && (
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
      </div>
    )}
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  </div>
);

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Interactive card component
interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  onClick,
  disabled = false
}) => (
  <motion.div
    className={`${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
    whileHover={!disabled ? { 
      scale: 1.02, 
      y: -2,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    } : undefined}
    whileTap={!disabled ? { 
      scale: 0.98,
      transition: { duration: 0.1 }
    } : undefined}
    onClick={!disabled ? onClick : undefined}
    layout
  >
    {children}
  </motion.div>
);

// Floating action button
interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  onClick,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 z-50
        ${sizeClasses[size]}
        bg-gradient-to-r from-jobequal-green to-jobequal-teal
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        ${className}
      `}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ 
        scale: 0.9,
        transition: { duration: 0.1 }
      }}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }}
    >
      {children}
    </motion.button>
  );
};

export default enhancedAnimations;
