import React from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { FadeIn } from '../components/ui/FadeIn';
import { companyInfo } from '../data/companyInfo';

export function PrivacyPolicy() {
  const breadcrumbs = [
    { name: "Privacy Policy", href: "/privacy-policy" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Privacy Policy | Jai Bhavani Constructions"
        description="Privacy Policy and data protection terms for visitors, customers, and partners of Jai Bhavani Constructions."
        canonicalPath="/privacy-policy"
      />

      <PageHero
        title="Privacy Policy"
        description="How Jai Bhavani Constructions collects, protects, and manages customer information submitted through our website and quotation forms."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-brand-text-body text-sm sm:text-base leading-relaxed">
          <FadeIn>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-brand-muted uppercase font-semibold">Last Updated: September 2026</p>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading mt-2">1. Overview</h2>
                <p className="mt-1">
                  This Privacy Policy outlines how <strong>{companyInfo.name}</strong> ("we", "our", or "us") handles personal information collected via our website, enquiry submissions, and quotation forms across {companyInfo.serviceAreas}.
                </p>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading">2. Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
                  <li>Full Name and contact details</li>
                  <li>Telephone number and email address</li>
                  <li>Project site location and parameters</li>
                  <li>Plumbing requirements and scope specifications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading">3. How We Use Information</h2>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
                  <li>To evaluate plumbing requirements and prepare accurate quotations</li>
                  <li>To coordinate on-site technical consultations</li>
                  <li>To communicate project status and service schedules</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-heading">4. Contact Regarding Privacy</h2>
                <p className="mt-1 text-sm">
                  If you have questions about our data practices, reach us directly:
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-heading">
                  {companyInfo.name} <br />
                  Email: {companyInfo.email} | Phone: {companyInfo.phone} | WhatsApp: {companyInfo.whatsapp} <br />
                  Service Reach: {companyInfo.serviceCoverage}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
