import React from 'react';
import { FaBuilding, FaHardHat, FaCity } from 'react-icons/fa';
import { FadeIn } from '../ui/FadeIn';

const clientCompanies = [
  { name: 'Dhruvi Engineers and Civil Contractor', type: 'Engineering & Civil Contracting', icon: FaHardHat },
  { name: 'Hetcon LLP', type: 'Engineering & Construction', icon: FaBuilding },
  { name: 'Paintora', type: 'Turnkey Civil & Finishing', icon: FaCity },
  { name: 'Rudra Structural Repairs', type: 'Structural & Pipeline Overhauls', icon: FaHardHat },
  { name: 'Rangshalakaa', type: 'Architectural & Interiors', icon: FaCity },
  { name: 'Pyramid', type: 'Builders & Developers', icon: FaBuilding },
  { name: 'Lokseva', type: 'Housing & Civil Contractors', icon: FaHardHat },
  { name: 'ST Antony', type: 'Infrastructure & Projects', icon: FaBuilding },
  { name: 'Mangal Murti Construction', type: 'Civil & Building Works', icon: FaCity },
];

export function ClientMarquee() {
  // Duplicate array for seamless infinite looping
  const marqueeList = [...clientCompanies, ...clientCompanies];

  return (
    <section className="py-12 sm:py-16 bg-brand-navy text-white relative overflow-hidden border-b border-brand-slate/40">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-brand-beige text-xs font-semibold uppercase tracking-wider mb-2">
            <span>TRUSTED CONTRACTING PARTNERS</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            Companies & Civil Contractors We Have Worked With
          </h2>

          <p className="text-xs sm:text-sm text-brand-beige/80 max-w-xl mx-auto mt-1.5 leading-relaxed">
            Trusted by registered civil contractors, engineering firms, and housing societies for turnkey plumbing execution across Mumbai.
          </p>
        </FadeIn>
      </div>

      {/* Infinite Scrolling Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Shadows for seamless fade effect */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-brand-navy to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-brand-navy to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Track */}
        <div className="animate-marquee py-2 flex items-center gap-4 sm:gap-6">
          {marqueeList.map((company, index) => {
            const Icon = company.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#091e30] border border-brand-slate/60 hover:border-brand-water shadow-sm transition-colors duration-150 shrink-0 group cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-slate/50 border border-brand-slate/60 flex items-center justify-center text-brand-water group-hover:bg-brand-water group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-brand-water transition-colors">
                    {company.name}
                  </h4>
                  <span className="text-[11px] text-brand-beige/70 block leading-tight">
                    {company.type}
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
