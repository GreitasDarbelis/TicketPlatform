import { useState } from 'react';
import { events, type EventCard, type EventCategory } from './data/events';

type Ticket = {
  code: string;
  holder: string;
  generatedAt: string;
};

type CategoryFilter = 'Visi' | EventCategory;

const allCategories: CategoryFilter[] = ['Visi', ...new Set(events.map((event) => event.category))];

const dateFormatter = new Intl.DateTimeFormat('lt-LT', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function issueDemoTicket(event: EventCard): Ticket {
  const base = `${event.title}-${event.city}`.replace(/[^a-zA-Z0-9]+/g, '').slice(0, 10);

  return {
    code: `${base.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    holder: 'Demo pirkėjas',
    generatedAt: new Date().toISOString(),
  };
}

function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Visi');
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id ?? '');
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const visibleEvents =
    activeCategory === 'Visi'
      ? events
      : events.filter((event) => event.category === activeCategory);

  const selectedEvent =
    visibleEvents.find((event) => event.id === selectedEventId) ??
    events.find((event) => event.id === selectedEventId) ??
    visibleEvents[0] ??
    events[0];

  const issuedAt = ticket ? dateFormatter.format(new Date(ticket.generatedAt)) : null;

  function handleCategoryChange(category: CategoryFilter) {
    setActiveCategory(category);

    const nextVisibleEvents =
      category === 'Visi' ? events : events.filter((event) => event.category === category);

    setSelectedEventId(nextVisibleEvents[0]?.id ?? events[0]?.id ?? '');
    setTicket(null);
  }

  function handleEventSelect(eventId: string) {
    setSelectedEventId(eventId);
    setTicket(null);
  }

  if (!selectedEvent) {
    return null;
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">TicketPlatform</span>
          <h1>Atrask renginius ir įsigyk bilietą vienoje vietoje.</h1>
          <p className="hero__lead">
            Peržiūrėkite artimiausius renginius, pasirinkite norimą datą ir gaukite bilietą
            per kelias akimirkas.
          </p>
          <div className="hero__actions">
            <a className="primary-button" href="#catalog">
              Peržiūrėti renginius
            </a>
            <a className="secondary-button" href="#architecture">
              Platformos privalumai
            </a>
          </div>
        </div>

        <div id="architecture" className="hero__note">
          <p className="hero__note-label">Platformos privalumai</p>
          <ul>
            <li>Patogus renginių katalogas pagal temas ir miestus</li>
            <li>Greitas bilieto pasirinkimas viename lange</li>
            <li>Unikalus bilieto kodas kiekvienam pirkimui</li>
          </ul>
        </div>
      </header>

      <main className="layout">
        <section id="catalog" className="catalog-panel">
          <div className="catalog-panel__header">
            <div>
              <p className="section-label">Renginių katalogas</p>
              <h2>Artimiausi renginiai skirtingiems skoniams ir miestams</h2>
            </div>

            <div className="filter-row">
              {allCategories.map((category) => (
                <button
                  key={category}
                  className={`filter-chip ${category === activeCategory ? 'filter-chip--active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="event-grid">
            {visibleEvents.map((event) => {
              const isSelected = event.id === selectedEventId;

              return (
                <article
                  key={event.id}
                  className={`event-card ${isSelected ? 'event-card--selected' : ''}`}
                >
                  <div className="event-card__top">
                    <span className="pill">{event.category}</span>
                    <span className="event-card__price">€{event.price}</span>
                  </div>

                  <h3>{event.title}</h3>
                  <p className="event-card__tagline">{event.tagline}</p>

                  <dl className="event-card__meta">
                    <div>
                      <dt>Data</dt>
                      <dd>{dateFormatter.format(new Date(event.startsAt))}</dd>
                    </div>
                    <div>
                      <dt>Vieta</dt>
                      <dd>
                        {event.venue}, {event.city}
                      </dd>
                    </div>
                    <div>
                      <dt>Liko</dt>
                      <dd>{event.seatsLeft} bil.</dd>
                    </div>
                  </dl>

                  <button
                    className="ghost-button"
                    onClick={() => handleEventSelect(event.id)}
                    type="button"
                  >
                    {isSelected ? 'Pasirinkta' : 'Rinktis renginį'}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="checkout-panel">
          <div className="checkout-panel__eyebrow">Bilieto išrašymas</div>
          <h2>{selectedEvent.title}</h2>
          <p className="checkout-panel__lead">
            Pasirinkite renginį ir sugeneruokite bilietą su unikaliu kodu.
          </p>

          <div className="summary-card">
            <div className="summary-row">
              <span>Renginys</span>
              <strong>{selectedEvent.title}</strong>
            </div>
            <div className="summary-row">
              <span>Miestas</span>
              <strong>{selectedEvent.city}</strong>
            </div>
            <div className="summary-row">
              <span>Kaina</span>
              <strong>€{selectedEvent.price}</strong>
            </div>
          </div>

          <button
            id="issue-ticket"
            className="primary-button"
            onClick={() => setTicket(issueDemoTicket(selectedEvent))}
            type="button"
          >
            Generuoti bilietą
          </button>

          {ticket ? (
            <section className="ticket-card">
              <div className="ticket-card__header">
                <div>
                  <p className="ticket-card__label">Bilietas paruoštas</p>
                  <h3>{ticket.holder}</h3>
                </div>
                <span className="ticket-badge">QR</span>
              </div>

              <div className="qr-box" aria-hidden="true">
                <div className="qr-box__code">{ticket.code}</div>
              </div>

              <div className="ticket-card__details">
                <div>
                  <span>Kodas</span>
                  <strong>{ticket.code}</strong>
                </div>
                <div>
                  <span>Sugeneruota</span>
                  <strong>{issuedAt}</strong>
                </div>
              </div>
            </section>
          ) : (
            <section className="ticket-card ticket-card--placeholder">
              <p>Pasirinkite renginį ir sugeneruokite bilietą, kad matytumėte jo kodą.</p>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
