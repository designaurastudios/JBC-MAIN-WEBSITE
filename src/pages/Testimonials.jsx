import React, { useState, useEffect } from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TestimonialCard } from '../components/ui/TestimonialCard';
import { getTestimonials } from '../services/testimonialService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { FinalCTA } from '../components/sections/FinalCTA';
import { FadeIn } from '../components/ui/FadeIn';

export function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getTestimonials();
        setReviews(data);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const breadcrumbs = [
    { name: "Testimonials", href: "/testimonials" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Client Testimonials | Jai Bhavani Constructions"
        description="Read feedback and testimonials from clients, project developers, and property owners who have partnered with Jai Bhavani Constructions in Mumbai & Maharashtra."
        canonicalPath="/testimonials"
      />

      {/* Page Hero */}
      <PageHero
        title="What our clients say about our workmanship."
        description="Our reputation is built on consistent site performance, practical problem solving, and long-term durability for every plumbing installation."
        breadcrumbs={breadcrumbs}
      />

      {/* Testimonials List */}
      <section className="py-16 sm:py-20 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <FadeIn>
            <SectionHeading
              label="REVIEWS & RATINGS"
              title="Dependability confirmed by project managers & homeowners"
              subtitle="Explore feedback from past plumbing infrastructure, commercial retrofit, and residential projects."
            />
          </FadeIn>

          {loading ? (
            <LoadingSpinner label="Loading testimonials..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {reviews.map((testimonial, index) => (
                <FadeIn key={testimonial.id} delay={index * 0.08}>
                  <TestimonialCard testimonial={testimonial} className="h-full" />
                </FadeIn>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA />
    </PageTransition>
  );
}
