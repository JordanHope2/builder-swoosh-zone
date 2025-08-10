import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

// Security utility to sanitize and validate data
export const sanitizeText = (text: string | number | undefined | null): string => {
  if (text === null || text === undefined) return '';
  const str = String(text);
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const validateNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Unified animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

// Unified Dashboard Container
interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ 
  children, 
  className 
}) => (
  <main className={cn(
    "min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
    className
  )}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </main>
);

// Unified Stats Card
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
  loading?: boolean;
  onClick?: () => void;
  index?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  loading = false,
  onClick,
  index = 0
}) => {
  const sanitizedTitle = sanitizeText(title);
  const sanitizedValue = sanitizeText(value);
  const sanitizedDescription = sanitizeText(description);
  const sanitizedChange = sanitizeText(change);

  const changeColors = {
    positive: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    negative: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    neutral: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {loading ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <Icon className="w-8 h-8 text-jobequal-green" />
            {change && (
              <span className={cn(
                "text-sm font-semibold px-2 py-1 rounded-full",
                changeColors[changeType]
              )}>
                {sanitizedChange}
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-jobequal-text dark:text-white mb-1">
            {sanitizedValue}
          </div>
          <div className="text-lg font-semibold text-jobequal-text dark:text-gray-200 mb-1">
            {sanitizedTitle}
          </div>
          {description && (
            <div className="text-sm text-jobequal-text-muted dark:text-gray-400">
              {sanitizedDescription}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

// Unified Section Header
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actions,
  className
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6", className)}
  >
    <div>
      <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-1">
        {sanitizeText(title)}
      </h2>
      {subtitle && (
        <p className="text-jobequal-text-muted dark:text-gray-400">
          {sanitizeText(subtitle)}
        </p>
      )}
    </div>
    {actions && (
      <div className="mt-4 sm:mt-0 flex items-center space-x-3">
        {actions}
      </div>
    )}
  </motion.div>
);

// Unified Action Button
interface ActionButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className,
  icon: Icon
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white hover:from-jobequal-green-hover hover:to-jobequal-teal shadow-md hover:shadow-lg',
    secondary: 'bg-white dark:bg-gray-700 text-jobequal-text dark:text-white border border-jobequal-neutral-dark dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:ring-offset-2",
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};

// Unified Dashboard Card
interface DashboardCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  loading?: boolean;
  noPadding?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  title,
  className,
  loading = false,
  noPadding = false
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300",
      !noPadding && "p-6",
      className
    )}
  >
    {title && (
      <h3 className="text-lg font-semibold text-jobequal-text dark:text-white mb-4">
        {sanitizeText(title)}
      </h3>
    )}
    {loading ? (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
    ) : (
      children
    )}
  </motion.div>
);

// Unified Loading Spinner
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(
        "border-2 border-jobequal-green border-t-transparent rounded-full",
        sizes[size]
      )}
    />
  );
};

// Error Boundary Component
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => (
  <DashboardCard className="text-center">
    <div className="text-red-500 mb-4">
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {sanitizeText(error.message)}
      </p>
      <ActionButton variant="danger" onClick={resetError}>
        Try Again
      </ActionButton>
    </div>
  </DashboardCard>
);
