import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaArrowRight,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaClock,
  FaShareAlt
} from 'react-icons/fa';
import { useCompanyInfo } from '../../context/CompanyContext';
import { footerQuickLinks, footerServiceLinks } from '../../data/navigation';

export function Footer() {
  const { company: companyInfo } = useCompanyInfo();
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (key, platform) => {
    const k = (key || platform || '').toLowerCase();
    if (k.includes('yt') || k.includes('youtube')) return <FaYoutube className="w-4 h-4 text-red-500" />;
    if (k.includes('insta') || k.includes('instagram')) return <FaInstagram className="w-4 h-4 text-pink-500" />;
    if (k.includes('face') || k.includes('facebook')) return <FaFacebook className="w-4 h-4 text-blue-400" />;
    return <FaShareAlt className="w-3.5 h-3.5 text-brand-water" />;
  };

  return (
    <footer className="bg-brand-navy-dark text-white border-t border-brand-slate/40 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark pointer-events-none opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Overview & Socials */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white rounded-full w-10 h-10 sm:w-11 sm:h-11 overflow-hidden border border-white/20 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-xs">
                <img 
                  src="/jbc-logo.png" 
                  alt="Jai Bhavani Constructions Logo" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="block font-bold text-base tracking-tight text-white leading-tight">
                  JAI BHAVANI
                </span>
                <span className="block text-[10px] font-semibold tracking-widest text-brand-beige uppercase">
                  CONSTRUCTIONS
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-brand-beige/80 leading-relaxed">
              Dependable plumbing solutions in Mumbai — small leak repairs, complete flat & bathroom renovations, and building plumbing contracts.
            </p>

            <div className="flex items-center gap-2 text-xs text-brand-beige/70">
              <FaShieldAlt className="text-brand-water shrink-0" />
              <span>{companyInfo.licenseInfo}</span>
            </div>

            {/* Social Media Links Icons */}
            {companyInfo.socialLinks && companyInfo.socialLinks.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Follow & Connect:
                </p>
                <div className="flex items-center flex-wrap gap-2">
                  {companyInfo.socialLinks.map((social) => (
                    <a
                      key={social.id || social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.platform}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all hover:scale-110 shadow-xs"
                      aria-label={social.platform}
                    >
                      {getSocialIcon(social.key, social.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-3 border-l-2 border-brand-water pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerQuickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-brand-beige/80 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                  >
                    <FaArrowRight className="w-2.5 h-2.5 text-brand-water/70" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Plumbing Services */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-3 border-l-2 border-brand-water pl-2">
              Plumbing Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {footerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-brand-beige/80 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                  >
                    <FaArrowRight className="w-2.5 h-2.5 text-brand-water/70" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Reach & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-3 border-l-2 border-brand-water pl-2">
              Mumbai Contact
            </h4>

            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-2.5 text-brand-beige/85">
                <FaPhoneAlt className="w-3.5 h-3.5 text-brand-water shrink-0" />
                <a href={companyInfo.phoneHref} className="hover:text-white font-medium transition-colors">
                  {companyInfo.phoneDisplay || companyInfo.phone}
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-brand-beige/85">
                <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                <a 
                  href={companyInfo.whatsappHref} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#25D366] font-medium transition-colors"
                >
                  {companyInfo.whatsappDisplay || companyInfo.whatsapp} (WhatsApp)
                </a>
              </li>

              <li className="flex items-center gap-2.5 text-brand-beige/85">
                <FaEnvelope className="w-3.5 h-3.5 text-brand-water shrink-0" />
                <a href={companyInfo.emailHref} className="hover:text-white transition-colors">
                  {companyInfo.email}
                </a>
              </li>

              <li className="flex items-start gap-2.5 text-brand-beige/85">
                <FaClock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p>{companyInfo.workingHours?.weekday || 'Mon - Sat: 9:00 AM - 6:00 PM'}</p>
                  <p className="text-brand-beige/70">{companyInfo.workingHours?.sunday || 'Sun: 9:00 AM - 2:00 PM'}</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5 text-brand-beige/85">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-brand-water shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">Serving All Over Mumbai</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-brand-slate/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-beige/70">
          <p>
            © {currentYear} {companyInfo.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/admin" className="text-brand-water/80 hover:text-brand-water font-semibold transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
