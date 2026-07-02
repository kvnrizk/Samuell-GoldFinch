import type { Locale } from '@/lib/i18n';

export type Service = 'wedding-film' | 'editorial-commercial' | 'event-production' | 'dj-performance' | 'hybrid-package';

export interface FormState {
  // Step 0: client type
  clientType: 'personal' | 'venue' | null;
  // Step 1: service
  service: Service | '';
  // Step 2: service-specific
  // Wedding
  weddingDate: string;
  weddingVenue: string;
  weddingHours: string;
  weddingStyle: string;
  // Editorial
  editorialBrand: string;
  editorialDeliverables: string;
  editorialUsage: string;
  // DJ
  djEventType: string;
  djHours: string;
  djGenre: string;
  djEquipment: string;
  // Event production
  eventScale: string;
  eventServices: string[];
  eventVenue: string;
  // General details
  details: string;
  // Step 3: budget + timeline
  eventDate: string;
  guestCount: string;
  budget: string;
  // Step 4: contact
  name: string;
  email: string;
  phone: string;
}

export const initialForm: FormState = {
  clientType: null,
  service: '',
  weddingDate: '', weddingVenue: '', weddingHours: '', weddingStyle: '',
  editorialBrand: '', editorialDeliverables: '', editorialUsage: '',
  djEventType: '', djHours: '', djGenre: '', djEquipment: '',
  eventScale: '', eventServices: [], eventVenue: '',
  details: '',
  eventDate: '', guestCount: '', budget: '',
  name: '', email: '', phone: '',
};

export const serviceOptions = [
  { value: 'wedding-film' as Service, label: 'Wedding Film', icon: '🎬', desc: 'Cinematic wedding films that tell your love story' },
  { value: 'editorial-commercial' as Service, label: 'Editorial / Commercial', icon: '📷', desc: 'Brand films, fashion, and editorial content' },
  { value: 'dj-performance' as Service, label: 'DJ Performance', icon: '🎵', desc: 'Book a DJ or live performer for your event' },
  { value: 'event-production' as Service, label: 'Event Production', icon: '🎪', desc: 'Full event design, production, and management' },
  { value: 'hybrid-package' as Service, label: 'Hybrid Package', icon: '✨', desc: 'Combine film, music, and production services' },
];

export const frenchServiceOptions = [
  { value: 'wedding-film' as Service, label: 'Film de mariage', icon: '🎬', desc: 'Films cinematographiques pour raconter votre histoire' },
  { value: 'editorial-commercial' as Service, label: 'Editorial / Commercial', icon: '📷', desc: 'Films de marque, mode et contenu editorial' },
  { value: 'dj-performance' as Service, label: 'Performance DJ', icon: '🎵', desc: 'Booker un DJ ou artiste live pour votre evenement' },
  { value: 'event-production' as Service, label: 'Production evenementielle', icon: '🎪', desc: 'Direction, production et gestion complete' },
  { value: 'hybrid-package' as Service, label: 'Pack hybride', icon: '✨', desc: 'Combiner film, musique et production' },
];

export const stepLabels = ['Service', 'Details', 'Timeline', 'Contact', 'Done'];

export function getLocalizedServiceOptions(locale: Locale) {
  return locale === 'fr' ? frenchServiceOptions : serviceOptions;
}

export function tx(locale: Locale, en: string, fr: string) {
  return locale === 'fr' ? fr : en;
}
