import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const showcaseBuildings = [
  { name: 'Ekta Terrace', img: '/images/projects/ekta-terrace.jpg' },
  { name: 'New Highway Park', img: '/images/projects/new-highway-park.jpg' },
  { name: 'Upvan Tower', img: '/images/projects/upvan-tower.jpg' },
  { name: 'Bhoomi Park', img: '/images/projects/bhoomi-park.jpg' },
  { name: 'Lilac Garden', img: '/images/projects/lilac-garden.jpg' },
];

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-32 lg:pb-14 bg-brand-navy-dark text-white overflow-hidden">
      
      {/* Ultrarealistic Construction Working Background with Smooth Fade Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/hero-construction-bg.jpg"
          alt="Jai Bhavani Constructions Building Site Infrastructure"
          className="w-full h-full object-cover object-center scale-105 opacity-40 sm:opacity-45 transition-opacity duration-1000"
          loading="eager"
        />
        {/* Multi-layered cinematic gradient overlays for crystal-clear readability & smooth fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-dark/95 via-brand-navy-dark/85 to-brand-navy-dark/65"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-transparent to-brand-navy-dark/80"></div>
        <div className="absolute inset-0 bg-brand-navy-dark/30 mix-blend-multiply"></div>
      </div>

      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none z-0"></div>

      {/* Ambient Lighting & Glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-brand-water/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow z-0"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-brand-slate/20 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Main Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-2 sm:pt-4 lg:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 pt-2 sm:pt-3 lg:pt-5 xl:pt-6">
            
            {/* Location & Trust Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-water/15 border border-brand-water/30 text-cyan-200 text-xs font-semibold backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate">Plumbing & Civil Contractor • Mumbai</span>
            </div>

            {/* Bold, Clean Headline */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-black text-white tracking-tight leading-[1.14]">
              Reliable Plumbing <br className="hidden xs:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-water via-cyan-300 to-white">
                Solutions in Mumbai.
              </span>
            </h1>

            {/* Simple, Crisp Supporting Copy */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-xl leading-relaxed font-normal">
              From same-day leak repairs and complete flat bathroom renovations to housing society pipeline contracts — we deliver clean, dependable plumbing work.
            </p>

            {/* 3 Quick Capability Glass Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 text-xs">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/10 text-center sm:text-left">
                <FaCheckCircle className="text-brand-water shrink-0 text-xs sm:text-sm mt-0.5" />
                <div className="min-w-0">
                  <span className="block font-bold text-white text-[11px] sm:text-xs truncate">Small Repairs</span>
                  <span className="hidden sm:block text-[10px] text-slate-300 truncate">On-call fixes</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/10 text-center sm:text-left">
                <FaCheckCircle className="text-amber-400 shrink-0 text-xs sm:text-sm mt-0.5" />
                <div className="min-w-0">
                  <span className="block font-bold text-white text-[11px] sm:text-xs truncate">Bathrooms</span>
                  <span className="hidden sm:block text-[10px] text-slate-300 truncate">Full renovation</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 p-2.5 sm:p-3 rounded-xl bg-white/[0.07] backdrop-blur-md border border-white/10 text-center sm:text-left">
                <FaCheckCircle className="text-emerald-400 shrink-0 text-xs sm:text-sm mt-0.5" />
                <div className="min-w-0">
                  <span className="block font-bold text-white text-[11px] sm:text-xs truncate">Pipelines</span>
                  <span className="hidden sm:block text-[10px] text-slate-300 truncate">Society contracts</span>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Action CTAs (Shown ONLY on Mobile & Tablet, Hidden on PC/Desktop) */}
            <div className="flex lg:hidden items-center gap-3 pt-2 w-full max-w-md">
              <Link
                to="/request-a-quote"
                className="flex-1 py-3.5 px-4 text-center rounded-xl bg-gradient-to-r from-brand-water via-cyan-500 to-brand-water hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-water/20 transition-all inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>Request Free Quote</span>
                <span>→</span>
              </Link>
              <Link
                to="/contact"
                className="flex-1 py-3.5 px-4 text-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <span>Contact Directly</span>
              </Link>
            </div>

            {/* Flat Building Bar with Small Building Pictures */}
            <div className="pt-2">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2.5 sm:gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-brand-water/50 rounded-full pl-2 pr-4 py-1.5 transition-all duration-300 group shadow-md"
                title="View completed building projects across Mumbai"
              >
                {/* Overlapping Small Building Picture Avatars */}
                <div className="flex -space-x-2 items-center">
                  {showcaseBuildings.map((building, idx) => (
                    <img
                      key={idx}
                      src={building.img}
                      alt={building.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-brand-navy-dark ring-1 ring-white/20 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ))}
                </div>

                {/* Building Bar Text Info */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white tracking-tight">50+ Completed Societies</span>
                  <span className="text-brand-water hidden sm:inline">•</span>
                  <span className="text-slate-200 text-[11px] hidden sm:inline">Delivered Across Mumbai</span>
                  <span className="text-cyan-400 text-xs font-bold ml-0.5 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            </div>

          </div>

          {/* Right Hero Column: 3D Animating Building Cutaway Element (Visible ONLY on Desktop, Hidden on Mobile & Tablet) */}
          <div className="hidden lg:flex lg:col-span-5 relative items-center justify-center pt-4 lg:pt-8 xl:pt-12 translate-y-2 lg:translate-y-6 xl:translate-y-8">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-water/20 via-cyan-400/15 to-transparent rounded-full blur-2xl pointer-events-none animate-pulse-glow"></div>

            {/* 3D Transparent Building PNG with Smooth Floating Animation */}
            <div className="relative z-10 flex items-center justify-center">
              <img
                src="/images/hero-3d-building.png"
                alt="3D Building Plumbing Infrastructure Cutaway"
                className="w-72 sm:w-88 md:w-96 lg:w-full max-w-[440px] xl:max-w-[480px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] animate-float-3d"
                loading="eager"
                decoding="async"
              />
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
