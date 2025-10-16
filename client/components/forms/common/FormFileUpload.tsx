"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { FieldError } from "react-hook-form";

interface FormFileUploadProps {
  label: string;
  value?: File | string;
  onChange: (file: File | null) => void;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
  accept?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  maxSize?: number; // in MB
}

/**
 * Reusable file upload form component
 */
export const FormFileUpload = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  accept = "image/*,.pdf",
  disabled,
  id,
  name,
  maxSize = 5, // 5MB default
}: FormFileUploadProps) => {
  const fieldId = id || name;
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    onChange(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getFileName = () => {
    if (value instanceof File) {
      return value.name;
    }
    if (typeof value === "string") {
      return value.split("/").pop() || "File";
    }
    return null;
  };

  const getFileSize = () => {
    if (value instanceof File) {
      const sizeInKB = value.size / 1024;
      if (sizeInKB < 1024) {
        return `${sizeInKB.toFixed(2)} KB`;
      }
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    }
    return null;
  };

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={fieldId} className="block text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className={cn("space-y-3", disabled && "opacity-50")}>
        {/* File Input */}
        <Input
          ref={inputRef}
          id={fieldId}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className={cn(
            "cursor-pointer file:cursor-pointer",
            error && "border-destructive",
            value && "hidden"
          )}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${fieldId}-error`
              : helperText
              ? `${fieldId}-helper`
              : undefined
          }
        />

        {/* Upload Button (shown when no file) */}
        {!value && (
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="w-full"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        )}

        {/* File Preview/Info */}
        {value && (
          <div className="border rounded-md p-4 space-y-3">
            {preview ? (
              <div className="relative w-full h-48 bg-muted rounded-md overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getFileName()}
                  </p>
                  {getFileSize() && (
                    <p className="text-xs text-muted-foreground">
                      {getFileSize()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="w-full"
            >
              <XIcon className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
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

export default FormFileUpload;
