import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaBars } from 'react-icons/fa';
import { X, ChevronRight, ArrowUpRight, Phone, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { useCompanyInfo } from '../../context/CompanyContext';
import { mainNavLinks } from '../../data/navigation';
import { cn } from '../../utils/cn';

const linkPreloaders = {
  '/': () => import('../../pages/Home'),
  '/about': () => import('../../pages/About'),
  '/services': () => import('../../pages/Services'),
  '/projects': () => import('../../pages/Projects'),
  '/testimonials': () => import('../../pages/Testimonials'),
  '/contact': () => import('../../pages/Contact'),
  '/request-a-quote': () => import('../../pages/RequestQuote'),
  '/faq': () => import('../../pages/FAQ'),
};

export function Navbar() {
  const { company: companyInfo } = useCompanyInfo();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    let lastState = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextState = window.scrollY > 20;
          if (nextState !== lastState) {
            lastState = nextState;
            setIsScrolled(nextState);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full-screen mobile menu animations
  const menuVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 35,
        when: 'afterChildren',
      },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 28,
        staggerChildren: 0.06,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 40 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    },
  };

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-brand-border shadow-subtle py-2.5'
            : 'bg-brand-offwhite/90 backdrop-blur-sm border-b border-brand-border/60 py-3.5'
        )}
      >
        {/* Top Bar for Desktop */}
        <div className="hidden lg:block border-b border-brand-border-light/60 pb-1.5 mb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-brand-slate">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-brand-water" />
              <span>Serving All Over Mumbai (Western, Central & South Mumbai)</span>
            </div>
            <div className="flex items-center gap-5">
              <a 
                href={companyInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#25D366] hover:text-[#1da851] transition-colors"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                <span>WhatsApp: {companyInfo.whatsappDisplay}</span>
              </a>
              <span className="text-brand-border">|</span>
              <a 
                href={companyInfo.phoneHref}
                className="inline-flex items-center gap-1.5 font-semibold text-brand-navy hover:text-brand-water transition-colors"
              >
                <FaPhoneAlt className="w-3 h-3 text-brand-water" />
                <span>Call: {companyInfo.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-3 group focus:outline-none rounded cursor-pointer"
              aria-label="Jai Bhavani Constructions - Home"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-brand-border/80 shadow-xs bg-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <img 
                  src="/jbc-logo.png" 
                  alt="Jai Bhavani Constructions Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-brand-navy group-hover:text-brand-water transition-colors leading-tight">
                  JAI BHAVANI
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-brand-slate uppercase leading-none">
                  CONSTRUCTIONS
                </span>
              </div>
            </Link>

            {/* Nav Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {mainNavLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onMouseEnter={() => linkPreloaders[link.href]?.()}
                  className={({ isActive }) => cn(
                    'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors',
                    isActive 
                      ? 'text-brand-water font-bold bg-brand-water/10' 
                      : 'text-brand-heading hover:text-brand-water hover:bg-black/5'
                  )}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Action CTAs */}
            <div className="flex items-center gap-2.5">
              <a 
                href={companyInfo.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-all"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <Link
                to="/request-a-quote"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-brand-navy hover:bg-brand-navy-dark text-white shadow-sm transition-all"
              >
                Get Quote
              </Link>

              {/* Mobile Menu Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded text-brand-navy hover:bg-black/5 transition-colors focus:outline-none"
                aria-expanded={mobileMenuOpen}
                aria-label="Open Navigation Menu"
              >
                <FaBars className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Smooth Slide-In Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[100] bg-[#071827] text-white flex flex-col justify-between overflow-y-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Background Aesthetic Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(22,137,199,0.18)_0%,_transparent_65%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(11,36,59,0.4)_0%,_transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none" />

            {/* Menu Header Bar */}
            <div className="relative z-10 px-5 pt-5 pb-4 flex items-center justify-between border-b border-white/10 bg-[#071827]/80 backdrop-blur-md">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white p-0.5 shadow-sm">
                  <img 
                    src="/jbc-logo.png" 
                    alt="Jai Bhavani Constructions" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                    JAI BHAVANI
                  </span>
                  <span className="text-[9px] font-semibold tracking-widest text-brand-water uppercase leading-none">
                    CONSTRUCTIONS
                  </span>
                </div>
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 border border-white/15 flex items-center justify-center text-white transition-all focus:outline-none"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-slate-200" />
              </button>
            </div>

            {/* Navigation Links with Staggered Slide Animations */}
            <div className="relative z-10 px-6 py-6 flex-1 flex flex-col justify-center space-y-2 max-w-lg mx-auto w-full">
              <motion.div variants={itemVariants} className="text-[11px] font-bold uppercase tracking-widest text-brand-water/90 mb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-water" />
                <span>Navigation Menu</span>
              </motion.div>

              {mainNavLinks.map((link, idx) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <NavLink
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      'group flex items-center justify-between py-3 px-4 rounded-xl text-lg font-bold transition-all duration-200 border',
                      isActive
                        ? 'bg-gradient-to-r from-brand-water/25 to-transparent text-white border-brand-water/50 shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-white/5 border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-brand-water/60 group-hover:text-brand-water transition-colors">
                        0{idx + 1}
                      </span>
                      <span>{link.name}</span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-water group-hover:translate-x-1 transition-all" />
                  </NavLink>
                </motion.div>
              ))}

              {/* Additional Quick Links */}
              <motion.div variants={itemVariants} className="pt-2">
                <NavLink
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'group flex items-center justify-between py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border',
                    isActive
                      ? 'bg-white/10 text-white border-white/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-water"></span>
                    Frequently Asked Questions (FAQ)
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </NavLink>
              </motion.div>
            </div>

            {/* Bottom Actions & Contact Card */}
            <motion.div 
              variants={itemVariants}
              className="relative z-10 p-5 bg-[#04101d]/90 border-t border-white/10 backdrop-blur-md space-y-3"
            >
              {/* Primary Quote CTA */}
              <Link
                to="/request-a-quote"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1378b0] hover:to-[#095480] rounded-xl shadow-md active:scale-98 transition-all"
              >
                <span>Request a Free Quote</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              {/* WhatsApp & Direct Call Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={companyInfo.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <FaWhatsapp className="w-4 h-4 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>

                <a
                  href={companyInfo.phoneHref}
                  className="flex items-center justify-center gap-2 py-3 px-3 text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-water shrink-0" />
                  <span className="truncate">Call Now</span>
                </a>
              </div>

              {/* Location Badge */}
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                <FaMapMarkerAlt className="w-3 h-3 text-brand-water" />
                <span>Serving All Over Mumbai & Maharashtra</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
