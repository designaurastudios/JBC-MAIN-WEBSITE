import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { FileSearch, Compass, Wrench, CheckCircle2 } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

const steps = [
  {
    number: "01",
    title: "Understand",
    description: "We understand the project, plumbing requirement and site conditions.",
    icon: FileSearch
  },
  {
    number: "02",
    title: "Plan",
    description: "We identify the right plumbing approach, materials and execution requirements.",
    icon: Compass
  },
  {
    number: "03",
    title: "Execute",
    description: "Our team carries out the plumbing work with attention to practical installation and workmanship.",
    icon: Wrench
  },
  {
    number: "04",
    title: "Complete",
    description: "We inspect the completed work and ensure the required plumbing solution is properly delivered.",
    icon: CheckCircle2
  }
];

export function ProcessSection() {
  return (
    <section className="py-16 sm:py-20 bg-brand-navy-dark text-white relative overflow-hidden border-b border-brand-slate/40">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <FadeIn>
          <SectionHeading
            label="HOW WE WORK"
            title="Structured execution from planning to handover"
            subtitle="Our systematic workflow ensures high precision and reliable plumbing installations."
            align="center"
            theme="dark"
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <FadeIn key={index} delay={index * 0.08}>
                <div className="bg-brand-navy/80 border border-brand-slate/60 rounded-md p-6 h-full flex flex-col justify-between hover:border-brand-water transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-black text-brand-beige/40">
                        {step.number}
                      </span>
                      <div className="w-8 h-8 rounded bg-brand-slate/50 border border-brand-slate flex items-center justify-center text-brand-water">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-brand-beige/85 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-slate/50 text-[11px] text-brand-water font-semibold uppercase tracking-wider">
                    Phase {index + 1}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
