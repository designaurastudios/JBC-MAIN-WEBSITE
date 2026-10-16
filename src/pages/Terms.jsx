import React from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { FadeIn } from '../components/ui/FadeIn';
import { companyInfo } from '../data/companyInfo';

export function Terms() {
  const breadcrumbs = [
    { name: "Terms & Conditions", href: "/terms" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Terms & Conditions | Jai Bhavani Constructions"
        description="Terms and conditions governing plumbing contracting services, quotations, and website usage for Jai Bhavani Constructions."
        canonicalPath="/terms"
      />

      <PageHero
        title="Terms & Conditions"
        description="Standard operating terms governing website usage, service estimates, and contracting agreements with Jai Bhavani Constructions."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-brand-text-body text-sm sm:text-base leading-relaxed">
          <FadeIn>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-brand-muted uppercase font-semibold">Last Updated: September 2026</p>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading mt-2">1. Agreement to Terms</h2>
                <p className="mt-1">
                  By accessing this website or requesting plumbing contracting services from <strong>{companyInfo.name}</strong>, you agree to comply with and be bound by the terms outlined herein.
                </p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading">2. Quotations & Project Estimates</h2>
                <p className="mt-1 text-sm">
                  Quotations provided via our website or after site inspections are preliminary estimations based on provided parameters and visible site conditions. Formal contracting terms and finalized bill of quantities (BoQ) are executed through formal written work orders.
                </p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading">3. Scope of Work & Site Access</h2>
                <p className="mt-1 text-sm">
                  Execution of plumbing work is dependent on adequate site accessibility, timely civil coordination, and availability of power/water connections during testing phases.
                </p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading">4. Workmanship & Testing Standards</h2>
                <p className="mt-1 text-sm">
                  All piping and drainage installations are executed in compliance with standard hydraulic engineering standards. Concealed lines are pressure-tested prior to handover.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
