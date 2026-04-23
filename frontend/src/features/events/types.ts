export type EventSummary = { // matches the response from GET /api/events and GET /api/events/{id}
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  totalTickets: number | null;
  organizerEmail: string;
};
