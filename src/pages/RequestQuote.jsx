import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO } from '../seo/SEO';
import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/layout/PageHero';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FormInput } from '../components/ui/FormInput';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Alert } from '../components/ui/Alert';
import { submitQuoteRequest } from '../services/quoteService';
import { FadeIn } from '../components/ui/FadeIn';
import { useCompanyInfo } from '../context/CompanyContext';
import toast from 'react-hot-toast';
import { 
  FaWhatsapp, 
  FaPaperPlane, 
  FaCalculator, 
  FaClock 
} from 'react-icons/fa';

export function RequestQuote() {
  const { company: companyInfo } = useCompanyInfo();
  const location = useLocation();
  const defaultServiceFromState = location.state?.defaultService || '';
  const defaultScopeFromState = location.state?.projectScope ? `Enquiry regarding: ${location.state.projectScope}` : '';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    siteAddress: '',
    googleMapsLink: '',
    serviceRequired: defaultServiceFromState,
    projectType: 'Residential Flat / Apartment',
    message: defaultScopeFromState,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const serviceOptions = [
    'Small Fixes (Rapid Repairs & Maintenance)',
    'Flat Works (Bathroom & Flat Renovation)',
    'Building Works (Civil Subcontracts & Society CHS)',
    'General Plumbing Consultation'
  ];

  const projectTypeOptions = [
    'Residential Flat / Apartment',
    'Independent House / Villa',
    'Housing Society (CHS Direct Contract)',
    'Civil Construction Site / Builder Project',
    'Commercial Space / Facility'
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

    // 5. Site / Building Address (Required)
    if (!formData.siteAddress.trim()) {
      errs.siteAddress = 'Please enter the site / building address.';
    }

    // 6. Google Link of Site (Required)
    const mapsLink = formData.googleMapsLink.trim();
    if (!mapsLink) {
      errs.googleMapsLink = 'Please enter the Google Maps link of the site.';
    } else {
      try {
        const url = new URL(mapsLink.startsWith('http') ? mapsLink : `https://${mapsLink}`);
        if (!url.hostname) {
          errs.googleMapsLink = 'Please enter a valid Google Maps URL.';
        }
      } catch {
        errs.googleMapsLink = 'Please enter a valid link (e.g. https://maps.app.goo.gl/...).';
      }
    }

    // 7. Property / Project Type (Required)
    if (!formData.projectType) {
      errs.projectType = 'Please select a property type.';
    }

    // Note: message is OPTIONAL
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
      let finalMapsLink = formData.googleMapsLink.trim();
      if (finalMapsLink && !finalMapsLink.startsWith('http://') && !finalMapsLink.startsWith('https://')) {
        finalMapsLink = `https://${finalMapsLink}`;
      }

      await submitQuoteRequest({
        ...formData,
        googleMapsLink: finalMapsLink,
      });

      setSubmitStatus('success');
      const succText = 'Thank you! Your quotation request has been submitted. Our team will review your requirement and reach out shortly.';
      setFeedbackMessage(succText);
      toast.success('Quote request submitted successfully! We will contact you soon.');
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        siteAddress: '',
        googleMapsLink: '',
        serviceRequired: '',
        projectType: 'Residential Flat / Apartment',
        message: '',
      });
      setErrors({});
    } catch (err) {
      console.error('Quote error:', err);
      setSubmitStatus('error');
      const errText = 'There was an issue sending your request. Please message us directly on WhatsApp or call us.';
      setFeedbackMessage(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbs = [
    { name: "Request a Quote", href: "/request-a-quote" }
  ];

  return (
    <PageTransition>
      <SEO
        title="Request a Plumbing Quote | Jai Bhavani Constructions Mumbai"
        description="Get a transparent, free plumbing quotation for repairs, flat bathroom renovations, or society contracts in Mumbai."
        canonicalPath="/request-a-quote"
      />

      <PageHero
        title="Request a Free Plumbing Quote."
        description="Share your project details with our Mumbai team for an itemized estimate."
        breadcrumbs={breadcrumbs}
      />

      <section className="py-14 sm:py-18 bg-brand-offwhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Estimation Benefits */}
            <div className="lg:col-span-4 space-y-3.5">
              <FadeIn>
                <SectionHeading
                  label="OUR PROMISE"
                  title="Fair & Transparent Pricing"
                  subtitle="Clear accounting with zero hidden costs."
                  className="mb-4"
                />

                <div className="p-4 rounded-xl bg-white border border-brand-border space-y-1">
                  <div className="flex items-center gap-2 text-brand-heading font-bold text-xs uppercase tracking-wider">
                    <FaCalculator className="text-brand-water" />
                    <span>Clear Itemized Breakdown</span>
                  </div>
                  <p className="text-xs text-brand-text-body">
                    Pipes, fittings, tiles, waterproofing, and labor costs clearly separated.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-brand-border space-y-1">
                  <div className="flex items-center gap-2 text-brand-heading font-bold text-xs uppercase tracking-wider">
                    <FaClock className="text-brand-water" />
                    <span>On-Time Completion</span>
                  </div>
                  <p className="text-xs text-brand-text-body">
                    Committed timelines with punctual on-site execution.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                    <FaWhatsapp className="text-[#25D366] w-4 h-4" />
                    <span>Need Quick Quotation?</span>
                  </div>
                  <p className="text-xs text-emerald-950">
                    Send photos or drawings on WhatsApp for an instant initial estimate.
                  </p>
                  <a
                    href={companyInfo.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    <span>Chat on WhatsApp →</span>
                  </a>
                </div>
              </FadeIn>
            </div>

            {/* Right Quote Request Form */}
            <div className="lg:col-span-8">
              <FadeIn delay={0.1}>
                <div className="bg-white border border-brand-border rounded-xl p-6 sm:p-8 shadow-card">
                  
                  <div className="mb-5 pb-3 border-b border-brand-border-light flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-brand-heading">
                        Project Quotation Form
                      </h3>
                      <p className="text-xs text-brand-text-body mt-0.5">
                        Fill in your details below for a customized quotation.
                      </p>
                    </div>
                  </div>

                  {submitStatus && (
                    <div className="mb-5">
                      <Alert
                        type={submitStatus}
                        title={submitStatus === 'success' ? 'Quote Request Received' : 'Error'}
                        message={feedbackMessage}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Site / Building Address"
                        name="siteAddress"
                        value={formData.siteAddress}
                        onChange={handleChange}
                        placeholder="Enter site address (e.g. Flat/Wing, Society, Street, Mumbai)"
                        required
                        error={errors.siteAddress}
                        disabled={isSubmitting}
                      />

                      <FormInput
                        label="Google Link of Site"
                        name="googleMapsLink"
                        type="url"
                        value={formData.googleMapsLink}
                        onChange={handleChange}
                        placeholder="Enter Google Maps link (https://maps.app.goo.gl/...)"
                        required
                        error={errors.googleMapsLink}
                        disabled={isSubmitting}
                      />
                    </div>

                    <Select
                      label="Property / Project Type"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      options={projectTypeOptions}
                      required
                      error={errors.projectType}
                      disabled={isSubmitting}
                    />

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
                        <span>{isSubmitting ? 'Submitting Quote Request...' : 'Submit Quote Request'}</span>
                      </button>
                    </div>
                  </form>

                </div>
              </FadeIn>
            </div>

          </div>

        </div>
      </section>
    </PageTransition>
  );
}
