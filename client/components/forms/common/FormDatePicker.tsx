"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { FieldError } from "react-hook-form";

interface FormDatePickerProps {
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  /** earliest year selectable (defaults to currentYear - 120) */
  minYear?: number;
  /** latest year selectable (defaults to currentYear) */
  maxYear?: number;
  /** when true, disables all future dates */
  disableFuture?: boolean;
}

/**
 * Reusable date picker form component with calendar popover
 */
export const FormDatePicker = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  placeholder = "Pick a date",
  disabled,
  id,
  name,
  minYear,
  maxYear,
  disableFuture = true,
}: FormDatePickerProps) => {
  const fieldId = id || name;
  const today = new Date();
  const computedMaxYear = maxYear ?? today.getFullYear();
  const computedMinYear = minYear ?? computedMaxYear - 120; // sensible default for DOB

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={fieldId} className="block text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={fieldId}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              error && "border-destructive"
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${fieldId}-error`
                : helperText
                ? `${fieldId}-helper`
                : undefined
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            // Show separate month and year dropdowns for better UX
            captionLayout="dropdown"
            fromYear={computedMinYear}
            toYear={computedMaxYear}
            disabled={(date) => (disableFuture ? date > today : false)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      {helperText && !error && (
        <p id={`${fieldId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormDatePicker;
