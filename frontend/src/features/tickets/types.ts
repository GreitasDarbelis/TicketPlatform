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
