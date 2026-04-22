package com.ticketplatform.backend.service;

import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// REQUIREMENT: Data Access / Transactions
// The transaction spans only the execution time of this method, and starts/ends
// within the boundaries of a single HTTP request. It does not last longer than the user's "think" time.
// REQUIREMENT: Memory management
// This is the default Singleton Scope component, which saves RAM (not created separately for each user).

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(Event event) {
        // When updating an event, JPA Optimistic Locking will automatically
        // check the @Version field defined in the 'Event' class.
        return eventRepository.save(event);
    }
}
