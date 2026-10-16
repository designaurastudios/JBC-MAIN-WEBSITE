import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'water' | 'ghost' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconPosition = 'right',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-water focus-visible:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-brand-navy hover:bg-brand-navy-dark text-white shadow-subtle hover:shadow-card active:translate-y-px',
    secondary: 'bg-brand-slate hover:bg-brand-navy text-white shadow-subtle',
    water: 'bg-brand-water hover:bg-brand-water-dark text-white shadow-subtle hover:shadow-card active:translate-y-px',
    outline: 'border border-brand-border hover:border-brand-navy text-brand-navy bg-transparent hover:bg-brand-navy/5',
    outlineWhite: 'border border-white/40 hover:border-white text-white bg-transparent hover:bg-white/10',
    dark: 'bg-brand-navy-dark hover:bg-black text-white shadow-subtle',
    ghost: 'text-brand-navy hover:bg-brand-navy/5 bg-transparent',
    taupe: 'bg-brand-taupe hover:bg-brand-steel text-white shadow-subtle',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs tracking-wider uppercase font-semibold gap-1.5',
    md: 'px-5 py-2.5 text-sm font-medium gap-2',
    lg: 'px-7 py-3.5 text-base font-medium gap-2.5',
  };

  const content = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current mr-1.5" />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  const combinedClass = cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.md, className);

  if (to) {
    return (
      <Link to={to} className={combinedClass} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClass} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClass}
      {...props}
    >
      {content}
    </button>
  );
}
