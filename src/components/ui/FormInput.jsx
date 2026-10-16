import React from 'react';
import { cn } from '../../utils/cn';

export function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-xs font-bold uppercase tracking-wider text-brand-heading mb-1.5"
        >
          {label} {required && <span className="text-red-500 font-extrabold">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
        className={cn(
          'w-full h-11 px-4 bg-white border rounded-xl text-sm text-brand-heading placeholder:text-brand-muted/60 transition-all focus:outline-none focus:border-brand-water focus:ring-2 focus:ring-brand-water/20 shadow-xs',
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
            : 'border-brand-border hover:border-brand-water/50',
          disabled && 'bg-brand-offwhite cursor-not-allowed opacity-70'
        )}
        {...props}
      />

      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p id={`${name}-helper`} className="mt-1 text-xs text-brand-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
