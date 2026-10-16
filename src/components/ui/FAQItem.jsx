import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { cn } from '../../utils/cn';

export function FAQItem({ faq, defaultOpen = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div 
      className={cn(
        'border border-brand-border/80 bg-white rounded-xl overflow-hidden transition-all',
        isOpen ? 'border-brand-water/60 bg-brand-offwhite/20' : 'hover:border-brand-steel/60',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3.5 px-4 sm:px-5 flex items-center justify-between text-left gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-water"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-semibold text-brand-heading leading-snug">
          {faq.question}
        </span>
        <span className={cn(
          'w-6 h-6 rounded-md shrink-0 flex items-center justify-center bg-brand-offwhite text-brand-navy border border-brand-border/60 transition-transform duration-200 text-xs',
          isOpen && 'rotate-180 bg-brand-navy text-white border-brand-navy'
        )}>
          <FaChevronDown className="w-2.5 h-2.5" />
        </span>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-brand-text-body leading-relaxed border-t border-brand-border-light/60">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
}
