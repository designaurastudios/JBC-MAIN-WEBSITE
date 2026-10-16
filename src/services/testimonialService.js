import { testimonials as staticTestimonials } from '../data/testimonials';
import { getDocumentsSafely } from '../firebase/firestore';

/**
 * Get testimonials data. Returns static demo testimonials or Firestore items if available.
 */
export async function getTestimonials() {
  try {
    const firestoreTestimonials = await getDocumentsSafely('testimonials', 12);
    if (firestoreTestimonials && firestoreTestimonials.length > 0) {
      return firestoreTestimonials;
    }
  } catch (err) {
    console.warn('Using static testimonials data:', err);
  }
  return staticTestimonials;
}
