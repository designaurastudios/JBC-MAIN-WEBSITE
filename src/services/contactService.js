import { addDocumentSafely } from '../firebase/firestore';

/**
 * Service to handle customer contact enquiries.
 * Submits to 'contactMessages' Firestore collection.
 */
export async function submitContactMessage(formData) {
  const payload = {
    fullName: formData.fullName ? formData.fullName.trim() : '',
    phone: formData.phone ? formData.phone.trim() : '',
    email: formData.email ? formData.email.trim() : '',
    serviceRequired: formData.serviceRequired || 'General Plumbing Consultation',
    message: formData.message ? formData.message.trim() : '',
    leadType: 'Contact Form',
    submittedAt: new Date().toISOString(),
  };

  return await addDocumentSafely('contactMessages', payload);
}
