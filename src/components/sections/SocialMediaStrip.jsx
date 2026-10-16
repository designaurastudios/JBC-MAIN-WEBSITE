import React from 'react';
import { useCompanyInfo } from '../../context/CompanyContext';
import { FadeIn } from '../ui/FadeIn';
import { 
  FaYoutube, 
  FaInstagram, 
  FaFacebook, 
  FaWhatsapp, 
  FaShareAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';

export function SocialMediaStrip({ className = '' }) {
  const { company: companyInfo } = useCompanyInfo();

  const getPlatformDetails = (social) => {
    const k = (social.key || social.platform || '').toLowerCase();
    
    if (k.includes('yt') || k.includes('youtube')) {
      return {
        icon: <FaYoutube className="w-6 h-6 text-[#FF0000]" />,
        bgColor: 'bg-red-500/10 hover:bg-red-500/15 border-red-500/20 hover:border-red-500/40',
        badgeColor: 'bg-red-500 text-white',
        buttonColor: 'bg-[#FF0000] hover:bg-[#d90000] text-white',
        title: 'YouTube Channel',
        handle: '@jaibhavaniconstructions',
        description: 'Watch plumbing site walk-throughs, civil work videos & tutorials'
      };
    }

    if (k.includes('insta') || k.includes('instagram')) {
      return {
        icon: <FaInstagram className="w-6 h-6 text-[#E1306C]" />,
        bgColor: 'bg-pink-500/10 hover:bg-pink-500/15 border-pink-500/20 hover:border-pink-500/40',
        badgeColor: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
        buttonColor: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white',
        title: 'Instagram',
        handle: '@jaibhavaniconstructions',
        description: 'Before & after bathroom renovation photos, reels & site stories'
      };
    }

    if (k.includes('face') || k.includes('facebook')) {
      return {
        icon: <FaFacebook className="w-6 h-6 text-[#1877F2]" />,
        bgColor: 'bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/20 hover:border-blue-500/40',
        badgeColor: 'bg-[#1877F2] text-white',
        buttonColor: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
        title: 'Facebook Page',
        handle: 'Jai Bhavani Constructions',
        description: 'Society CHS project announcements, client reviews & company updates'
      };
    }

    return {
      icon: <FaShareAlt className="w-6 h-6 text-brand-water" />,
      bgColor: 'bg-brand-water/10 hover:bg-brand-water/15 border-brand-water/20 hover:border-brand-water/40',
      badgeColor: 'bg-brand-water text-white',
      buttonColor: 'bg-brand-water hover:bg-brand-water-dark text-white',
      title: social.platform,
      handle: social.platform,
      description: `Follow our official ${social.platform} profile for updates`
    };
  };

  const socialLinks = companyInfo.socialLinks || [];

  return (
    <section className={`py-14 sm:py-18 bg-[#051424] text-white border-t border-b border-white/10 relative overflow-hidden ${className}`}>
      {/* Background Accent Highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-water/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-water/15 border border-brand-water/30 text-brand-water text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <FaShareAlt className="w-3 h-3" />
              <span>Connect & Follow Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Follow Our Plumbing & Renovation Works Across Social Media
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2.5 leading-relaxed">
              Stay updated with our real-time site photos, YouTube video walk-throughs, and completed housing society projects across Mumbai.
            </p>
          </div>
        </FadeIn>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* WhatsApp Direct Card */}
          <FadeIn delay={0.05} className="flex">
            <a
              href={companyInfo.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex flex-col justify-between p-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/40 shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <FaWhatsapp className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#25D366] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    Live Chat
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    WhatsApp Direct
                  </h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                    {companyInfo.whatsappDisplay}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Send photos or floor plans for instant consultation, repair estimates, and rapid response.
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-300 group-hover:text-white transition-colors">
                <span>Chat on WhatsApp</span>
                <FaExternalLinkAlt className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </FadeIn>

          {/* Dynamic Social Links from Company Settings */}
          {socialLinks.map((social, index) => {
            const details = getPlatformDetails(social);

            return (
              <FadeIn key={social.id || social.platform} delay={0.1 + index * 0.05} className="flex">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex flex-col justify-between p-6 rounded-2xl border shadow-xl transition-all duration-300 group hover:-translate-y-1 cursor-pointer ${details.bgColor}`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        {details.icon}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${details.badgeColor}`}>
                        Official
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-brand-water transition-colors">
                        {details.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                        {details.handle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {details.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    <span>Visit {social.platform}</span>
                    <FaExternalLinkAlt className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </FadeIn>
            );
          })}

        </div>

      </div>
    </section>
  );
}
