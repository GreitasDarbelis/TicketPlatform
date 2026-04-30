import type { CreateEventRequest, EventSummary } from './types'; // matches the response from GET /api/events and GET /api/events/{id}

const EVENTS_API_URL = '/api/events';

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function fetchEvents(signal?: AbortSignal): Promise<EventSummary[]> {
  const response = await fetch(EVENTS_API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return readJsonResponse<EventSummary[]>(response);
}

export async function fetchEventById(eventId: string, signal?: AbortSignal): Promise<EventSummary> {
  const response = await fetch(`${EVENTS_API_URL}/${eventId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return readJsonResponse<EventSummary>(response);
}

export async function createEvent(payload: CreateEventRequest): Promise<EventSummary> {
  const response = await fetch(EVENTS_API_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return readJsonResponse<EventSummary>(response);
}
