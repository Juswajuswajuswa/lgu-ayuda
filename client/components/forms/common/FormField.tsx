import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
}

/**
 * Reusable form field component with label, input, and error display
 */
export const FormField = ({
  label,
  error,
  helperText,
  required,
  className,
  id,
  ...props
}: FormFieldProps) => {
  const fieldId = id || props.name;

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={fieldId} className="block text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={fieldId}
        className={cn(error && "border-destructive", className)}
        aria-invalid={!!error}
        aria-describedby={
          error
            ? `${fieldId}-error`
            : helperText
            ? `${fieldId}-helper`
            : undefined
        }
        {...props}
      />
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

export default FormField;
