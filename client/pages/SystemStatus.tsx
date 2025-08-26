import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@components/Navigation";
import { PageHeader } from "../components/ui/page-header";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Server,
  Database,
  Zap,
  Globe,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  RefreshCw,
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  description: string;
  icon: React.ComponentType<any>;
  lastUpdated: string;
  uptime: number;
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  description: string;
  timestamp: string;
  updates: {
    time: string;
    message: string;
    status: string;
  }[];
}

const services: ServiceStatus[] = [
  {
    name: "JobEqual Platform",
    status: "operational",
    description: "Core platform functionality",
    icon: Globe,
    lastUpdated: "2 minutes ago",
    uptime: 99.97,
  },
  {
    name: "API Services",
    status: "operational",
    description: "REST API and GraphQL endpoints",
    icon: Server,
    lastUpdated: "1 minute ago",
    uptime: 99.99,
  },
  {
    name: "Database",
    status: "operational",
    description: "Primary and backup databases",
    icon: Database,
    lastUpdated: "3 minutes ago",
    uptime: 99.95,
  },
  {
    name: "AI Matching Service",
    status: "operational",
    description: "CV analysis and job matching",
    icon: Zap,
    lastUpdated: "5 minutes ago",
    uptime: 99.87,
  },
  {
    name: "Authentication",
    status: "operational",
    description: "User login and security",
    icon: Shield,
    lastUpdated: "1 minute ago",
    uptime: 99.98,
  },
  {
    name: "File Upload Service",
    status: "operational",
    description: "CV and document uploads",
    icon: Activity,
    lastUpdated: "4 minutes ago",
    uptime: 99.92,
  },
];

const recentIncidents: Incident[] = [
  {
    id: "1",
    title: "Brief API slowdown resolved",
    status: "resolved",
    severity: "minor",
    description:
      "Some users experienced slower response times when searching jobs.",
    timestamp: "2 hours ago",
    updates: [
      {
        time: "2 hours ago",
        message: "We are investigating reports of slower API response times.",
        status: "investigating",
      },
      {
        time: "1 hour 45 minutes ago",
        message: "Issue identified and fix has been deployed.",
        status: "resolved",
      },
    ],
  },
];

function ServiceCard({ service }: { service: ServiceStatus }) {
  const statusConfig = {
    operational: {
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "Operational",
    },
    degraded: {
      icon: AlertCircle,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "Degraded Performance",
    },
    outage: {
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "Service Outage",
    },
  };

  const config = statusConfig[service.status];
  const StatusIcon = config.icon;
  const ServiceIcon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border ${config.border}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-jobequal-green to-jobequal-teal rounded-lg flex items-center justify-center">
            <ServiceIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-jobequal-text">{service.name}</h3>
            <p className="text-sm text-jobequal-text-muted">
              {service.description}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg}`}
        >
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-jobequal-text-muted">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Updated {service.lastUpdated}</span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4" />
          <span>{service.uptime}% uptime</span>
        </div>
      </div>
    </motion.div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  const severityConfig = {
    minor: { color: "text-yellow-600", bg: "bg-yellow-100" },
    major: { color: "text-orange-600", bg: "bg-orange-100" },
    critical: { color: "text-red-600", bg: "bg-red-100" },
  };

  const statusConfig = {
    investigating: { color: "text-blue-600", bg: "bg-blue-100" },
    identified: { color: "text-purple-600", bg: "bg-purple-100" },
    monitoring: { color: "text-yellow-600", bg: "bg-yellow-100" },
    resolved: { color: "text-green-600", bg: "bg-green-100" },
  };

  const severityStyle = severityConfig[incident.severity];
  const statusStyle = statusConfig[incident.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-jobequal-text">
              {incident.title}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${severityStyle.bg} ${severityStyle.color}`}
            >
              {incident.severity}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color}`}
            >
              {incident.status}
            </span>
          </div>
          <p className="text-jobequal-text-muted mb-3">
            {incident.description}
          </p>
          <div className="flex items-center space-x-1 text-sm text-jobequal-text-muted">
            <Calendar className="w-4 h-4" />
            <span>{incident.timestamp}</span>
          </div>
        </div>
      </div>

      {incident.updates.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-medium text-jobequal-text mb-3">
            Latest Updates
          </h4>
          <div className="space-y-2">
            {incident.updates.map((update, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-jobequal-green rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-jobequal-text">
                      {update.time}
                    </span>
                    <span className="text-xs text-jobequal-text-muted">•</span>
                    <span className="text-xs text-jobequal-text-muted capitalize">
                      {update.status}
                    </span>
                  </div>
                  <p className="text-sm text-jobequal-text-muted">
                    {update.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function SystemStatus() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const overallStatus = services.every((s) => s.status === "operational")
    ? "operational"
    : services.some((s) => s.status === "outage")
      ? "outage"
      : "degraded";

  const statusMessages = {
    operational: "All systems operational",
    degraded: "Some systems experiencing issues",
    outage: "Service disruption detected",
  };

  const statusColors = {
    operational: "text-green-600",
    degraded: "text-yellow-600",
    outage: "text-red-600",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <PageHeader
            subtitle="System Status"
            title="Platform Health & Uptime"
            description="Real-time monitoring of JobEqual's services and infrastructure to ensure optimal performance for all users."
          >
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span
                  className={`text-sm font-medium ${statusColors[overallStatus]}`}
                >
                  {statusMessages[overallStatus]}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 text-jobequal-text ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="text-sm font-medium text-jobequal-text">
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </span>
              </button>
            </div>
            <p className="text-sm text-jobequal-text-muted mt-4">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </PageHeader>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        {/* Services Status */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-jobequal-text mb-4">
              Service Status
            </h2>
            <p className="text-jobequal-text-muted">
              Current operational status of all JobEqual services and
              components.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Incidents */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-jobequal-text mb-4">
              Recent Incidents
            </h2>
            <p className="text-jobequal-text-muted">
              Latest updates on any service disruptions or maintenance
              activities.
            </p>
          </motion.div>

          {recentIncidents.length > 0 ? (
            <div className="space-y-6">
              {recentIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IncidentCard incident={incident} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-jobequal-text mb-2">
                No Recent Incidents
              </h3>
              <p className="text-jobequal-text-muted">
                All systems have been running smoothly with no reported
                incidents in the past 30 days.
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
