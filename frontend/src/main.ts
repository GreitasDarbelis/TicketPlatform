import './style.css';
import { events, type EventCard } from './data/events';

type Ticket = {
  code: string;
  holder: string;
  generatedAt: string;
};

const appRoot = document.querySelector<HTMLDivElement>('#app');

if (!appRoot) {
  throw new Error('App root was not found.');
}

const app = appRoot;

const allCategories = ['Visi', ...new Set(events.map((event) => event.category))];

const state = {
  activeCategory: 'Visi',
  selectedEventId: events[0]?.id ?? '',
  ticket: null as Ticket | null,
};

const dateFormatter = new Intl.DateTimeFormat('lt-LT', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function getVisibleEvents(): EventCard[] {
  if (state.activeCategory === 'Visi') {
    return events;
  }

  return events.filter((event) => event.category === state.activeCategory);
}

function getSelectedEvent(): EventCard {
  const visibleEvents = getVisibleEvents();

  return (
    visibleEvents.find((event) => event.id === state.selectedEventId) ??
    events.find((event) => event.id === state.selectedEventId) ??
    visibleEvents[0] ??
    events[0]
  );
}

function issueDemoTicket(event: EventCard): void {
  const base = `${event.title}-${event.city}`.replace(/[^a-zA-Z0-9]+/g, '').slice(0, 10);

  state.ticket = {
    code: `${base.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    holder: 'Demo pirkėjas',
    generatedAt: new Date().toISOString(),
  };
}

function renderEventCard(event: EventCard): string {
  const isSelected = event.id === state.selectedEventId;

  return `
    <article class="event-card ${isSelected ? 'event-card--selected' : ''}">
      <div class="event-card__top">
        <span class="pill">${event.category}</span>
        <span class="event-card__price">€${event.price}</span>
      </div>
      <h3>${event.title}</h3>
      <p class="event-card__tagline">${event.tagline}</p>
      <dl class="event-card__meta">
        <div>
          <dt>Data</dt>
          <dd>${dateFormatter.format(new Date(event.startsAt))}</dd>
        </div>
        <div>
          <dt>Vieta</dt>
          <dd>${event.venue}, ${event.city}</dd>
        </div>
        <div>
          <dt>Liko</dt>
          <dd>${event.seatsLeft} bil.</dd>
        </div>
      </dl>
      <button class="ghost-button" data-event-id="${event.id}" type="button">
        ${isSelected ? 'Pasirinkta' : 'Rinktis renginį'}
      </button>
    </article>
  `;
}

function renderTicketPanel(selectedEvent: EventCard): string {
  const issuedAt = state.ticket ? dateFormatter.format(new Date(state.ticket.generatedAt)) : null;

  return `
    <aside class="checkout-panel">
      <div class="checkout-panel__eyebrow">Bilieto išrašymas</div>
      <h2>${selectedEvent.title}</h2>
      <p class="checkout-panel__lead">
        Pasirinkite renginį ir sugeneruokite bilietą su unikaliu kodu.
      </p>

      <div class="summary-card">
        <div class="summary-row">
          <span>Renginys</span>
          <strong>${selectedEvent.title}</strong>
        </div>
        <div class="summary-row">
          <span>Miestas</span>
          <strong>${selectedEvent.city}</strong>
        </div>
        <div class="summary-row">
          <span>Kaina</span>
          <strong>€${selectedEvent.price}</strong>
        </div>
      </div>

      <button id="issue-ticket" class="primary-button" type="button">
        Generuoti bilietą
      </button>

      ${
        state.ticket
          ? `
        <section class="ticket-card">
          <div class="ticket-card__header">
            <div>
              <p class="ticket-card__label">Bilietas paruoštas</p>
              <h3>${state.ticket.holder}</h3>
            </div>
            <span class="ticket-badge">QR</span>
          </div>
          <div class="qr-box" aria-hidden="true">
            <div class="qr-box__code">${state.ticket.code}</div>
          </div>
          <div class="ticket-card__details">
            <div>
              <span>Kodas</span>
              <strong>${state.ticket.code}</strong>
            </div>
            <div>
              <span>Sugeneruota</span>
              <strong>${issuedAt}</strong>
            </div>
          </div>
        </section>
      `
          : `
        <section class="ticket-card ticket-card--placeholder">
          <p>Pasirinkite renginį ir sugeneruokite bilietą, kad matytumėte jo kodą.</p>
        </section>
      `
      }
    </aside>
  `;
}

function render(): void {
  const visibleEvents = getVisibleEvents();
  const selectedEvent = getSelectedEvent();

  app.innerHTML = `
    <div class="page-shell">
      <header class="hero">
        <div class="hero__copy">
          <span class="hero__eyebrow">TicketPlatform</span>
          <h1>Atrask renginius ir įsigyk bilietą vienoje vietoje.</h1>
          <p class="hero__lead">
            Peržiūrėkite artimiausius renginius, pasirinkite norimą datą ir gaukite bilietą per kelias akimirkas.
          </p>
          <div class="hero__actions">
            <a class="primary-button" href="#catalog">Peržiūrėti renginius</a>
            <a class="secondary-button" href="#architecture">Platformos privalumai</a>
          </div>
        </div>
        <div id="architecture" class="hero__note">
          <p class="hero__note-label">Platformos privalumai</p>
          <ul>
            <li>Patogus renginių katalogas pagal temas ir miestus</li>
            <li>Greitas bilieto pasirinkimas viename lange</li>
            <li>Unikalus bilieto kodas kiekvienam pirkimui</li>
          </ul>
        </div>
      </header>

      <main class="layout">
        <section id="catalog" class="catalog-panel">
          <div class="catalog-panel__header">
            <div>
              <p class="section-label">Renginių katalogas</p>
              <h2>Artimiausi renginiai skirtingiems skoniams ir miestams</h2>
            </div>
            <div class="filter-row">
              ${allCategories
                .map(
                  (category) => `
                    <button
                      class="filter-chip ${category === state.activeCategory ? 'filter-chip--active' : ''}"
                      data-category="${category}"
                      type="button"
                    >
                      ${category}
                    </button>
                  `,
                )
                .join('')}
            </div>
          </div>

          <div class="event-grid">
            ${visibleEvents.map((event) => renderEventCard(event)).join('')}
          </div>
        </section>

        ${renderTicketPanel(selectedEvent)}
      </main>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCategory = button.dataset.category ?? 'Visi';

      const visibleAfterFilter = getVisibleEvents();
      state.selectedEventId = visibleAfterFilter[0]?.id ?? events[0]?.id ?? '';
      state.ticket = null;
      render();
    });
  });

  app.querySelectorAll<HTMLButtonElement>('[data-event-id]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedEventId = button.dataset.eventId ?? state.selectedEventId;
      state.ticket = null;
      render();
    });
  });

  app.querySelector<HTMLButtonElement>('#issue-ticket')?.addEventListener('click', () => {
    issueDemoTicket(selectedEvent);
    render();
  });
}

render();
