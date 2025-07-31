import { useEffect, useRef } from 'react';

// Skip link component for keyboard navigation
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] bg-jobequal-green text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-jobequal-green"
    >
      {children}
    </a>
  );
}

// Focus trap for modals and overlays
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

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
      if (e.key === 'Escape') {
        // Let parent component handle escape
        container.dispatchEvent(new CustomEvent('escape-pressed'));
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element when trap activates
    setTimeout(() => firstElement?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
}

// Announce content changes to screen readers
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return announce;
}

// Reduce motion preference hook
export function useReducedMotion() {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return prefersReducedMotion;
}

// Accessible button component with proper ARIA attributes
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  type = 'button',
}: AccessibleButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-jobequal-green to-jobequal-teal text-white hover:from-jobequal-green-hover hover:to-jobequal-teal focus:ring-jobequal-green shadow-md hover:shadow-lg transform hover:scale-105',
    secondary: 'bg-white text-jobequal-green border-2 border-jobequal-green hover:bg-jobequal-green hover:text-white focus:ring-jobequal-green',
    ghost: 'text-jobequal-green hover:bg-jobequal-green-light focus:ring-jobequal-green'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl'
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

// High contrast mode detector
export function useHighContrastMode() {
  const isHighContrast = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-contrast: high)').matches
    : false;

  return isHighContrast;
}

// Keyboard navigation helper
export function useKeyboardNavigation(onEscape?: () => void, onEnter?: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onEscape?.(event);
          break;
        case 'Enter':
          onEnter?.(event);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
}

// Live region for dynamic content updates
export function LiveRegion({ 
  children, 
  politeness = 'polite',
  atomic = false 
}: { 
  children: React.ReactNode;
  politeness?: 'off' | 'polite' | 'assertive';
  atomic?: boolean;
}) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}
