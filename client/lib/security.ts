// Security utilities for input validation and data sanitization
import React from 'react';

export class SecurityUtils {
  // Input validation patterns
  static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  static readonly PHONE_PATTERN = /^[\+]?[1-9][\d]{0,15}$/;
  static readonly URL_PATTERN = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  static readonly ALPHANUMERIC_PATTERN = /^[a-zA-Z0-9\s]+$/;
  
  // Sanitize HTML content to prevent XSS
  static sanitizeHtml(input: string | undefined | null): string {
    if (!input) return '';
    
    return String(input)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Sanitize text for safe display
  static sanitizeText(input: string | number | undefined | null): string {
    if (input === null || input === undefined) return '';
    
    const str = String(input);
    
    // Remove script tags and potential XSS vectors
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onclick=/gi, '')
      .replace(/onerror=/gi, '')
      .trim();
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return this.EMAIL_PATTERN.test(email);
  }

  // Validate phone number
  static isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    return this.PHONE_PATTERN.test(phone.replace(/\s/g, ''));
  }

  // Validate URL
  static isValidUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    return this.URL_PATTERN.test(url);
  }

  // Validate numeric input
  static validateNumber(value: any, min?: number, max?: number): number | null {
    const num = Number(value);
    
    if (isNaN(num) || !isFinite(num)) return null;
    if (min !== undefined && num < min) return null;
    if (max !== undefined && num > max) return null;
    
    return num;
  }

  // Validate string length
  static validateStringLength(
    str: string, 
    minLength: number = 0, 
    maxLength: number = 10000
  ): boolean {
    if (typeof str !== 'string') return false;
    return str.length >= minLength && str.length <= maxLength;
  }

  // Generate CSRF token (client-side)
  static generateCsrfToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Rate limiting helper (simple client-side)
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static isRateLimited(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const store = this.rateLimitStore.get(key);

    if (!store || now > store.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (store.count >= maxRequests) {
      return true;
    }

    store.count++;
    return false;
  }

  // Validate file upload
  static validateFileUpload(
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxSize: number = 5 * 1024 * 1024 // 5MB
  ): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File too large' };
    }

    return { valid: true };
  }

  // Escape data for CSV export
  static escapeCsv(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  }

  // Deep clean object for API submission
  static cleanObject<T>(obj: any): T {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanObject(item)) as T;
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          cleaned[key] = this.sanitizeText(value);
        } else {
          cleaned[key] = this.cleanObject(value);
        }
      }
      return cleaned;
    }
    
    if (typeof obj === 'string') {
      return this.sanitizeText(obj) as T;
    }
    
    return obj;
  }

  // Password strength validator
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
      return { isValid: false, score: 0, feedback: ['Password is required'] };
    }

    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    return {
      isValid: score >= 4 && password.length >= 8,
      score,
      feedback
    };
  }

  // Session security helpers
  static isSessionExpired(timestamp: number, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    return Date.now() - timestamp > maxAge;
  }

  static rotateSessionToken(): string {
    return this.generateCsrfToken();
  }
}

// React Hook for form validation
export const useSecureForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});

  const validateField = (name: keyof T, value: any): string | undefined => {
    // Basic validation - extend as needed
    if (typeof value === 'string' && value.trim() === '') {
      return 'This field is required';
    }

    if (name.toString().includes('email') && !SecurityUtils.isValidEmail(value)) {
      return 'Please enter a valid email address';
    }

    if (name.toString().includes('phone') && !SecurityUtils.isValidPhone(value)) {
      return 'Please enter a valid phone number';
    }

    return undefined;
  };

  const setValue = (name: keyof T, value: any) => {
    const sanitizedValue = typeof value === 'string' ? SecurityUtils.sanitizeText(value) : value;
    setValues(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const [key, value] of Object.entries(values)) {
      const error = validateField(key as keyof T, value);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    setValue,
    validate,
    reset,
    hasErrors: Object.keys(errors).length > 0
  };
};

export default SecurityUtils;
