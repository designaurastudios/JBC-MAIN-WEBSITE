import React from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { Hero } from '../components/sections/Hero';
import { TrustStrip } from '../components/sections/TrustStrip';
import { StatsCounter } from '../components/sections/StatsCounter';
import { ClientMarquee } from '../components/sections/ClientMarquee';
import { ServicesPreview } from '../components/sections/ServicesPreview';
import { WhyChooseUs } from '../components/sections/WhyChooseUs';
import { WorkPreview } from '../components/sections/WorkPreview';
import { ProcessSection } from '../components/sections/ProcessSection';
import { TestimonialsPreview } from '../components/sections/TestimonialsPreview';
import { FAQPreview } from '../components/sections/FAQPreview';
import { FinalCTA } from '../components/sections/FinalCTA';

export function Home() {
  return (
    <PageTransition>
      <SEO 
        title="Jai Bhavani Constructions | Plumbing Contractor Mumbai"
        description="Jai Bhavani Constructions provides reliable plumbing solutions in Mumbai: small leak repairs, flat bathroom renovations, and civil/housing society plumbing contracts."
        canonicalPath="/"
      />

      <div className="space-y-0">
        <Hero />
        <TrustStrip />
        <StatsCounter />
        <ClientMarquee />
        <ServicesPreview />
        <WhyChooseUs />
        <WorkPreview />
        <ProcessSection />
        <TestimonialsPreview />
        <FAQPreview />
        <FinalCTA />
      </div>
    </PageTransition>
  );
}
