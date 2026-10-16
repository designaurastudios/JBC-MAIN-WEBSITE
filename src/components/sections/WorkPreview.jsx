import React from 'react';
import { useProjects } from '../../services/projectService';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from '../ui/ProjectCard';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

export function WorkPreview() {
  const { latestProjects } = useProjects();

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <SectionHeading
              label="PROJECTS"
              title="Completed Projects in Mumbai"
              subtitle="Real plumbing infrastructure delivered for prominent housing societies and high-rise towers."
              className="mb-0"
            />

            <div className="shrink-0">
              <Button
                to="/projects"
                variant="primary"
                size="md"
                icon={ArrowRight}
                className="text-xs tracking-wider uppercase font-bold"
              >
                View All Projects
              </Button>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProjects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.1}>
              <ProjectCard project={project} className="h-full" />
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
