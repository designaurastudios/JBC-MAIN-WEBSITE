import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { FadeIn } from '../ui/FadeIn';

export function AboutPreview() {
  const highlights = [
    "Residential, commercial & civil construction plumbing",
    "Pressure-tested piping networks and leak prevention",
    "Practical engineering solutions built for long-term durability"
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-offwhite relative overflow-hidden border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <FadeIn delay={0.1}>
              <div className="relative rounded-lg overflow-hidden border border-brand-border shadow-card bg-white">
                <img
                  src="/images/construction-piping.jpg"
                  alt="Construction plumbing and pipeline engineering by Jai Bhavani Constructions"
                  className="w-full h-[320px] sm:h-[380px] object-cover"
                  loading="lazy"
                />
                <div className="p-4 bg-white border-t border-brand-border flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-heading">Engineered Plumbing</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-navy text-white">
                    Contractor Standards
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Clean, Minimal Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <FadeIn>
              <SectionHeading
                label="WHO WE ARE"
                title="Plumbing expertise with dependable workmanship."
                subtitle="Jai Bhavani Constructions delivers practical, high-quality plumbing solutions for residential, commercial and construction requirements — from installation and repairs to complete infrastructure."
                className="mb-4"
              />

              <div className="space-y-2.5 pt-1">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-brand-navy text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-brand-water" />
                    </div>
                    <span className="text-sm sm:text-base text-brand-heading font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  to="/about"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  className="text-xs tracking-wider uppercase font-semibold"
                >
                  Learn More About Us
                </Button>
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  );
}
