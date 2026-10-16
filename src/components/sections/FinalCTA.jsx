import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaArrowRight, 
  FaShieldAlt,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaShareAlt
} from 'react-icons/fa';
import { useCompanyInfo } from '../../context/CompanyContext';
import { FadeIn } from '../ui/FadeIn';

export function FinalCTA() {
  const { company: companyInfo } = useCompanyInfo();

  const getSocialIcon = (key, platform) => {
    const k = (key || platform || '').toLowerCase();
    if (k.includes('yt') || k.includes('youtube')) return <FaYoutube className="w-4 h-4 text-red-500" />;
    if (k.includes('insta') || k.includes('instagram')) return <FaInstagram className="w-4 h-4 text-pink-500" />;
    if (k.includes('face') || k.includes('facebook')) return <FaFacebook className="w-4 h-4 text-blue-400" />;
    return <FaShareAlt className="w-3.5 h-3.5 text-brand-water" />;
  };

  return (
    <section className="py-10 sm:py-14 bg-[#051320] text-white relative overflow-hidden border-t border-white/10">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-brand-water/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <FadeIn>
          <div className="bg-gradient-to-br from-[#0c223a] via-[#081b2e] to-[#051424] border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading, Subtitle & Direct Phone (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-water/15 border border-brand-water/30 text-brand-water text-xs font-bold uppercase tracking-wider shadow-xs">
                  <FaShieldAlt className="text-amber-400 w-3.5 h-3.5" />
                  <span>Fast & Reliable Plumbing Across Mumbai</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Need Plumbing or Bathroom Renovation?
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Get a transparent, itemized quotation or schedule a rapid on-site inspection anywhere in Mumbai. Direct contractor supervision with zero middleman markup.
                </p>

                {/* Direct Call Line */}
                <div className="pt-1 flex items-center justify-center lg:justify-start">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <FaPhoneAlt className="text-brand-water w-3 h-3" />
                    <span>Direct Call:</span>
                    <a 
                      href={companyInfo.phoneHref} 
                      className="font-bold text-white hover:text-brand-water transition-colors"
                    >
                      {companyInfo.phoneDisplay}
                    </a>
                  </div>
                </div>

              </div>

              {/* Right Column: CTA Buttons & Social Handles (lg:col-span-5) */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-4">
                
                {/* Action Buttons Row */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Link
                    to="/request-a-quote"
                    className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-brand-water to-[#0d6fa7] hover:from-[#1da3ec] hover:to-brand-water text-white shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Request Free Quote</span>
                    <FaArrowRight className="w-3 h-3" />
                  </Link>

                  <a
                    href={companyInfo.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#25D366] to-[#1eb853] hover:from-[#2bf075] hover:to-[#25D366] text-white shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 active:scale-98"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Social Media Channels Row */}
                {companyInfo.socialLinks && companyInfo.socialLinks.length > 0 && (
                  <div className="pt-2 w-full flex flex-col items-center lg:items-end">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block text-center lg:text-right">
                      Follow Our Live Works:
                    </span>

                    <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-end">
                      {companyInfo.socialLinks.map((social) => (
                        <a
                          key={social.id || social.platform}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Visit ${social.platform}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-xs group"
                        >
                          {getSocialIcon(social.key, social.platform)}
                          <span className="text-[11px] font-medium">{social.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
