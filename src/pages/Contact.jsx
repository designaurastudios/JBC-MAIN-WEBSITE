import React, { useState } from 'react';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';
import { useCompanyInfo } from '../context/CompanyContext';
import { submitContactMessage } from '../services/contactService';
import { FadeIn } from '../components/ui/FadeIn';
import toast from 'react-hot-toast';
import { 
  FaWhatsapp, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaCheckCircle 
} from 'react-icons/fa';

export function Contact() {
  const { company: companyInfo } = useCompanyInfo();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceRequired: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitFeedback, setSubmitFeedback] = useState('');

  const serviceOptions = [
    'Small Fixes (Rapid Repairs & Maintenance)',
    'Flat Works (Bathroom & Flat Renovation)',
    'Building Works (Civil Subcontracts & Society CHS)',
    'General Plumbing Consultation'
  ];

  const validate = () => {
    const errs = {};
    
    // 1. Full Name (Required)
    const nameTrimmed = formData.fullName.trim();
    if (!nameTrimmed) {
      errs.fullName = 'Please enter your full name.';
    } else if (nameTrimmed.length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    // 2. Phone Number (Required, strict 10 digits)
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      errs.phone = 'Please enter your 10-digit mobile number.';
    } else if (!/^[6-9]\d{9}$/.test(phoneTrimmed)) {
      errs.phone = 'Please enter a valid 10-digit mobile number (e.g. 9892557166).';
    }

    // 3. Email Address (Required)
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // 4. Service Needed (Required)
    if (!formData.serviceRequired) {
      errs.serviceRequired = 'Please select a primary service needed.';
    }

    // Note: message is OPTIONAL as requested

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('Please fill in all required fields accurately.');
    }
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number: restrict to digits only and clamp to max 10 digits
    if (name === 'phone') {
      const cleanDigits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, phone: cleanDigits }));
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: null }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitContactMessage(formData);

      setSubmitStatus('success');
      const succMsg = 'Thank you! Your enquiry has been submitted. Our team will contact you shortly.';
      setSubmitFeedback(succMsg);
      toast.success('Enquiry submitted successfully! We will contact you shortly.');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        serviceRequired: '',
        message: '',
      });
      setErrors({});
    } catch (err) {
      console.error('Contact error:', err);
      setSubmitStatus('error');
      const errMsg = 'Something went wrong. Please call us or WhatsApp us directly.';
      setSubmitFeedback(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: "Contact", href: "/contact" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Contact Jai Bhavani Constructions | Plumbing Contractor Mumbai"
        description="Contact Jai Bhavani Constructions for plumbing repairs, bathroom renovations, and building plumbing contracts in Mumbai."
        canonicalPath="/contact"
      />

      <PageHero
        title="Contact Our Plumbing Team in Mumbai."
        description="Reach out for consultations, fast site inspections, or quote requests across Mumbai."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-14 sm:py-20 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Section Header */}
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-water/10 border border-brand-water/20 text-brand-water text-xs font-bold uppercase tracking-wider mb-2.5 shadow-xs">
                <span>Direct Contact</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-heading tracking-tight">
                Reach Us Directly
              </h2>
              <p className="text-sm sm:text-base text-brand-slate max-w-xl mx-auto mt-2 leading-relaxed">
                Connect instantly via WhatsApp, direct phone call, or email.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT CONTAINER: Online Enquiry Form (lg:col-span-7) */}
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card">
                  
                  <div className="mb-6 pb-2 border-b border-brand-border-light">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                      Send an Online Enquiry
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
                      Fill out the form below and our team will get in touch with you.
                    </p>
                  </div>

                  {submitStatus && (
                    <div className="mb-5">
                      <Alert
                        type={submitStatus}
                        title={submitStatus === 'success' ? 'Enquiry Sent Successfully' : 'Error'}
                        message={submitFeedback}
                        onClose={() => setSubmitStatus(null)}
                      />
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        error={errors.fullName}
                        disabled={isSubmitting}
                      />

                      <FormInput
                        label="Phone Number (10 Digits)"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        required
                        error={errors.phone}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        error={errors.email}
                        disabled={isSubmitting}
                      />

                      <Select
                        label="Service Needed"
                        name="serviceRequired"
                        value={formData.serviceRequired}
                        onChange={handleChange}
                        options={serviceOptions}
                        placeholder="Select service needed"
                        required
                        error={errors.serviceRequired}
                        disabled={isSubmitting}
                      />
                    </div>

                    <Textarea
                      label="Message / Requirement Details (Optional)"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter any additional requirement details (optional)..."
                      required={false}
                      disabled={isSubmitting}
                    />

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-brand-navy via-brand-navy-dark to-brand-navy hover:from-brand-water hover:to-brand-water text-white shadow-card hover:shadow-lg transition-all inline-flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer disabled:opacity-60"
                      >
                        <FaPaperPlane className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Sending Message...' : 'Submit Enquiry'}</span>
                      </button>
                    </div>
                  </form>

                </div>
              </FadeIn>
            </div>

            {/* RIGHT CONTAINER: Contact Information (lg:col-span-5) */}
            <div className="lg:col-span-5">
              <FadeIn delay={0.1}>
                <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-7 shadow-card">
                  
                  <div className="space-y-3.5">
                    <div className="pb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                        Contact Details
                      </h3>
                      <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
                        Choose your preferred mode of communication.
                      </p>
                    </div>

                    {/* WhatsApp Direct Row */}
                    <a 
                      href={companyInfo.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-4 rounded-xl bg-gradient-to-r from-emerald-50/90 to-emerald-50/30 border border-emerald-200/80 hover:border-emerald-400 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                          WhatsApp Direct
                        </span>
                        <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                          Chat Now →
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                          <FaWhatsapp className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-extrabold text-emerald-950 leading-tight">
                            {companyInfo.whatsappDisplay}
                          </p>
                          <p className="text-xs text-emerald-800/80 font-medium">Instant reply & photo sharing</p>
                        </div>
                      </div>
                    </a>

                    {/* Phone Call Row */}
                    <a 
                      href={companyInfo.phoneHref}
                      className="group block p-4 rounded-xl bg-slate-50/80 border border-brand-border hover:border-brand-water/50 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate">Direct Phone Line</span>
                        <span className="text-xs font-bold text-brand-water group-hover:translate-x-1 transition-transform">Call Now →</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-offwhite border border-brand-border text-brand-navy flex items-center justify-center shadow-xs shrink-0 group-hover:bg-brand-water group-hover:text-white group-hover:border-brand-water transition-colors">
                          <FaPhoneAlt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-base font-extrabold text-brand-navy leading-tight group-hover:text-brand-water transition-colors">
                            {companyInfo.phoneDisplay}
                          </p>
                          <p className="text-xs text-brand-slate font-medium">Direct line to site contractor</p>
                        </div>
                      </div>
                    </a>

                    {/* Email Row */}
                    <a 
                      href={companyInfo.emailHref}
                      className="group block p-4 rounded-xl bg-slate-50/80 border border-brand-border hover:border-brand-water/50 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate">Email Inquiries</span>
                        <span className="text-xs font-bold text-brand-water group-hover:translate-x-1 transition-transform">Send Email →</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-offwhite border border-brand-border text-brand-navy flex items-center justify-center shadow-xs shrink-0 group-hover:bg-brand-water group-hover:text-white group-hover:border-brand-water transition-colors">
                          <FaEnvelope className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-extrabold text-brand-navy leading-tight truncate group-hover:text-brand-water transition-colors">
                            {companyInfo.email}
                          </p>
                          <p className="text-xs text-brand-slate font-medium">Formal tenders & BOQs</p>
                        </div>
                      </div>
                    </a>

                    {/* Service Area / On-Site Coverage */}
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-brand-border">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-slate block mb-2">Service Coverage</span>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-offwhite border border-brand-border text-brand-navy flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                          <FaMapMarkerAlt className="w-3.5 h-3.5 text-brand-water" />
                        </div>
                        <div>
                          <p className="text-xs text-brand-navy font-bold leading-relaxed">
                            On-Site Service Across Mumbai & Suburbs
                          </p>
                          <p className="text-[11px] text-brand-slate mt-0.5 leading-relaxed">
                            Western Suburbs, Central Mumbai, South Mumbai & Harbor. Direct contractor site inspections available on call.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Footer Notice */}
                  <div className="mt-4 pt-3.5 border-t border-brand-border-light flex items-center gap-2 text-xs text-brand-slate">
                    <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5 shrink-0" />
                    <span>Serving All Mumbai & Suburbs with 100% Genuine Workmanship.</span>
                  </div>

                </div>
              </FadeIn>
            </div>

          </div>

        </div>
      </section>
    </PageTransition>
  );
}
