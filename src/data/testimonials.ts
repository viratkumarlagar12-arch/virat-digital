export interface Testimonial {
  quote: string;
  name: string;
  role: string;   // e.g. "Owner, Sharma Sweets" or "YouTube creator"
  url?: string;
}

// Real client words only, used with their permission. The testimonials
// section stays hidden while this list is empty.
export const testimonials: Testimonial[] = [];
