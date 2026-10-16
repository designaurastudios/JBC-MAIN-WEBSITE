import React from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FinalCTA } from '../components/sections/FinalCTA';
import { FadeIn } from '../components/ui/FadeIn';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaTools, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaArrowRight,
  FaWhatsapp,
  FaPhoneAlt
} from 'react-icons/fa';
import { useCompanyInfo } from '../context/CompanyContext';

export function About() {
  const { company: companyInfo } = useCompanyInfo();
  const values = [
    {
      title: "Reliable Workmanship",
      desc: "Zero compromise on pipe quality, pressure testing, and leak-free joint fittings.",
      icon: FaShieldAlt
    },
    {
      title: "1-Stop Bathroom Renovation",
      desc: "Complete bathroom remodeling covering plumbing, tile masonry, waterproofing, and painting.",
      icon: FaTools
    },
    {
      title: "Direct Society Pricing",
      desc: "Affordable, direct contractor pricing for Housing Societies without middleman commissions.",
      icon: FaCheckCircle
    },
    {
      title: "Mumbai-Wide Service",
      desc: "Quick on-site deployment across Western, Central, and South Mumbai.",
      icon: FaMapMarkerAlt
    }
  ];

  const breadcrumbs = [
    { name: "About Us", href: "/about" }
  ];

  return (
    <PageTransition>
      <SEO
        title="About Jai Bhavani Constructions | Plumbing Contractor Mumbai"
        description="Learn about Jai Bhavani Constructions — trusted plumbing contractor in Mumbai for small repairs, flat bathroom renovations, and building projects."
        canonicalPath="/about"
      />

      {/* Page Hero */}
      <PageHero
        title="Quality Plumbing & Renovation Across Mumbai."
        description="Jai Bhavani Constructions provides dependable plumbing and bathroom renovation solutions for flats, residential apartments, and commercial buildings."
        breadcrumbs={breadcrumbs}
      />

      {/* Clean Company Overview */}
      <section className="py-14 sm:py-18 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <FadeIn>
                <SectionHeading
                  label="WHO WE ARE"
                  title="Practical plumbing solutions built to last"
                  className="mb-3"
                />

                <p className="text-sm sm:text-base text-brand-text-body leading-relaxed">
                  At <strong className="text-brand-heading font-semibold">{companyInfo.name}</strong>, we specialize in high-quality plumbing services across Mumbai.
                </p>

                <p className="text-sm sm:text-base text-brand-text-body leading-relaxed">
                  Whether you need a quick tap/leak fix, a complete turnkey bathroom renovation (plumbing, tiles, waterproofing & paint), or building pipeline maintenance for your housing society — our team gets it done cleanly and on time.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>Our Services</span>
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </Link>
                  <a
                    href={companyInfo.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </FadeIn>
            </div>

            <div className="lg:col-span-6">
              <FadeIn delay={0.1}>
                <div className="relative rounded-xl overflow-hidden border border-brand-border shadow-card bg-brand-offwhite">
                  <img
                    src="/images/service-flat-works.jpg"
                    alt="Bathroom and plumbing renovation by Jai Bhavani Constructions"
                    className="w-full h-[300px] sm:h-[350px] object-cover"
                    loading="lazy"
                  />
                </div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-14 sm:py-18 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              label="OUR ADVANTAGE"
              title="What makes us the right choice"
              align="center"
            />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeIn key={i} delay={i * 0.06}>
                  <div className="bg-white border border-brand-border/80 rounded-xl p-5 sm:p-6 h-full hover:border-brand-steel hover:shadow-card transition-all">
                    <div className="w-9 h-9 rounded-lg bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-water mb-3">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-brand-heading mb-1.5">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-text-body leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Coverage Banner */}
      <section className="py-12 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="p-6 sm:p-8 rounded-xl bg-brand-navy text-white border border-brand-slate flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-beige">
                  <FaMapMarkerAlt className="text-brand-water" />
                  <span>SERVICE REACH</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Serving All Areas Across Mumbai
                </h3>
                <p className="text-xs sm:text-sm text-brand-beige/85 leading-relaxed">
                  We deploy technicians for on-site visits across Western Suburbs, Central Mumbai, South Mumbai, and surrounding areas.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href={companyInfo.phoneHref}
                  className="w-full sm:w-auto px-5 py-3 text-center rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <FaPhoneAlt className="w-3 h-3 text-brand-water" />
                  <span>Call {companyInfo.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA />
    </PageTransition>
  );
}
