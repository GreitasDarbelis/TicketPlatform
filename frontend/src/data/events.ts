export type EventCategory = 'Muzika' | 'Technologijos' | 'Bendruomenė';

export type EventCard = {
  id: string;
  title: string;
  venue: string;
  city: string;
  startsAt: string;
  price: number;
  category: EventCategory;
  seatsLeft: number;
  tagline: string;
};

export const events: EventCard[] = [
  {
    id: 'dev-night-vilnius',
    title: 'Dev Night Vilnius',
    venue: 'Cyber City',
    city: 'Vilnius',
    startsAt: '2026-05-14T18:30:00',
    price: 24,
    category: 'Technologijos',
    seatsLeft: 38,
    tagline: 'Vakariniai pranešimai apie AI produktus ir realų komandų darbą.',
  },
  {
    id: 'summer-open-air',
    title: 'Summer Open Air',
    venue: 'Vingio parkas',
    city: 'Vilnius',
    startsAt: '2026-06-06T17:00:00',
    price: 39,
    category: 'Muzika',
    seatsLeft: 112,
    tagline: 'Atviras vakaro koncertas su keliomis scenomis ir maisto zona.',
  },
  {
    id: 'product-builders-club',
    title: 'Product Builders Club',
    venue: 'Tech Loft',
    city: 'Kaunas',
    startsAt: '2026-04-29T19:00:00',
    price: 12,
    category: 'Bendruomenė',
    seatsLeft: 19,
    tagline: 'Neformalus susitikimas apie produkto kūrimą, idėjas ir praktinius sprendimus.',
  },
];
