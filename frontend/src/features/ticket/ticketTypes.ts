export type PurchasedTicket = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImageData: string | null;
  quantity: number;
  totalPrice: number;
  ticketCode: string;
  purchasedAt: string;
};

export type PurchaseTicketRequest = {
  eventId: string;
  attendeeId: string;
  ticketQuantity: number;
};

export type PurchaseTicketResponse = {
  ticketId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketCode: string;
};