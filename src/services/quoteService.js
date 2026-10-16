import { addDocumentSafely } from '../firebase/firestore';

/**
 * Service to handle customer quote requests.
 * Submits to 'quoteRequests' Firestore collection.
 */
export async function submitQuoteRequest(quoteData) {
  const payload = {
    fullName: quoteData.fullName ? quoteData.fullName.trim() : '',
    phone: quoteData.phone ? quoteData.phone.trim() : '',
    email: quoteData.email ? quoteData.email.trim() : '',
    serviceRequired: quoteData.serviceRequired || 'General Consultation',
    siteAddress: quoteData.siteAddress ? quoteData.siteAddress.trim() : (quoteData.projectLocation ? quoteData.projectLocation.trim() : ''),
    googleMapsLink: quoteData.googleMapsLink ? quoteData.googleMapsLink.trim() : '',
    projectType: quoteData.projectType || 'Residential Flat / Apartment',
    message: quoteData.message ? quoteData.message.trim() : (quoteData.projectDescription ? quoteData.projectDescription.trim() : ''),
    projectDescription: quoteData.message ? quoteData.message.trim() : (quoteData.projectDescription ? quoteData.projectDescription.trim() : ''),
    status: 'Not Contacted',
    leadType: 'Quotation Request',
    submittedAt: new Date().toISOString(),
  };

  return await addDocumentSafely('quoteRequests', payload);
}
