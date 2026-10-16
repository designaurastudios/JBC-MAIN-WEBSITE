import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Alert({ 
  type = 'info', // 'success' | 'error' | 'info' | 'warning'
  title, 
  message, 
  onClose, 
  className = '' 
}) {
  const styles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    error: 'bg-red-50 border-red-300 text-red-950',
    warning: 'bg-amber-50 border-amber-300 text-amber-950',
    info: 'bg-blue-50 border-blue-200 text-blue-950',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-brand-water shrink-0 mt-0.5" />,
  };

  return (
    <div className={cn('border rounded-md p-4 flex items-start justify-between gap-3 text-sm shadow-subtle', styles[type], className)} role="alert">
      <div className="flex items-start gap-3">
        {icons[type]}
        <div>
          {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
          <div className="leading-relaxed opacity-95">{message}</div>
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          type="button"
          className="text-gray-400 hover:text-gray-700 p-1 -mr-1 -mt-1 rounded"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
