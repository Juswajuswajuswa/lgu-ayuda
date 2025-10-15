import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FieldError } from "react-hook-form";

interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Reusable form select component with label and error display
 */
export const FormSelect = ({
  label,
  name,
  options,
  placeholder = "Select an option",
  error,
  helperText,
  required,
  value,
  onValueChange,
  disabled,
}: FormSelectProps) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={name} className="block text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={name}
          className={error ? "border-destructive" : ""}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      {helperText && !error && (
        <p id={`${name}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
