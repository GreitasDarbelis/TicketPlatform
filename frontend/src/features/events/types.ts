export type EventSummary = { // matches the response from GET /api/events and GET /api/events/{id}
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  imageData: string | null;
  totalTickets: number | null;
  organizerEmail: string;
};

export type CreateEventRequest = {
  title: string;
  description: string | null;
  date: string;
  time: string;
  location: string;
  imageUrl: string | null;
  totalTickets: number | null;
  organizerEmail: string | null;
};
