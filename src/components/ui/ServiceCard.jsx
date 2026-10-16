import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { FaWhatsapp, FaCheck, FaStar, FaArrowRight } from 'react-icons/fa';
import { companyInfo } from '../../data/companyInfo';

export function ServiceCard({ service, className = '' }) {
  return (
    <div 
      className={cn(
        'group relative bg-white border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-elevated hover:-translate-y-1',
        service.isPopular 
          ? 'border-amber-400 shadow-card ring-1 ring-amber-400/40' 
          : 'border-brand-border/90 hover:border-brand-steel',
        className
      )}
    >
      <div>
        {/* Service Image Container */}
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-slate/10">
          <img
            src={service.image}
            alt={`${service.title} - Jai Bhavani Constructions Mumbai`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/75 via-transparent to-transparent"></div>

          {/* Badge */}
          {service.badge && (
            <div className={cn(
              'absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5',
              service.isPopular 
                ? 'bg-amber-500 text-white' 
                : 'bg-brand-navy/90 backdrop-blur-sm text-white border border-white/20'
            )}>
              {service.isPopular && <FaStar className="w-3 h-3 text-white" />}
              <span>{service.badge}</span>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {service.title}
            </h3>
            {service.subtitle && (
              <p className="text-xs text-brand-beige font-medium line-clamp-1 drop-shadow-sm">
                {service.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-brand-text-body leading-relaxed font-normal">
            {service.description}
          </p>

          {/* Bullet Items */}
          <div className="pt-2 border-t border-brand-border-light">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate mb-2.5">
              What We Do:
            </h4>
            <ul className="space-y-2">
              {service.items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-heading">
                  <FaCheck className="w-3.5 h-3.5 text-brand-water shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 sm:p-6 pt-0 flex items-center gap-2.5">
        <Link
          to="/request-a-quote"
          state={{ defaultService: service.title }}
          className="flex-1 py-2.5 px-3.5 text-center rounded-lg bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          Get Quote
        </Link>
        <a
          href={`https://wa.me/919987443006?text=Hello%20Jai%20Bhavani%20Constructions,%20I%20am%20interested%20in%20your%20${encodeURIComponent(service.title)}%20services%20in%20Mumbai.`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
