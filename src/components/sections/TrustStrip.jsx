import React from 'react';
import { FaHome, FaTools, FaShieldAlt, FaAward } from 'react-icons/fa';

const trustItems = [
  { text: "Flats & Bathrooms", icon: FaHome, desc: "Turnkey renovation" },
  { text: "Building Contracts", icon: FaTools, desc: "Pipeline infrastructure" },
  { text: "Direct Society Rates", icon: FaShieldAlt, desc: "No middleman costs" },
  { text: "Serving All Over Mumbai", icon: FaAward, desc: "Western, Central & South" },
];

export function TrustStrip() {
  return (
    <section className="bg-brand-navy-dark border-t border-b border-brand-slate/30 text-white py-6 sm:py-8 relative z-20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-water/40 hover:bg-white/10 transition-all duration-200 group cursor-default shadow-xs"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-navy border border-brand-slate/60 flex items-center justify-center text-brand-water shrink-0 shadow-xs group-hover:border-brand-water/50 group-hover:bg-brand-water group-hover:text-white transition-all">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="overflow-hidden min-w-0">
                  <span className="block text-xs sm:text-sm font-bold text-white tracking-tight leading-tight truncate">
                    {item.text}
                  </span>
                  <span className="block text-[11px] sm:text-xs text-brand-beige/70 leading-none mt-1 truncate">
                    {item.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
