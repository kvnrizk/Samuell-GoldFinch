export const fallbackMedia = {
  personal: {
    portrait: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363934/sg-platform/static/assets/1st.png',
    aboutHero: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363938/sg-platform/static/assets/about/IMG_5840.jpg',
  },
  blaze: {
    stouhHero: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364037/sg-platform/static/assets/blaze/stouh_beirut/2E2A1724.jpg',
    embassyHero: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363942/sg-platform/static/assets/blaze/ambassy/0C5A9134.jpg',
    weddingHero: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364170/sg-platform/static/assets/blaze/weddings/DSCF2395.jpg',
    weddingPoster: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364149/sg-platform/static/assets/blaze/weddings/0G0A7811.jpg',
    editorialHero: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364019/sg-platform/static/assets/blaze/editorial_and_brand/pexels-amar-10288372.jpg',
    showcase: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363947/sg-platform/static/assets/blaze/IMG_6050.jpg',
  },
  kolasi: {
    artistPrimary: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364184/sg-platform/static/assets/kolasi/artists/4F8A3682.jpg',
    artistOne: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364188/sg-platform/static/assets/kolasi/artists/artist-1.jpg',
    artistTwo: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364228/sg-platform/static/assets/kolasi/artists/artist-2.jpg',
    artistThree: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364230/sg-platform/static/assets/kolasi/artists/artist-3.jpg',
    artistFour: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364243/sg-platform/static/assets/kolasi/artists/artist-4.jpg',
    artistFive: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364222/sg-platform/static/assets/kolasi/artists/IMG_6476.jpg',
    artistSix: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364210/sg-platform/static/assets/kolasi/artists/IMG_6733.jpg',
    eventOne: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364262/sg-platform/static/assets/kolasi/images/4F8A2882.jpg',
    eventTwo: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364266/sg-platform/static/assets/kolasi/images/4F8A3195.jpg',
    eventThree: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364281/sg-platform/static/assets/kolasi/images/4F8A3310.jpg',
    eventFour: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364247/sg-platform/static/assets/kolasi/images/4F8A2938.jpg',
    eventFive: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364282/sg-platform/static/assets/kolasi/images/4F8A3750.jpg',
    eventSix: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364276/sg-platform/static/assets/kolasi/images/4F8A3777.jpg',
    eventSeven: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364297/sg-platform/static/assets/kolasi/images/4F8A3801.jpg',
    speakeasy: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364299/sg-platform/static/assets/kolasi/speakeasy/le-speakeasy-art-photo-min.jpg',
  },
  logos: {
    stouh: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364300/sg-platform/static/assets/stouth_beirut_logo.webp',
    mipim: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364300/sg-platform/static/assets/mipim_logo.webp',
    elieSaab: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363933/sg-platform/static/assets/Elie_saab_logo.webp',
    speakeasy: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364284/sg-platform/static/assets/kolasi/logo_speakeasy.png',
  },
};

export const homeFeaturedSets = [
  { url: fallbackMedia.blaze.stouhHero, title: 'STOUH BEIRUT', category: 'Rooftop Event' },
  { url: fallbackMedia.blaze.embassyHero, title: 'Embassy of Lebanon', category: 'Diplomatic Event' },
  { url: fallbackMedia.blaze.weddingHero, title: 'Blaze Weddings', category: 'Cinematic Wedding' },
  { url: fallbackMedia.blaze.editorialHero, title: 'Editorial & Brand', category: 'Brand Campaign' },
];

export const homeCollaborations: { name: string; location: string; logo?: string }[] = [
  { name: 'Embassy of Lebanon', location: 'Paris' },
  { name: 'STOUH BEIRUT', location: 'Paris', logo: fallbackMedia.logos.stouh },
  { name: 'MIPIM Cannes', location: 'Cannes', logo: fallbackMedia.logos.mipim },
  { name: 'Elie Saab', location: 'Beirut', logo: fallbackMedia.logos.elieSaab },
  { name: 'Kate Zubok', location: 'International' },
  { name: 'Transdev', location: 'France' },
  { name: 'Le Speakeasy', location: 'Paris', logo: fallbackMedia.logos.speakeasy },
  { name: 'Chloe Khalife', location: 'International' },
  { name: 'Brunch Festival', location: 'Paris' },
  { name: 'France Tourisme', location: 'France' },
];

export const blazeFallbackSets = {
  stouhBeirut: [
    { url: fallbackMedia.blaze.stouhHero, title: 'STOUH BEIRUT', category: 'Rooftop' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364137/sg-platform/static/assets/blaze/stouh_beirut/2E2A2072.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364068/sg-platform/static/assets/blaze/stouh_beirut/2E2A1243.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364096/sg-platform/static/assets/blaze/stouh_beirut/4F8A9365.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364080/sg-platform/static/assets/blaze/stouh_beirut/IMG_6348.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364156/sg-platform/static/assets/blaze/stouh_beirut/IMG_6351.jpg', title: 'STOUH BEIRUT', category: 'Rooftop' },
  ],
  embassy: [
    { url: fallbackMedia.blaze.embassyHero, title: 'Embassy of Lebanon', category: 'Diplomatic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363957/sg-platform/static/assets/blaze/ambassy/0C5A9139.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363958/sg-platform/static/assets/blaze/ambassy/0C5A9196.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363975/sg-platform/static/assets/blaze/ambassy/4F8A9987.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363989/sg-platform/static/assets/blaze/ambassy/4F8A9996.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363949/sg-platform/static/assets/blaze/ambassy/0C5A9206.jpg', title: 'Embassy of Lebanon', category: 'Diplomatic' },
  ],
  weddings: [
    { url: fallbackMedia.blaze.weddingHero, title: 'Weddings', category: 'Cinematic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364179/sg-platform/static/assets/blaze/weddings/IMG_0100.jpg', title: 'Weddings', category: 'Cinematic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364179/sg-platform/static/assets/blaze/weddings/IMG_0084.jpg', title: 'Weddings', category: 'Cinematic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364166/sg-platform/static/assets/blaze/weddings/IMG_0068.jpg', title: 'Weddings', category: 'Cinematic' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364167/sg-platform/static/assets/blaze/weddings/IMG_0079.jpg', title: 'Weddings', category: 'Cinematic' },
    { url: fallbackMedia.blaze.weddingPoster, title: 'Weddings', category: 'Cinematic' },
  ],
  editorial: [
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363961/sg-platform/static/assets/blaze/cloudinary_uploaded/IMG_5744_compressed.jpg', title: 'Editorial & Brand', category: 'Editorial' },
    { url: fallbackMedia.blaze.editorialHero, title: 'Editorial & Brand', category: 'Editorial' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363997/sg-platform/static/assets/blaze/editorial_and_brand/pexels-angel-ayala-321556-28976231.jpg', title: 'Editorial & Brand', category: 'Editorial' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771363998/sg-platform/static/assets/blaze/editorial_and_brand/pexels-fabrice-busching-1777473881-30235864.jpg', title: 'Editorial & Brand', category: 'Editorial' },
    { url: 'https://res.cloudinary.com/dwayr9ynb/image/upload/v1771364038/sg-platform/static/assets/blaze/editorial_and_brand/pexels-valentina-maros-128709290-13283497.jpg', title: 'Editorial & Brand', category: 'Editorial' },
  ],
};

export const kolasiExpertise = [
  { icon: 'music', title: 'DJ Booking', description: 'Connecting world-class DJs and live performers with venues, festivals and private events globally.', image: fallbackMedia.kolasi.artistPrimary },
  { icon: 'layout', title: 'Event Curation', description: 'Art direction, programming and press relations to shape cultural experiences and narratives.', image: fallbackMedia.kolasi.eventOne },
  { icon: 'camera', title: 'Content Creation', description: 'Cinematic capture, editing and campaign-ready media for events and promotions.', image: fallbackMedia.kolasi.eventThree },
];

export const kolasiGalleryRow1 = [
  fallbackMedia.kolasi.eventOne,
  fallbackMedia.kolasi.eventTwo,
  fallbackMedia.kolasi.eventThree,
  fallbackMedia.kolasi.eventFour,
  fallbackMedia.kolasi.eventFive,
  fallbackMedia.kolasi.eventSix,
  fallbackMedia.kolasi.eventSeven,
  fallbackMedia.kolasi.speakeasy,
];

export const kolasiGalleryRow2 = [
  fallbackMedia.kolasi.artistOne,
  fallbackMedia.kolasi.artistTwo,
  fallbackMedia.kolasi.artistThree,
  fallbackMedia.kolasi.artistFour,
  fallbackMedia.kolasi.artistFive,
  fallbackMedia.kolasi.artistSix,
  fallbackMedia.kolasi.artistPrimary,
];

export const kolasiShowcaseClips = [
  { muxPlaybackId: 'bzlHPIIz3L68lqg6fmMTH02GsYL1AeZnT6ewRQIlokaE', label: 'Le Speakeasy', poster: fallbackMedia.kolasi.speakeasy, slug: 'le-speakeasy' },
  { muxPlaybackId: 'RcF8cn9OBkB6iEkU6SYZb3SE00noBIWdVOneK5fqJuWo', label: '2nd Sun', poster: fallbackMedia.kolasi.eventTwo, slug: '2nd-sun' },
  { muxPlaybackId: '2aAgNa5S5s32fQG8XBUHXrwPUBbEQxn4oyKAjJSV801k', label: 'Kolasi Nights', poster: fallbackMedia.kolasi.eventFour, slug: 'kolasi-nights' },
];

export const kolasiServices = [
  {
    num: '01',
    title: 'DJ & Live Show Booking',
    description: 'Talent sourcing, rider negotiation and international bookings for clubs, festivals and private events across Europe, the Middle East, and South America.',
    tags: ['Clubs', 'Festivals', 'Private Events', 'International Tours'],
    image: fallbackMedia.kolasi.artistPrimary,
  },
  {
    num: '02',
    title: 'Event Curation & PR',
    description: 'Art direction, programming and press relations to shape cultural experiences and narratives that resonate with audiences worldwide.',
    tags: ['Art Direction', 'Programming', 'Press Relations', 'Brand Strategy'],
    image: fallbackMedia.kolasi.eventTwo,
  },
  {
    num: '03',
    title: 'Content Creation & Production',
    description: 'Cinematic capture, editing and campaign-ready media for events and promotions - from music videos to social content and brand films.',
    tags: ['Music Videos', 'Event Recaps', 'Social Content', 'Brand Films'],
    image: fallbackMedia.kolasi.eventThree,
  },
  {
    num: '+',
    title: 'Sound & Light Design',
    description: 'Full technical production - sound engineering and lighting design that transforms any venue into an immersive experience.',
    tags: ['Sound Engineering', 'Lighting Design', 'Venue Setup', 'Technical Production'],
    image: fallbackMedia.kolasi.eventFive,
  },
];

export const venueFallbackRoster = [
  { id: 'kate-zubok', name: 'Kate Zubok', slug: 'kate-zubok', photo: { url: fallbackMedia.kolasi.artistOne }, genre: 'Deep House \u00b7 Melodic Techno', rosterCategory: 'resident' },
  { id: 'dj-marco', name: 'DJ Marco', slug: 'dj-marco', photo: { url: fallbackMedia.kolasi.artistTwo }, genre: 'Afro House \u00b7 Progressive', rosterCategory: 'resident' },
  { id: 'lina-m', name: 'Lina M', slug: 'lina-m', photo: { url: fallbackMedia.kolasi.artistFive }, genre: 'Melodic House \u00b7 Indie Dance', rosterCategory: 'resident' },
  { id: 'samir-k', name: 'Samir K', slug: 'samir-k', photo: { url: fallbackMedia.kolasi.artistFour }, genre: 'Techno \u00b7 Industrial', rosterCategory: 'headliner' },
  { id: 'naya-sound', name: 'Naya Sound', slug: 'naya-sound', photo: { url: fallbackMedia.kolasi.artistThree }, genre: 'Live Act \u00b7 Electronic Fusion', rosterCategory: 'live-act' },
  { id: 'rami-b', name: 'Rami B', slug: 'rami-b', photo: { url: fallbackMedia.kolasi.artistSix }, genre: 'DJ + Live Vocals', rosterCategory: 'hybrid' },
  { id: 'alex-d', name: 'Alex D', photo: { url: fallbackMedia.kolasi.artistPrimary }, genre: 'Tech House \u00b7 Minimal', rosterCategory: 'resident' },
  { id: 'yasmine-k', name: 'Yasmine K', photo: { url: fallbackMedia.kolasi.eventOne }, genre: 'Organic House \u00b7 Downtempo', rosterCategory: 'headliner' },
];

export const venueBackgrounds = {
  visualBreakTop: fallbackMedia.kolasi.eventSix,
  caseStudyAccent: fallbackMedia.kolasi.eventOne,
  rosterBreak: fallbackMedia.kolasi.artistPrimary,
  finalBreak: fallbackMedia.kolasi.eventSeven,
  finalCta: fallbackMedia.kolasi.eventFour,
};