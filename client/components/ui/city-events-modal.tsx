import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Users,
  ExternalLink,
  Globe,
  Music,
  Briefcase,
  Palette,
  Trophy,
  Star,
  Clock,
  Navigation,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";

import {
  CityEventsData,
  CityEvent,
  cityEventsService,
} from "../../services/cityEventsService";

interface CityEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

const categoryIcons = {
  cultural: Star,
  sports: Trophy,
  business: Briefcase,
  music: Music,
  arts: Palette,
  festival: Star,
  other: Calendar,
};

const categoryColors = {
  cultural: "from-purple-500 to-purple-600",
  sports: "from-green-500 to-green-600",
  business: "from-blue-500 to-blue-600",
  music: "from-pink-500 to-pink-600",
  arts: "from-orange-500 to-orange-600",
  festival: "from-yellow-500 to-yellow-600",
  other: "from-gray-500 to-gray-600",
};

function EventCard({ event, index }: { event: CityEvent; index: number }) {
  const IconComponent = categoryIcons[event.category] || Calendar;
  const colorClass = categoryColors[event.category] || categoryColors.other;

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
    >
      <div className="flex items-start space-x-3">
        <div
          className={`p-2 rounded-lg bg-gradient-to-r ${colorClass} flex-shrink-0`}
        >
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
              {event.title}
            </h4>
            {isUpcoming && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2 flex-shrink-0">
                Upcoming
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{eventDate.toLocaleDateString()}</span>
            </div>
            {event.venue && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{event.venue}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            {event.description}
          </p>

          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              <span>Learn more</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CityOverviewCard({
  overview,
}: {
  overview: CityEventsData["overview"];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-6"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {overview.name}, {overview.country}
          </h3>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{overview.population.toLocaleString()} residents</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {overview.description}
          </p>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
            <div className="grid grid-cols-2 gap-2">
              {overview.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>{highlight}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickLinksCard({
  quickLinks,
  cityName,
}: {
  quickLinks: CityEventsData["quickLinks"];
  cityName: string;
}) {
  const links = [
    { label: "Tourism Office", url: quickLinks.tourism, icon: Globe },
    { label: "Events & Activities", url: quickLinks.events, icon: Calendar },
    { label: "Official Website", url: quickLinks.official, icon: ExternalLink },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-gray-50 rounded-xl p-4"
    >
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <Navigation className="w-4 h-4 mr-2 text-blue-500" />
        Quick Links
      </h4>
      <div className="space-y-2">
        {links.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
            className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors p-2 hover:bg-white rounded-lg"
          >
            <link.icon className="w-4 h-4" />
            <span>{link.label}</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Globe className="w-12 h-12 text-blue-500" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Loading City Information
      </h3>
      <p className="text-gray-600 text-center max-w-sm">
        Gathering the latest events and information about this city...
      </p>
    </div>
  );
}

export function CityEventsModal({
  isOpen,
  onClose,
  cityName,
}: CityEventsModalProps) {
  const [cityData, setCityData] = useState<CityEventsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && cityName) {
      loadCityData();
    }
  }, [isOpen, cityName]);

  const loadCityData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await cityEventsService.getCityEvents(cityName);
      setCityData(data);
    } catch (err: unknown) {
      setError("Failed to load city information. Please try again.");
      console.error("Error loading city data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state when closing
    setTimeout(() => {
      setCityData(null);
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end p-4">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-full max-h-[90vh] overflow-hidden flex flex-col"
          role="dialog"
          aria-labelledby="city-events-title"
          aria-describedby="city-events-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  id="city-events-title"
                  className="text-xl font-bold text-gray-900"
                >
                  {cityName}
                </h2>
                <p
                  id="city-events-description"
                  className="text-sm text-gray-600"
                >
                  City overview & upcoming events
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close city information"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Information Unavailable
                </h3>
                <p className="text-gray-600 text-center mb-4">{error}</p>
                <button
                  onClick={loadCityData}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : cityData ? (
              <div className="space-y-6">
                {/* City Overview */}
                <CityOverviewCard overview={cityData.overview} />

                {/* Quick Links */}
                <QuickLinksCard
                  quickLinks={cityData.quickLinks}
                  cityName={cityName}
                />

                {/* Upcoming Events */}
                <div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-lg font-semibold text-gray-900 mb-4 flex items-center"
                  >
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    Upcoming Events
                  </motion.h3>

                  {cityData.events.length > 0 ? (
                    <div className="space-y-4">
                      {cityData.events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="text-center py-8 text-gray-500"
                    >
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No upcoming events found</p>
                    </motion.div>
                  )}
                </div>

                {/* Map Integration Placeholder */}
                {cityData.overview.coordinates && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="bg-gray-100 rounded-xl p-4 text-center"
                  >
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Location</p>
                    <p className="text-xs text-gray-500">
                      {cityData.overview.coordinates.lat.toFixed(4)},{" "}
                      {cityData.overview.coordinates.lng.toFixed(4)}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${cityData.overview.coordinates.lat},${cityData.overview.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 transition-colors"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
