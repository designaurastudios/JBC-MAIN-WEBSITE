import React from 'react';
import { FaMapMarkerAlt, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

export function ProjectCard({ project, className = '' }) {
  return (
    <div className={cn(
      'group bg-white border border-brand-border/80 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-brand-steel hover:shadow-card',
      className
    )}>
      <div>
        {/* Project Header Container */}
        {project.hasCustomImage ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy-dark">
            <img
              src={project.image}
              alt={`${project.name} - Plumbing Project in ${project.location}, Mumbai`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Location Badge */}
            <div className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-bold tracking-wider flex items-center gap-1.5 shadow-xs">
              <FaMapMarkerAlt className="w-2.5 h-2.5 text-brand-water" />
              <span>{project.location}</span>
            </div>
          </div>
        ) : (
          /* Cards without live photo: Sleek Society Name Banner with Fade Effect */
          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0a182c] via-[#10243e] to-[#081322] border-b border-brand-border/60 flex flex-col justify-between p-4 group-hover:border-brand-steel transition-colors">
            {/* Ambient subtle glow & grid */}
            <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-water/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-slate/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top Bar with Location */}
            <div className="relative z-10 flex items-center justify-start">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider border border-white/10">
                <FaMapMarkerAlt className="w-2.5 h-2.5 text-brand-water" />
                <span>{project.location}</span>
              </span>
            </div>

            {/* Center: Society Name with Fade Glow Effect */}
            <div className="relative z-10 my-auto text-center px-2 py-1">
              <span className="block text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight leading-snug group-hover:from-white group-hover:via-brand-water group-hover:to-brand-beige transition-all duration-300">
                {project.name}
              </span>
              <span className="block text-[11px] font-medium text-brand-beige/70 uppercase tracking-widest mt-1">
                Mumbai Plumbing Project
              </span>
            </div>

            {/* Subtle bottom accent line */}
            <div className="relative z-10 h-0.5 w-12 mx-auto bg-gradient-to-r from-transparent via-brand-water/60 to-transparent rounded-full group-hover:w-24 transition-all duration-300"></div>
          </div>
        )}

        {/* Project Details */}
        <div className="p-5">
          <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1 font-semibold uppercase tracking-wider">
            <span>{project.location}, Mumbai</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-brand-heading mb-2 group-hover:text-brand-water transition-colors">
            {project.name}
          </h3>

          {/* Simple 2-line Work Overview */}
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-3.5">
            {project.description}
          </p>

          {/* Client Satisfaction Tag */}
          {project.tag && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold">
              <FaCheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{project.tag}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action */}
      <div className="px-5 py-3 border-t border-brand-border-light bg-brand-offwhite/40 flex items-center justify-between mt-2">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
          project.status === 'Ongoing'
            ? 'bg-amber-100 text-amber-800'
            : project.status === 'Yet to Start'
            ? 'bg-sky-100 text-sky-800'
            : 'bg-emerald-100 text-emerald-800'
        }`}>
          {project.status || 'Completed Work'}
        </span>
        <Link
          to="/request-a-quote"
          state={{ projectScope: `${project.name} (${project.location})` }}
          className="inline-flex items-center text-xs font-bold text-brand-navy hover:text-brand-water transition-colors gap-1.5"
        >
          <span>Get Quote for Similar Work</span>
          <FaArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );
}
