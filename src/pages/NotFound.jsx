import React from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { Home, PhoneCall, AlertTriangle } from 'lucide-react';

export function NotFound() {
  return (
    <PageTransition>
      <SEO
        title="404 - Page Not Found | Jai Bhavani Constructions"
        description="The page you are looking for may have moved or no longer exists."
      />

      <section className="min-h-[65vh] flex items-center justify-center py-20 bg-brand-offwhite border-b border-brand-border px-4">
        <div className="max-w-md w-full text-center p-8 bg-white border border-brand-border rounded-lg shadow-card">
          
          <div className="w-14 h-14 rounded-full bg-brand-offwhite border border-brand-border flex items-center justify-center text-brand-navy mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-brand-water" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">Error 404</span>
          
          <h1 className="text-2xl font-bold text-brand-heading mt-1 mb-2">
            Page not found.
          </h1>

          <p className="text-xs sm:text-sm text-brand-text-body leading-relaxed mb-6">
            The page you're looking for may have moved or no longer exists.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              to="/"
              variant="primary"
              size="md"
              icon={Home}
              className="w-full sm:w-auto text-xs tracking-wider uppercase font-semibold"
            >
              Back to Home
            </Button>

            <Button
              to="/contact"
              variant="outline"
              size="md"
              icon={PhoneCall}
              className="w-full sm:w-auto text-xs tracking-wider uppercase font-semibold"
            >
              Contact Us
            </Button>
          </div>

        </div>
      </section>
    </PageTransition>
  );
}
