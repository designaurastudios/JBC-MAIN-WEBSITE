import React, { useState } from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { FAQItem } from '../components/ui/FAQItem';
import { faqData } from '../data/faq';
import { getFAQSchema } from '../seo/schemas';
import { FinalCTA } from '../components/sections/FinalCTA';
import { FadeIn } from '../components/ui/FadeIn';
import { cn } from '../utils/cn';
import { FaSearch, FaQuestionCircle, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { useCompanyInfo } from '../context/CompanyContext';

export function FAQ() {
  const { company: companyInfo } = useCompanyInfo();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'General', 'Residential', 'Commercial', 'Construction', 'Repairs', 'Estimates'];

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const breadcrumbs = [
    { name: "FAQ", href: "/faq" }
  ];

  const faqSchema = getFAQSchema(faqData);

  return (
    <PageTransition>
      <SEO
        title="Plumbing Services FAQ | Jai Bhavani Constructions Mumbai"
        description="Frequently asked questions regarding plumbing contracting, project estimation, bathroom renovations, and building maintenance in Mumbai."
        canonicalPath="/faq"
        schemaJson={faqSchema}
      />

      <PageHero
        title="Frequently Asked Questions"
        description="Clear answers about our plumbing, bathroom renovation, and building services in Mumbai."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-14 sm:py-18 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Search Bar */}
          <FadeIn>
            <div className="relative mb-5">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted w-3.5 h-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions (e.g. bathroom renovation, costs, society pipes, leaks)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border rounded-lg text-xs sm:text-sm text-brand-heading placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-water shadow-subtle"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-6 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      'px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-all whitespace-nowrap',
                      isActive 
                        ? 'bg-brand-navy text-white shadow-sm' 
                        : 'bg-white text-brand-slate hover:bg-brand-beige/30 border border-brand-border'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </FadeIn>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-white border border-brand-border rounded-xl">
              <FaQuestionCircle className="w-6 h-6 text-brand-muted mx-auto mb-1.5 opacity-60" />
              <h3 className="text-sm font-bold text-brand-heading">No matching questions</h3>
              <p className="text-xs text-brand-muted mt-0.5">Try searching with a different term.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredFaqs.map((faq, index) => (
                <FadeIn key={faq.id} delay={index * 0.03}>
                  <FAQItem 
                    faq={faq} 
                    defaultOpen={index === 0 && !searchTerm} 
                  />
                </FadeIn>
              ))}
            </div>
          )}

          {/* Quick Help Box */}
          <FadeIn delay={0.2}>
            <div className="mt-8 p-5 rounded-xl bg-white border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-brand-heading">Have a specific plumbing question?</h4>
                <p className="text-xs text-brand-text-body">Our team is available on WhatsApp and call to help.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={companyInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-[#25D366] text-white flex items-center justify-center gap-1.5"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={companyInfo.phoneHref}
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-brand-offwhite border border-brand-border text-brand-navy flex items-center justify-center gap-1.5"
                >
                  <FaPhoneAlt className="w-3 h-3 text-brand-water" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      <FinalCTA />
    </PageTransition>
  );
}
