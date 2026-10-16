import React from 'react';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import { cn } from '../../utils/cn';

export function TestimonialCard({ testimonial, className = '' }) {
  return (
    <div className={cn(
      'bg-white border border-brand-border/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:border-brand-steel hover:shadow-card relative',
      className
    )}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-0.5" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={cn(
                  "w-3.5 h-3.5",
                  i < testimonial.rating 
                    ? "text-amber-400" 
                    : "text-brand-border"
                )} 
              />
            ))}
          </div>
          <FaQuoteRight className="w-4 h-4 text-brand-beige shrink-0" />
        </div>

        <p className="text-xs sm:text-sm text-brand-heading leading-relaxed mb-4 italic">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="pt-3 border-t border-brand-border-light flex items-center justify-between">
        <h4 className="text-sm font-bold text-brand-heading">
          {testimonial.clientName}
        </h4>
      </div>
    </div>
  );
}
