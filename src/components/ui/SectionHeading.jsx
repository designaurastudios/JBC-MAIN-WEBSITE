import React from 'react';
import { cn } from '../../utils/cn';

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'left', // 'left' | 'center'
  theme = 'light', // 'light' (on light bg) | 'dark' (on dark navy bg)
  className = '',
  titleClassName = '',
}) {
  const isCentered = align === 'center';
  const isDark = theme === 'dark';

  return (
    <div className={cn('max-w-3xl mb-10 md:mb-14', isCentered && 'mx-auto text-center', className)}>
      {label && (
        <div className={cn(
          'inline-flex items-center gap-2 px-3 py-1 mb-3.5 text-xs font-semibold tracking-label uppercase rounded border',
          isDark 
            ? 'text-brand-beige border-brand-slate bg-brand-navy-dark/60' 
            : 'text-brand-slate border-brand-border bg-brand-beige/25'
        )}>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-water"></span>
          <span>{label}</span>
        </div>
      )}
      
      <h2 className={cn(
        'text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight',
        isDark ? 'text-white' : 'text-brand-heading',
        titleClassName
      )}>
        {title}
      </h2>

      {subtitle && (
        <p className={cn(
          'mt-3.5 text-base sm:text-lg leading-relaxed font-normal',
          isDark ? 'text-brand-beige/80' : 'text-brand-text-body'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
