import type { EventSummary } from './types'; // matches the response from GET /api/events and GET /api/events/{id}
import { API_PATHS } from "../../app/api-paths";

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function fetchEvents(signal?: AbortSignal): Promise<EventSummary[]> {
  const response = await fetch(API_PATHS.events.base, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return readJsonResponse<EventSummary[]>(response);
}

export async function fetchEventById(eventId: string, signal?: AbortSignal): Promise<EventSummary> {
  const response = await fetch(API_PATHS.events.byId(eventId), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  return readJsonResponse<EventSummary>(response);
}