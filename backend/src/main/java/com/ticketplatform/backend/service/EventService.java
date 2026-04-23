package com.ticketplatform.backend.service;

import com.ticketplatform.backend.dto.PublicEventDto;
import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.repository.EventRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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

    @Transactional(readOnly = true)
    public java.util.List<PublicEventDto> getPublicEvents() {
        return eventRepository.findAll(Sort.by(Sort.Direction.ASC, "date"))
                .stream()
                .map(this::toPublicEventDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicEventDto getPublicEvent(java.util.UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));

        return toPublicEventDto(event);
    }

    private PublicEventDto toPublicEventDto(Event event) {
        return new PublicEventDto(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getDate(),
                event.getLocation(),
                event.getTotalTickets(),
                event.getOrganizer().getEmail()
        );
    }
}
