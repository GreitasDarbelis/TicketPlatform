import {API_PATHS} from "../../app/api-paths";
import type {PurchaseTicketRequest, PurchaseTicketResponse} from "./ticketTypes";

async function readJsonResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed with status ${response.status}.`);
    }
    return response.json() as Promise<T>;
}

async function requestJson<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...init,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...init.headers,
        },
        credentials: 'include',
    });
    return readJsonResponse<T>(response);
}

export async function purchaseTickets(dto: PurchaseTicketRequest): Promise<PurchaseTicketResponse[]> {
    return requestJson<PurchaseTicketResponse[]>(API_PATHS.tickets.purchase, {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}