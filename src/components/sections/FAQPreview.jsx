import React from 'react';
import { faqData } from '../../data/faq';
import { SectionHeading } from '../ui/SectionHeading';
import { FAQItem } from '../ui/FAQItem';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

export function FAQPreview() {
  // Show top 4 essential questions on preview
  const previewFaqs = faqData.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Heading & Support */}
          <div className="lg:col-span-5 space-y-5">
            <FadeIn>
              <SectionHeading
                label="FAQ"
                title="Frequently Asked Questions"
                subtitle="Clear answers to common questions about our plumbing services, timelines, materials, and quotations."
                className="mb-0"
              />

              <div className="pt-4">
                <Button
                  to="/faq"
                  variant="outline"
                  size="md"
                  icon={ArrowRight}
                  className="text-xs tracking-wider uppercase font-semibold"
                >
                  View All FAQs
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
            {previewFaqs.map((faq, index) => (
              <FadeIn key={faq.id} delay={index * 0.06}>
                <FAQItem 
                  faq={faq} 
                  defaultOpen={index === 0} 
                />
              </FadeIn>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
