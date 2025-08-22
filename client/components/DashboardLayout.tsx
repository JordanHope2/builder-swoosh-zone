import React from "react";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-jobequal-text dark:text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-jobequal-text-muted dark:text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex space-x-4">{actions}</div>}
      </motion.div>

      {children}
    </div>
  );
}
