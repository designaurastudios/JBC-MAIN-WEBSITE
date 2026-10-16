import React, { useEffect, Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FaWhatsapp } from 'react-icons/fa';
import { useCompanyInfo } from '../../context/CompanyContext';

export function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const currentOutlet = useOutlet();
  const { company: companyInfo } = useCompanyInfo();

  useEffect(() => {
    // Instant scroll to top on navigation to eliminate scroll lag
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-offwhite text-brand-text-body font-sans relative">
      <Navbar />
      
      <main className="flex-grow flex flex-col relative">
        <Suspense fallback={
          <div className="min-h-[55vh] flex items-center justify-center bg-brand-offwhite">
            <LoadingSpinner size="md" label="Loading..." />
          </div>
        }>
          <AnimatePresence mode="wait" initial={false}>
            {currentOutlet && React.cloneElement(currentOutlet, { key: pathname })}
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />

      {/* Floating Official WhatsApp Button */}
      <a
        href={companyInfo.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Jai Bhavani Constructions"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </a>
    </div>
  );
}
