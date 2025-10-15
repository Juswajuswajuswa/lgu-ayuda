"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FieldError } from "react-hook-form";

interface MultiSelectOption {
  label: string;
  value: string;
  description?: string;
}

interface FormMultiSelectProps {
  label: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  maxSelections?: number;
}

/**
 * Reusable multi-select form component with checkboxes
 */
export const FormMultiSelect = ({
  label,
  options,
  value = [],
  onChange,
  error,
  helperText,
  required,
  disabled,
  id,
  name,
  maxSelections,
}: FormMultiSelectProps) => {
  const fieldId = id || name;

  const handleToggle = (optionValue: string) => {
    const currentValues = value || [];
    const isSelected = currentValues.includes(optionValue);

    if (isSelected) {
      // Remove from selection
      onChange(currentValues.filter((v) => v !== optionValue));
    } else {
      // Add to selection (check max limit)
      if (maxSelections && currentValues.length >= maxSelections) {
        return; // Don't add if max reached
      }
      onChange([...currentValues, optionValue]);
    }
  };

  const isChecked = (optionValue: string) => {
    return (value || []).includes(optionValue);
  };

  const selectedCount = (value || []).length;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldId} className="block text-sm">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {maxSelections && (
          <span className="text-xs text-muted-foreground">
            {selectedCount}/{maxSelections} selected
          </span>
        )}
      </div>

      <div
        className={cn(
          "border rounded-md p-4 space-y-3 min-h-[100px] max-h-[300px] overflow-y-auto",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${fieldId}-error`
            : helperText
            ? `${fieldId}-helper`
            : undefined
        }
      >
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No options available
          </p>
        ) : (
          options.map((option) => (
            <div
              key={option.value}
              className="flex items-start space-x-3 p-2 hover:bg-muted rounded-md transition-colors"
            >
              <Checkbox
                id={`${fieldId}-${option.value}`}
                checked={isChecked(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
                disabled={
                  disabled ||
                  (!isChecked(option.value) &&
                    maxSelections !== undefined &&
                    selectedCount >= maxSelections)
                }
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${fieldId}-${option.value}`}
                  className="font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

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

export default FormMultiSelect;
