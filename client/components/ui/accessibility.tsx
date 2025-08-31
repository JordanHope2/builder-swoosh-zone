import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Volume2,
  Type,
  Contrast,
  Keyboard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// Accessibility preferences context
interface AccessibilityPreferences {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  autoplay: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: false,
  autoplay: true,
};

export const AccessibilityContext = React.createContext<{
  preferences: AccessibilityPreferences;
  updatePreference: (
    key: keyof AccessibilityPreferences,
    value: boolean,
  ) => void;
}>({
  preferences: defaultPreferences,
  updatePreference: () => {},
});

// Accessibility provider component
interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(
    () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("accessibility-preferences");
        return stored ? JSON.parse(stored) : defaultPreferences;
      }
      return defaultPreferences;
    },
  );

  const updatePreference = (
    key: keyof AccessibilityPreferences,
    value: boolean,
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem(
      "accessibility-preferences",
      JSON.stringify(newPreferences),
    );

    // Apply global changes based on preferences
    applyGlobalAccessibilitySettings(newPreferences);
  };

  const applyGlobalAccessibilitySettings = (
    prefs: AccessibilityPreferences,
  ) => {
    const htmlElement = document.documentElement;

    // High contrast
    htmlElement.classList.toggle("high-contrast", prefs.highContrast);

    // Large text
    htmlElement.classList.toggle("large-text", prefs.largeText);

    // Reduced motion
    htmlElement.classList.toggle("reduce-motion", prefs.reducedMotion);

    // Keyboard navigation
    htmlElement.classList.toggle(
      "keyboard-navigation",
      prefs.keyboardNavigation,
    );
  };

  useEffect(() => {
    applyGlobalAccessibilitySettings(preferences);
  }, [preferences]);

  // Detect user preferences
  useEffect(() => {
    const mediaQueries = {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
      highContrast: window.matchMedia("(prefers-contrast: high)"),
      largeText: window.matchMedia("(prefers-reduced-transparency: reduce)"),
    };

    const handleMediaChange = () => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches,
      }));
    };

    Object.values(mediaQueries).forEach((mq) =>
      mq.addEventListener("change", handleMediaChange),
    );

    return () => {
      Object.values(mediaQueries).forEach((mq) =>
        mq.removeEventListener("change", handleMediaChange),
      );
    };
  }, []);

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility settings panel
export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, updatePreference } =
    React.useContext(AccessibilityContext);

  const settings = [
    {
      key: "highContrast" as const,
      label: "High Contrast",
      description: "Increase color contrast for better visibility",
      icon: Contrast,
    },
    {
      key: "reducedMotion" as const,
      label: "Reduce Motion",
      description: "Minimize animations and transitions",
      icon: Eye,
    },
    {
      key: "largeText" as const,
      label: "Large Text",
      description: "Increase text size for better readability",
      icon: Type,
    },
    {
      key: "keyboardNavigation" as const,
      label: "Keyboard Navigation",
      description: "Enhanced keyboard navigation support",
      icon: Keyboard,
    },
    {
      key: "autoplay" as const,
      label: "Autoplay Media",
      description: "Allow videos and animations to play automatically",
      icon: Volume2,
    },
  ];

  return (
    <>
      {/* Accessibility Toggle Button */}
      <motion.button
        className="fixed bottom-4 left-4 z-50 p-3 bg-jobequal-green text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility Settings"
      >
        <Eye className="w-6 h-6" />
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-4 top-1/2 -translate-y-1/2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Accessibility Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close accessibility settings"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {settings.map((setting) => {
                    const Icon = setting.icon;
                    const isEnabled = preferences[setting.key];

                    return (
                      <div
                        key={setting.key}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <Icon
                            className={`w-5 h-5 ${isEnabled ? "text-jobequal-green" : "text-gray-400"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {setting.label}
                            </h3>
                            <button
                              onClick={() =>
                                updatePreference(setting.key, !isEnabled)
                              }
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-jobequal-green focus:ring-offset-2 ${
                                isEnabled
                                  ? "bg-jobequal-green"
                                  : "bg-gray-200 dark:bg-gray-600"
                              }`}
                              role="switch"
                              aria-checked={isEnabled}
                              aria-labelledby={`${setting.key}-label`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isEnabled ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    These settings are saved in your browser and will persist
                    across sessions.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Screen reader announcement component
interface ScreenReaderAnnouncementProps {
  message: string;
  priority?: "polite" | "assertive";
}

export const ScreenReaderAnnouncement: React.FC<
  ScreenReaderAnnouncementProps
> = ({ message, priority = "polite" }) => {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setAnnouncement(message);
    const timer = setTimeout(() => setAnnouncement(""), 1000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div aria-live={priority} aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
};

// Skip link component
export const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-jobequal-green text-white px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-jobequal-green"
  >
    Skip to main content
  </a>
);

// Focus trap hook
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const closeButton = container.querySelector(
          "[data-close]",
        );
        closeButton?.click();
      }
    };

    container.addEventListener("keydown", handleTabKey);
    container.addEventListener("keydown", handleEscapeKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
      container.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
};

// Keyboard navigation helper
export const useKeyboardNavigation = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
};

// Accessible notification component
interface AccessibleNotificationProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const AccessibleNotification: React.FC<AccessibleNotificationProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };

  const colors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const Icon = icons[type];

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 max-w-md w-full border rounded-lg p-4 shadow-lg ${colors[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium mb-1">{title}</h3>
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
          aria-label="Close notification"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default AccessibilityProvider;
