export const MOCK_TICKET_PRICE = 75;
export const DEFAULT_MAX_AVAILABLE_TICKETS = 5000;

export function formatTicketPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAvailableTicketCount(totalTickets: number | null): number {
  return totalTickets ?? DEFAULT_MAX_AVAILABLE_TICKETS;
}
