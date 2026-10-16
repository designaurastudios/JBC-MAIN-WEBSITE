import React from 'react';
import { cn } from '../../utils/cn';

export function Select({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  required = false,
  error,
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

      <div className="relative">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            'w-full h-11 pl-4 pr-10 bg-white border rounded-xl text-sm text-brand-heading transition-all focus:outline-none focus:border-brand-water focus:ring-2 focus:ring-brand-water/20 appearance-none cursor-pointer shadow-xs',
            !value && 'text-brand-muted/70',
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
              : 'border-brand-border hover:border-brand-water/50',
            disabled && 'bg-brand-offwhite cursor-not-allowed opacity-70'
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-brand-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const labelText = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val} className="text-brand-heading py-1">
                {labelText}
              </option>
            );
          })}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-brand-slate">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-semibold flex items-center gap-1">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
