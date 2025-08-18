import React, { useState, useEffect } from "react";
import {
  useForm,
  useController,
  Control,
  FieldValues,
  Path,
} from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "./icons";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "../../lib/utils";
import SecurityUtils from "../../lib/security";

interface EnhancedInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  icon?: React.ComponentType<{ className?: string }>;
  rightElement?: React.ReactNode;
  helperText?: string;
  validateOnBlur?: boolean;
  rules?: any;
  className?: string;
}

export function EnhancedInput<T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  icon: Icon,
  rightElement,
  helperText,
  validateOnBlur = true,
  rules = {},
  className,
}: EnhancedInputProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label} is required` : false,
      validate: (value) => {
        if (type === "email" && value && !SecurityUtils.isValidEmail(value)) {
          return "Please enter a valid email address";
        }
        return true;
      },
      ...rules,
    },
  });

  const hasError = error && (isTouched || !validateOnBlur);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        {/* Label */}
        <label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            hasError ? "text-destructive" : "text-foreground",
            disabled && "text-muted-foreground",
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>

        {/* Input Container */}
        <div className="relative mt-1">
          {/* Left Icon */}
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  hasError
                    ? "text-destructive"
                    : isFocused
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              />
            </div>
          )}

          {/* Input Field */}
          <motion.input
            id={name}
            type={inputType}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            className={cn(
              "block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
              Icon && "pl-10",
              (isPassword || rightElement) && "pr-10",
              hasError &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            {...field}
            onFocus={() => {
              setIsFocused(true);
              field.onBlur();
            }}
            onBlur={() => {
              setIsFocused(false);
              field.onBlur();
            }}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />

          {/* Right Element / Password Toggle */}
          {(isPassword || rightElement) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Icons.eyeOff className="h-5 w-5" />
                  ) : (
                    <Icons.eye className="h-5 w-5" />
                  )}
                </button>
              ) : (
                rightElement
              )}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        <AnimatePresence mode="wait">
          {(hasError || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-1"
            >
              {hasError ? (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <Icons.alert className="h-4 w-4" />
                  {error.message}
                </div>
              ) : helperText ? (
                <p className="text-sm text-muted-foreground">{helperText}</p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface EnhancedTextareaProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  helperText?: string;
  rules?: any;
  className?: string;
}

export function EnhancedTextarea<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 3,
  maxLength,
  helperText,
  rules = {},
  className,
}: EnhancedTextareaProps<T>) {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label} is required` : false,
      maxLength: maxLength
        ? {
            value: maxLength,
            message: `${label} must be ${maxLength} characters or less`,
          }
        : undefined,
      ...rules,
    },
  });

  useEffect(() => {
    setCharCount(field.value?.length || 0);
  }, [field.value]);

  const hasError = error && isTouched;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            hasError ? "text-destructive" : "text-foreground",
            disabled && "text-muted-foreground",
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {maxLength && (
          <span
            className={cn(
              "text-xs transition-colors duration-200",
              charCount > maxLength * 0.9
                ? "text-warning"
                : "text-muted-foreground",
              charCount >= maxLength && "text-destructive",
            )}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <motion.textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={cn(
          "block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200 resize-none",
          hasError &&
            "border-destructive focus:border-destructive focus:ring-destructive/20",
          disabled && "cursor-not-allowed opacity-50",
        )}
        {...field}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          field.onBlur();
        }}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence mode="wait">
        {(hasError || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {hasError ? (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <Icons.alert className="h-4 w-4" />
                {error.message}
              </div>
            ) : helperText ? (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EnhancedSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  helperText?: string;
  rules?: any;
  className?: string;
}

export function EnhancedSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = "Select an option...",
  required = false,
  disabled = false,
  multiple = false,
  searchable = false,
  helperText,
  rules = {},
  className,
}: EnhancedSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    field,
    fieldState: { error, isTouched },
  } = useController({
    name,
    control,
    rules: {
      required: required ? `${label} is required` : false,
      ...rules,
    },
  });

  const hasError = error && isTouched;
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const selectedOptions =
    multiple && Array.isArray(field.value)
      ? options.filter((option) => field.value.includes(option.value))
      : options.filter((option) => option.value === field.value);

  const handleSelect = (value: string) => {
    if (multiple) {
      const currentValues = Array.isArray(field.value) ? field.value : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      field.onChange(newValues);
    } else {
      field.onChange(value);
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={name}
        className={cn(
          "block text-sm font-medium transition-colors duration-200",
          hasError ? "text-destructive" : "text-foreground",
          disabled && "text-muted-foreground",
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between text-left font-normal",
            hasError && "border-destructive",
            !field.value && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {multiple && selectedOptions.length > 0 ? (
              <div className="flex gap-1 flex-wrap">
                {selectedOptions.slice(0, 2).map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                  >
                    {option.label}
                  </Badge>
                ))}
                {selectedOptions.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedOptions.length - 2} more
                  </Badge>
                )}
              </div>
            ) : (
              selectedOptions[0]?.label || placeholder
            )}
          </span>
          <Icons.chevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b">
                  <div className="relative">
                    <Icons.search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              <div className="max-h-48 overflow-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = multiple
                      ? Array.isArray(field.value) &&
                        field.value.includes(option.value)
                      : field.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={option.disabled}
                        onClick={() => handleSelect(option.value)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none",
                          "transition-colors duration-150",
                          isSelected && "bg-primary text-primary-foreground",
                          option.disabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {isSelected && <Icons.check className="h-4 w-4" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {(hasError || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {hasError ? (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <Icons.alert className="h-4 w-4" />
                {error.message}
              </div>
            ) : helperText ? (
              <p className="text-sm text-muted-foreground">{helperText}</p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
