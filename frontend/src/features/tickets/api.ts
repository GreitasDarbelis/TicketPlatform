import { API_PATHS } from '../../app/api-paths';

export type TicketValidationResult = {
  accepted: boolean;
  outcome: 'ACCEPTED' | 'REJECTED';
  message: string;
  ticketId: string | null;
  ticketCode: string | null;
};

type ValidateTicketRequest = {
  ticketCode: string;
};

async function readJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

export async function validateTicket(
  eventId: string,
  payload: ValidateTicketRequest,
): Promise<TicketValidationResult> {
  const response = await fetch(API_PATHS.tickets.validate(eventId), {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return readJsonResponse<TicketValidationResult>(response);
}