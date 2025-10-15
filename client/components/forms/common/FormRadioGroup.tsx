"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { FieldError } from "react-hook-form";

interface RadioOption {
  label: string;
  value: string;
}

interface FormRadioGroupProps {
  label: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
}

/**
 * Reusable radio group form component
 */
export const FormRadioGroup = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  id,
  name,
}: FormRadioGroupProps) => {
  const fieldId = id || name;

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={fieldId} className="block text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(error && "border-destructive")}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${fieldId}-error`
            : helperText
            ? `${fieldId}-helper`
            : undefined
        }
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`${fieldId}-${option.value}`}
            />
            <Label
              htmlFor={`${fieldId}-${option.value}`}
              className="font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
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

export default FormRadioGroup;
