import React from 'react';
import { FaShieldAlt, FaTools, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { SectionHeading } from '../ui/SectionHeading';
import { FadeIn } from '../ui/FadeIn';

const reasons = [
  {
    icon: FaShieldAlt,
    title: "Reliable & Experienced",
    description: "Every joint, pipe, and valve is installed with precision to guarantee 100% leak-free results."
  },
  {
    icon: FaTools,
    title: "1-Stop Bathroom Renovation",
    description: "We manage the entire bathroom makeover: plumbing, tile masonry, waterproofing, and painting."
  },
  {
    icon: FaBuilding,
    title: "Direct Society Pricing",
    description: "Housing societies save high middleman contractor costs by hiring our plumbing team directly."
  },
  {
    icon: FaCheckCircle,
    title: "Tested & Certified Work",
    description: "All pipelines undergo pressure testing before handover to ensure long-term durability."
  }
];

export function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-18 bg-brand-offwhite border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <FadeIn>
          <SectionHeading
            label="WHY CHOOSE US"
            title="Why Mumbai Clients Trust Jai Bhavani Constructions"
            subtitle="Dependable workmanship, transparent pricing, and simple communication."
            align="center"
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={index} delay={index * 0.08}>
                <div className="bg-white border border-brand-border/80 rounded-xl p-6 h-full hover:border-brand-steel hover:shadow-card transition-all duration-200">
                  <div className="w-10 h-10 rounded-lg bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-water mb-3.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-base font-bold text-brand-heading mb-1.5">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-brand-text-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
