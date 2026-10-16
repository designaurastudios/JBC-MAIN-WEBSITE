import React from 'react';
import { primaryServices } from '../../data/services';
import { SectionHeading } from '../ui/SectionHeading';
import { ServiceCard } from '../ui/ServiceCard';
import { Button } from '../ui/Button';
import { ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';
import { companyInfo } from '../../data/companyInfo';

export function ServicesPreview() {
  return (
    <section className="py-16 sm:py-20 bg-brand-offwhite border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <SectionHeading
              label="OUR CORE SERVICES"
              title="Specialized Plumbing & Renovation Solutions"
              subtitle="From single-day household repairs and full flat bathroom renovations to large-scale building construction & housing society contracts."
              className="mb-0"
            />

            <div className="shrink-0">
              <Button
                to="/services"
                variant="outline"
                size="md"
                icon={ArrowRight}
                className="text-xs tracking-wider uppercase font-semibold"
              >
                Explore Details
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* 3 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {primaryServices.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.1}>
              <ServiceCard service={service} className="h-full" />
            </FadeIn>
          ))}
        </div>

        {/* Direct Society & Contractor Benefit Banner */}
        <FadeIn delay={0.25}>
          <div className="mt-12 p-6 sm:p-8 rounded-lg bg-white border border-brand-border shadow-card flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-navy shrink-0">
                <ShieldCheck className="w-6 h-6 text-brand-water" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-brand-heading">
                  Direct Housing Society (CHS) Contracts & Civil Subcontracts
                </h4>
                <p className="text-xs sm:text-sm text-brand-text-body max-w-3xl leading-relaxed">
                  Housing societies can hire us directly for plumbing riser replacements, pump overhauls, and drainage repairs to <strong>eliminate middleman commissions and save significant project costs</strong>. We also partner with registered civil contractors for turnkey building installations.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
              <Button
                to="/request-a-quote"
                variant="water"
                size="md"
                className="w-full sm:w-auto text-xs tracking-wider uppercase font-semibold"
              >
                Request Quotation
              </Button>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
