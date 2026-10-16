import React, { useState } from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { ProjectCard } from '../components/ui/ProjectCard';
import { projectLocations } from '../data/projects';
import { useProjects } from '../services/projectService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { FinalCTA } from '../components/sections/FinalCTA';
import { FadeIn } from '../components/ui/FadeIn';
import { cn } from '../utils/cn';
import { FaSearch, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';

export function Projects() {
  const { projects: projectsList, loading } = useProjects();
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects by location button and search query, preserving latest-first order
  const filteredProjects = projectsList
    .filter((project) => {
      const matchesLocation =
        selectedLocation === "All" ||
        project.area === selectedLocation ||
        (project.location && project.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        query === "" ||
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query));

      return matchesLocation && matchesQuery;
    });

  const breadcrumbs = [
    { name: "Projects", href: "/projects" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Completed Projects | Jai Bhavani Constructions Mumbai"
        description="Explore 50+ completed plumbing pipeline and drainage projects across housing societies and residential towers in Mumbai by Jai Bhavani Constructions."
        canonicalPath="/projects"
      />

      {/* Page Hero */}
      <PageHero
        title="Over 50+ plumbing projects delivered across Mumbai."
        description="Comprehensive plumbing overhauls, UPVC & SWR pipeline replacements, vertical risers, and drainage infrastructure executed for cooperative housing societies and high-rise towers."
        breadcrumbs={breadcrumbs}
      />

      {/* Filter & Search Bar Section */}
      <section className="py-12 sm:py-16 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Controls: Location Filters & Search Bar */}
          <FadeIn>
            <div className="space-y-4 mb-8">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by society name or area (e.g. Borivali, Dheeraj Sagar)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-lg text-xs sm:text-sm text-brand-heading placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-water focus:ring-1 focus:ring-brand-water transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-muted hover:text-brand-heading"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Location Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist">
                {projectLocations.map((location) => {
                  const isActive = selectedLocation === location;
                  const count = location === "All"
                    ? projectsList.length
                    : projectsList.filter(p => p.area === location || (p.location && p.location.toLowerCase().includes(location.toLowerCase()))).length;

                  return (
                    <button
                      key={location}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedLocation(location)}
                      className={cn(
                        'px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-water',
                        isActive 
                          ? 'bg-brand-navy text-white shadow-card' 
                          : 'bg-white text-brand-slate hover:bg-brand-beige/40 border border-brand-border hover:border-brand-steel'
                      )}
                    >
                      <FaMapMarkerAlt className={cn('w-2.5 h-2.5', isActive ? 'text-brand-water' : 'text-brand-muted')} />
                      <span>{location}</span>
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                        isActive ? 'bg-white/20 text-white' : 'bg-brand-offwhite text-brand-slate'
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status & Counter */}
              <div className="flex items-center justify-between text-xs text-brand-muted pt-1">
                <span>
                  Showing <strong className="text-brand-heading">{filteredProjects.length}</strong> completed {filteredProjects.length === 1 ? 'project' : 'projects'} in Mumbai
                </span>
                {selectedLocation !== "All" && (
                  <button
                    onClick={() => setSelectedLocation("All")}
                    className="text-brand-water font-semibold hover:underline"
                  >
                    View All Mumbai Locations
                  </button>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Loading / Grid */}
          {loading ? (
            <LoadingSpinner label="Loading projects..." />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-white border border-brand-border rounded-xl p-8">
              <FaBuilding className="w-10 h-10 text-brand-muted mx-auto mb-3 opacity-50" />
              <h3 className="text-base font-bold text-brand-heading mb-1">No Projects Found</h3>
              <p className="text-brand-muted text-xs sm:text-sm max-w-sm mx-auto mb-4">
                No matching society or project found for your search criteria.
              </p>
              <button
                onClick={() => { setSelectedLocation("All"); setSearchQuery(""); }}
                className="px-4 py-2 bg-brand-navy text-white rounded text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project, index) => (
                <FadeIn key={project.id} delay={Math.min(index * 0.04, 0.4)}>
                  <ProjectCard project={project} className="h-full" />
                </FadeIn>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA />
    </PageTransition>
  );
}

// Re-export OurWork alias for backwards compatibility
export const OurWork = Projects;
