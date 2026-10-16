import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Breadcrumbs({ items = [], className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs font-medium', className)}>
      <ol className="flex items-center flex-wrap gap-1.5 text-brand-muted">
        <li className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-1 hover:text-brand-navy transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-brand-water" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-brand-border shrink-0" />
              {isLast ? (
                <span className="text-brand-navy font-semibold" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.href} className="hover:text-brand-navy transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
