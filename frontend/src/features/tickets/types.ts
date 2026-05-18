export type PurchasedTicket = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImageData: string | null;
  ticketCode: string;
  status: string;
  purchasedAt: string;
  pricePaid: number;
};

export type PurchasedTicketGroup = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventImageData: string | null;
  tickets: PurchasedTicket[];
  quantity: number;
  totalPrice: number;
  purchasedAt: string;
};

export function groupPurchasedTicketsByEvent(
  tickets: PurchasedTicket[],
): PurchasedTicketGroup[] {
  const groups = new Map<string, PurchasedTicketGroup>();

  const sortedTickets = [...tickets].sort(
    (firstTicket, secondTicket) =>
      new Date(secondTicket.purchasedAt).getTime() - new Date(firstTicket.purchasedAt).getTime(),
  );

  for (const ticket of sortedTickets) {
    const existingGroup = groups.get(ticket.eventId);

    if (existingGroup) {
      existingGroup.tickets.push(ticket);
      existingGroup.quantity += 1;
      existingGroup.totalPrice += ticket.pricePaid;
      continue;
    }

    groups.set(ticket.eventId, {
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      eventDate: ticket.eventDate,
      eventLocation: ticket.eventLocation,
      eventImageData: ticket.eventImageData,
      tickets: [ticket],
      quantity: 1,
      totalPrice: ticket.pricePaid,
      purchasedAt: ticket.purchasedAt,
    });
  }

  return [...groups.values()].sort(
    (firstGroup, secondGroup) =>
      new Date(secondGroup.purchasedAt).getTime() - new Date(firstGroup.purchasedAt).getTime(),
  );
}
