import { motion } from "framer-motion";
import React from "react";

import { cn } from "../../lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  centerAlign?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  description,
  className = "",
  centerAlign = true,
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "mb-8 sm:mb-12 lg:mb-16",
        centerAlign ? "text-center" : "",
        className,
      )}
    >
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 sm:mb-3"
        >
          <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium text-jobequal-green bg-jobequal-green-light rounded-full uppercase tracking-wide">
            {subtitle}
          </span>
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-jobequal-text dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight"
      >
        {title}
      </motion.h1>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl lg:text-2xl text-jobequal-text-muted dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
        >
          {description}
        </motion.p>
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 sm:mt-8"
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// Specialized components for common use cases
export function DashboardHeader({
  title,
  subtitle,
  description,
  children,
}: Omit<PageHeaderProps, "centerAlign">) {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      description={description}
      centerAlign={true}
      className="mb-6 sm:mb-8 lg:mb-10"
    >
      {children}
    </PageHeader>
  );
}

export function SectionHeader({
  title,
  subtitle,
  description,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 sm:mb-8 text-center", className)}>
      {subtitle && (
        <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium text-jobequal-green bg-jobequal-green-light rounded-full uppercase tracking-wide mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-jobequal-text dark:text-white mb-4 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-lg sm:text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
