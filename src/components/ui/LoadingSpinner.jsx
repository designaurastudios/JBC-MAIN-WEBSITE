import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function LoadingSpinner({ size = 'md', className = '', label = 'Loading content...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-8 gap-3', className)} role="status">
      <Loader2 className={cn('animate-spin text-brand-water', sizes[size])} />
      {label && <span className="text-xs font-semibold tracking-wider text-brand-muted uppercase">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}
