import type { CreateEventRequest, EventSummary } from './types'; // matches the response from GET /api/events and GET /api/events/{id}

const EVENTS_API_URL = '/api/events';

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // try to extract server message from JSON or text body
    let serverMessage = '';
    try {
      const contentType = response.headers.get('Content-Type') ?? '';
      if (contentType.includes('application/json')) {
        const body = await response.json();
        // attempt common shapes
        serverMessage = body?.message || body?.error || JSON.stringify(body);
      } else {
        serverMessage = await response.text();
      }
    } catch (e) {
      // ignore parsing errors
    }

    throw new Error(`Request failed with status ${response.status}. ${serverMessage}`);
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

export async function updateEvent(eventId: string, payload: CreateEventRequest): Promise<EventSummary> {
  const response = await fetch(`${EVENTS_API_URL}/${eventId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return readJsonResponse<EventSummary>(response);
}
