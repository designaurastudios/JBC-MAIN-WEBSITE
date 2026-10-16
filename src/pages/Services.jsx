import React from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ServiceCard } from '../components/ui/ServiceCard';
import { primaryServices } from '../data/services';
import { FinalCTA } from '../components/sections/FinalCTA';
import { FadeIn } from '../components/ui/FadeIn';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle2, 
  Building2, 
  Users, 
  Paintbrush, 
  Wrench, 
  Droplets, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  MessageCircle
} from 'lucide-react';
import { useCompanyInfo } from '../context/CompanyContext';

export function Services() {
  const { company: companyInfo } = useCompanyInfo();
  const breadcrumbs = [
    { name: "Services", href: "/services" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Plumbing & Renovation Services | Jai Bhavani Constructions Mumbai"
        description="Explore our 3 core services: Small Fixes, Flat Works & Bathroom Renovation, and Building Works for Civil Contractors & Housing Societies across Mumbai & Maharashtra."
        canonicalPath="/services"
      />

      {/* Page Hero */}
      <PageHero
        title="Our Primary Plumbing & Renovation Services"
        description="Dependable execution across small household repairs, full turnkey flat & bathroom renovations, and large-scale building infrastructure contracts."
        breadcrumbs={breadcrumbs}
      />

      {/* 3 Main Services Grid Section */}
      <section className="py-16 sm:py-20 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn>
            <SectionHeading
              label="SPECIALIZED SOLUTIONS"
              title="Tailored plumbing solutions for homes, flats & buildings"
              subtitle="Choose the service category that matches your exact project requirement."
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {primaryServices.map((service, index) => (
              <div id={service.id} key={service.id} className="scroll-mt-28 flex">
                <FadeIn delay={index * 0.08} className="w-full">
                  <ServiceCard 
                    service={service} 
                    className="h-full"
                  />
                </FadeIn>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Deep Dive Section 1: Turnkey Flat & Bathroom Interior Renovation (Most Popular) */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Our Flagship Specialization</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-brand-heading leading-tight">
                  Turnkey Flat & Bathroom Renovation: <br />
                  <span className="text-brand-water-dark">Complete One-Stop Execution</span>
                </h2>

                <p className="text-sm sm:text-base text-brand-text-body leading-relaxed">
                  As plumbing contractors, we take complete ownership of your bathroom transformation. Rather than hiring separate plumbers, tile masons, waterproofing vendors, and painters, we provide a <strong>seamless end-to-end service</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-3.5 rounded bg-brand-offwhite border border-brand-border flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-brand-water shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-heading">Concealed Plumbing</h4>
                      <p className="text-[11px] text-brand-muted">CPVC/UPVC piping, diverters & mixers</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-brand-offwhite border border-brand-border flex items-start gap-2.5">
                    <Droplets className="w-4 h-4 text-brand-water shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-heading">100% Waterproofing</h4>
                      <p className="text-[11px] text-brand-muted">Chemical coating & moisture barrier</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-brand-offwhite border border-brand-border flex items-start gap-2.5">
                    <Paintbrush className="w-4 h-4 text-brand-water shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-heading">Tiles & Painting</h4>
                      <p className="text-[11px] text-brand-muted">Wall & floor tile fixing, ceiling paint</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-brand-offwhite border border-brand-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-water shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-heading">Sanitaryware Fitting</h4>
                      <p className="text-[11px] text-brand-muted">Wall-hung WC, vanity basin & shower</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Button
                    to="/request-a-quote"
                    state={{ defaultService: "Flat Works" }}
                    variant="water"
                    size="md"
                    className="text-xs tracking-wider uppercase font-semibold"
                  >
                    Get Bathroom Renovation Quote
                  </Button>
                  <a
                    href="https://wa.me/919987443006?text=Hello%20Jai%20Bhavani%20Constructions,%20I%20want%20to%20renovate%20my%20flat%20bathroom."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-6">
              <FadeIn delay={0.15}>
                <div className="relative rounded-lg overflow-hidden border border-brand-border shadow-card bg-brand-offwhite">
                  <img
                    src="/images/service-flat-works.jpg"
                    alt="Luxury renovated Indian bathroom by Jai Bhavani Constructions"
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 bg-white border-t border-brand-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-brand-heading">Full Bathroom Renovation</span>
                      <p className="text-[11px] text-brand-muted">Plumbing + Tiles + Waterproofing + Fixtures</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500 text-white">
                      Popular Choice
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* Deep Dive Section 2: Building Works & The 2 Working Models */}
      <section className="py-16 sm:py-20 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn>
            <SectionHeading
              label="BUILDING CONTRACTS & SOCIETY PROJECTS"
              title="Building Works: Two Flexible Working Models"
              subtitle="Whether you are a registered civil contractor needing a reliable plumbing subcontractor, or a Housing Society wanting direct cost savings."
              align="center"
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* Model 1: Civil Contractors Subcontracts */}
            <FadeIn delay={0.08}>
              <div className="bg-white border border-brand-border rounded-lg p-7 sm:p-8 h-full flex flex-col justify-between shadow-subtle hover:border-brand-steel transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded bg-brand-navy text-white flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-brand-water" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-brand-slate">
                    MODEL 1 • B2B SUBCONTRACTS
                  </span>

                  <h3 className="text-xl font-bold text-brand-heading">
                    For Civil Contractors & Construction Companies
                  </h3>

                  <p className="text-sm text-brand-text-body leading-relaxed">
                    Large civil contractors and construction companies with registered GST contracts often outsource specialized plumbing infrastructure to us. We handle the complete hydraulic and plumbing scope strictly adhering to engineering drawings, milestone schedules, and quality checklists.
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-brand-border-light text-xs sm:text-sm text-brand-heading">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-water shrink-0" />
                      <span>Turnkey vertical riser lines & core-cutting sleeves</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-water shrink-0" />
                      <span>Booster pump manifolds & overhead tank distribution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-water shrink-0" />
                      <span>Hydrostatic pressure testing and quality handover</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    to="/request-a-quote"
                    state={{ defaultService: "Building Works" }}
                    variant="outline"
                    size="md"
                    className="w-full text-xs tracking-wider uppercase font-semibold"
                  >
                    Partner as Civil Contractor
                  </Button>
                </div>
              </div>
            </FadeIn>

            {/* Model 2: Direct Housing Society (CHS) Contracts */}
            <FadeIn delay={0.16}>
              <div className="bg-white border-2 border-brand-water/40 rounded-lg p-7 sm:p-8 h-full flex flex-col justify-between shadow-card relative overflow-hidden">
                {/* Cost Saving Highlight Ribbon */}
                <div className="absolute top-0 right-0 bg-brand-navy text-white px-4 py-1 rounded-bl text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Middleman Cost</span>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    MODEL 2 • DIRECT SOCIETY CONTRACTS
                  </span>

                  <h3 className="text-xl font-bold text-brand-heading">
                    For Co-operative Housing Societies (CHS)
                  </h3>

                  <p className="text-sm text-brand-text-body leading-relaxed">
                    Housing societies requiring plumbing pipeline replacement, vertical shaft overhauls, or pump room renovations can <strong>hire Jai Bhavani Constructions directly</strong>. By eliminating general middleman contractors, your society saves substantially on total project budgets.
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-brand-border-light text-xs sm:text-sm text-brand-heading">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct contractor pricing with zero agency commission</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Complete shaft riser & external downpipe replacement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Transparent BoQ presented directly to society committees</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    to="/request-a-quote"
                    state={{ defaultService: "Building Works" }}
                    variant="water"
                    size="md"
                    className="w-full text-xs tracking-wider uppercase font-semibold"
                  >
                    Request Society Pipeline Estimate
                  </Button>
                </div>
              </div>
            </FadeIn>

          </div>

        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA />
    </PageTransition>
  );
}
