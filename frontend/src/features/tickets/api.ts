import { API_PATHS } from '../../app/api-paths';
import type { PurchasedTicket } from './types';

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function fetchMyTickets(signal?: AbortSignal): Promise<PurchasedTicket[]> {
  const response = await fetch(API_PATHS.tickets.mine, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return readJsonResponse<PurchasedTicket[]>(response);
}

export async function purchaseTickets(eventId: string, quantity: number): Promise<PurchasedTicket[]> {
  const response = await fetch(API_PATHS.tickets.purchaseByEvent(eventId), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  return readJsonResponse<PurchasedTicket[]>(response);
}
