import { useEffect, useRef } from "react";

// ---------- Skip Link Component ----------
export function SkipLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] bg-jobequal-green text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-jobequal-green"
    >
      {children}
    </a>
  );
}

// ---------- Focus Trap Hook ----------
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableSelectors = [
      "a[href]",
      "button",
      "textarea",
      'input[type="text"]',
      'input[type="radio"]',
      'input[type="checkbox"]',
      "select",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    const focusableElements =
      container.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        container.dispatchEvent(new CustomEvent("escape-pressed"));
      }
    };

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);

    setTimeout(() => firstElement?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
}

// ---------- Screen Reader Announcement Hook ----------
export function useScreenReaderAnnouncement() {
  return (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };
}

// ---------- Reduced Motion Hook ----------
export function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---------- Accessible Button Component ----------
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  ariaLabel,
  ariaDescribedBy,
  className = "",
  type = "button",
}: AccessibleButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white hover:from-jobequal-green-hover hover:to-jobequal-teal focus:ring-jobequal-green shadow-md hover:shadow-lg transform hover:scale-105",
    secondary:
      "bg-white text-jobequal-green border-2 border-jobequal-green hover:bg-jobequal-green hover:text-white focus:ring-jobequal-green",
    ghost:
      "text-jobequal-green hover:bg-jobequal-green-light focus:ring-jobequal-green",
  };

  const sizeClasses: Record<string, string> = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2.5 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// ---------- High Contrast Mode Hook ----------
export function useHighContrastMode(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-contrast: high)").matches;
}

// ---------- Keyboard Navigation Hook ----------
export function useKeyboardNavigation(
  onEscape?: (event: KeyboardEvent) => void,
  onEnter?: (event: KeyboardEvent) => void,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape?.(event);
      if (event.key === "Enter") onEnter?.(event);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, onEnter]);
}

// ---------- Live Region Component ----------
export function LiveRegion({
  children,
  politeness = "polite",
  atomic = false,
}: {
  children: React.ReactNode;
  politeness?: "off" | "polite" | "assertive";
  atomic?: boolean;
}) {
  return (
    <div aria-live={politeness} aria-atomic={atomic} className="sr-only">
      {children}
    </div>
  );
}
