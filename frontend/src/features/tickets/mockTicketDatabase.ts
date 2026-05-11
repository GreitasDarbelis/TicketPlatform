export type MockPurchasedEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
};

export type MockPurchasedTicket = {
  id: string;
  ticketNumber: string;
  eventId: string;
};

type MockTicketDatabase = {
  events: MockPurchasedEvent[];
  tickets: MockPurchasedTicket[];
};

const STORAGE_KEY = 'ticket-platform.mock-purchased-tickets';

const initialDatabase: MockTicketDatabase = {
  events: [
    {
      id: 'summer-music-festival-2026',
      title: 'Summer Music Festival 2026',
      date: '2026-06-15T18:00:00',
      location: 'Central Park, New York',
      imageUrl:
        'https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBmZXN0aXZhbHxlbnwxfHx8fDE3NzY0MjAyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ],
  tickets: [
    {
      id: 'ticket-1',
      ticketNumber: 'TKT-BIHTMTWIP',
      eventId: 'summer-music-festival-2026',
    },
    {
      id: 'ticket-2',
      ticketNumber: 'TKT-QZ7N42KPA',
      eventId: 'summer-music-festival-2026',
    },
  ],
};

function isMockTicketDatabase(value: unknown): value is MockTicketDatabase {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<MockTicketDatabase>;

  return Array.isArray(candidate.events) && Array.isArray(candidate.tickets);
}

function normalizeMockTicketDatabase(database: MockTicketDatabase): MockTicketDatabase {
  const events = database.events.map((event) => {
    const fallbackEvent = initialDatabase.events.find((candidateEvent) => candidateEvent.id === event.id);

    return {
      ...event,
      imageUrl: event.imageUrl ?? fallbackEvent?.imageUrl ?? '',
    };
  });

  return { ...database, events };
}

export function getMockTicketDatabase(): MockTicketDatabase {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue) as unknown;

      if (isMockTicketDatabase(parsedValue)) {
        const normalizedDatabase = normalizeMockTicketDatabase(parsedValue);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedDatabase));

        return normalizedDatabase;
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase));

  return initialDatabase;
}

export function getPurchasedTicketsWithEvents() {
  const database = getMockTicketDatabase();

  return database.tickets.flatMap((ticket) => {
    const event = database.events.find((candidateEvent) => candidateEvent.id === ticket.eventId);

    return event ? [{ ...ticket, event }] : [];
  });
}

export function getPurchasedEventsWithTickets() {
  const database = getMockTicketDatabase();

  return database.events.flatMap((event) => {
    const tickets = database.tickets.filter((ticket) => ticket.eventId === event.id);

    return tickets.length > 0 ? [{ ...event, tickets }] : [];
  });
}

export function getPurchasedTicketsForEvent(eventId: string | undefined) {
  if (!eventId) {
    return null;
  }

  const database = getMockTicketDatabase();
  const event = database.events.find((candidateEvent) => candidateEvent.id === eventId);

  if (!event) {
    return null;
  }

  const tickets = database.tickets.filter((ticket) => ticket.eventId === event.id);

  return tickets.length > 0 ? { event, tickets } : null;
}
