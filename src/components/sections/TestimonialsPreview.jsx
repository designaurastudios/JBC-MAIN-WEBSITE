import React from 'react';
import { testimonials } from '../../data/testimonials';
import { SectionHeading } from '../ui/SectionHeading';
import { TestimonialCard } from '../ui/TestimonialCard';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

export function TestimonialsPreview() {
  // Show 2 highlighted testimonials for a cleaner layout
  const featured = testimonials.slice(0, 2);

  return (
    <section className="py-16 sm:py-20 bg-brand-offwhite border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <SectionHeading
              label="CLIENT REVIEWS"
              title="What our clients say"
              subtitle="Feedback from project managers, developers, and property owners."
              className="mb-0"
            />

            <div className="shrink-0">
              <Button
                to="/testimonials"
                variant="outline"
                size="md"
                icon={ArrowRight}
                className="text-xs tracking-wider uppercase font-semibold"
              >
                View Testimonials
              </Button>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.1}>
              <TestimonialCard testimonial={item} className="h-full" />
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
