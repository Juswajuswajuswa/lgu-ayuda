import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
}

/**
 * Reusable form textarea component with label and error display
 */
export const FormTextarea = ({
  label,
  error,
  helperText,
  required,
  className,
  id,
  ...props
}: FormTextareaProps) => {
  const fieldId = id || props.name;

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={fieldId} className="block text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
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

export default FormTextarea;
