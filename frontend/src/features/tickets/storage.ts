import type { EventSummary } from '../events/types';
import { MOCK_TICKET_PRICE } from './mockTicketing';
import type { PurchasedTicket } from './types';

const STORAGE_KEY = 'ticket-platform.mock-purchased-tickets';

function isPurchasedTicket(value: unknown): value is PurchasedTicket {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.eventId === 'string' &&
    typeof candidate.eventTitle === 'string' &&
    typeof candidate.eventDate === 'string' &&
    typeof candidate.eventLocation === 'string' &&
    (typeof candidate.eventImageData === 'string' || candidate.eventImageData === null) &&
    typeof candidate.quantity === 'number' &&
    typeof candidate.totalPrice === 'number' &&
    typeof candidate.ticketCode === 'string' &&
    typeof candidate.purchasedAt === 'string'
  );
}

function readPurchasedTickets(): PurchasedTicket[] {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isPurchasedTicket);
  } catch {
    return [];
  }
}

function writePurchasedTickets(tickets: PurchasedTicket[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function generateTicketCode(ticketId: string): string {
  return `TKT-${ticketId.replace(/-/g, '').slice(0, 9).toUpperCase()}`;
}

export function getPurchasedTickets(): PurchasedTicket[] {
  return readPurchasedTickets().sort(
    (firstTicket, secondTicket) =>
      new Date(secondTicket.purchasedAt).getTime() - new Date(firstTicket.purchasedAt).getTime(),
  );
}

export function getPurchasedTicketById(ticketId: string): PurchasedTicket | null {
  return getPurchasedTickets().find((ticket) => ticket.id === ticketId) ?? null;
}

export function savePurchasedTicket(ticket: PurchasedTicket) {
  const existingTickets = getPurchasedTickets().filter(
    (existingTicket) => existingTicket.id !== ticket.id,
  );

  writePurchasedTickets([ticket, ...existingTickets]);
}

export function createMockPurchasedTicket(
  event: EventSummary,
  quantity: number,
): PurchasedTicket {
  const id = window.crypto.randomUUID();

  return {
    id,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventLocation: event.location,
    eventImageData: event.imageData,
    quantity,
    totalPrice: quantity * MOCK_TICKET_PRICE,
    ticketCode: generateTicketCode(id),
    purchasedAt: new Date().toISOString(),
  };
}
