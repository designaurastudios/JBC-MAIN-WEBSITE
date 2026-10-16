import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { cn } from '../../utils/cn';

export function PageHero({
  title,
  description,
  breadcrumbs = [],
  className = '',
}) {
  const pageTitle = title || (breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : '');

  return (
    <section className={cn(
      'relative overflow-hidden bg-[#071827] text-white border-b border-brand-slate/30',
      'flex flex-col justify-center items-center text-center',
      'pt-[84px] sm:pt-[88px] lg:pt-[116px] pb-5 sm:pb-5 lg:pb-6 px-4',
      className
    )}>
      {/* Hidden H1 for SEO and Screen Readers */}
      {pageTitle && <h1 className="sr-only">{pageTitle}</h1>}

      {/* Background Image - clearly visible */}
      <img 
        src="/images/page-header-bg.jpg" 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Blue Navy Fade Overlay */}
      <div className="absolute inset-0 bg-[#071a2e]/70 backdrop-blur-[0.5px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#04101d]/90 via-[#07213d]/60 to-[#04101d]/90"></div>
      
      {/* Top & Bottom Subtle Edge Fades */}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#04101d]/80 to-transparent pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#04101d]/80 to-transparent pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Centered Breadcrumb Pill Only */}
        {breadcrumbs.length > 0 && (
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-[#030d17]/75 backdrop-blur-md border border-white/20 shadow-md text-xs sm:text-sm">
            <Breadcrumbs 
              items={breadcrumbs} 
              className="[&_ol]:text-brand-beige/90 [&_span]:text-white [&_span]:font-bold [&_a]:text-brand-beige [&_a:hover]:text-white text-xs sm:text-sm [&_svg]:text-amber-400" 
            />
          </div>
        )}
      </div>
    </section>
  );
}

