package com.ticketplatform.backend.service;

import com.ticketplatform.backend.dto.CreateEventRequest;
import com.ticketplatform.backend.dto.PublicEventDto;
import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.model.User;
import com.ticketplatform.backend.repository.EventRepository;
import com.ticketplatform.backend.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

// REQUIREMENT: Data Access / Transactions
// The transaction spans only the execution time of this method, and starts/ends
// within the boundaries of a single HTTP request. It does not last longer than the user's "think" time.
// REQUIREMENT: Memory management
// This is the default Singleton Scope component, which saves RAM (not created separately for each user).

@Service
public class EventService {

    private static final String DEFAULT_ORGANIZER_EMAIL = "organizer@ticketplatform.local";

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PublicEventDto createEvent(CreateEventRequest request) {
        validateCreateRequest(request);

        Event event = new Event();
        event.setTitle(request.title().trim());
        event.setDescription(blankToNull(request.description()));
        event.setDate(parseDateTime(request.date(), request.time()));
        event.setLocation(request.location().trim());
        event.setImageData(blankToNull(request.imageUrl()));
        event.setTotalTickets(request.totalTickets());
        event.setOrganizer(resolveOrganizer(request.organizerEmail()));

        Event savedEvent = eventRepository.save(event);
        return toPublicEventDto(savedEvent);
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
                event.getImageData(),
                event.getTotalTickets(),
                event.getOrganizer().getEmail()
        );
    }

    private void validateCreateRequest(CreateEventRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required.");
        }

        if (isBlank(request.title())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required.");
        }

        if (isBlank(request.location())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Location is required.");
        }

        if (isBlank(request.date()) || isBlank(request.time())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date and time are required.");
        }

        if (request.totalTickets() != null && request.totalTickets() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total tickets must be non-negative.");
        }
    }

    private LocalDateTime parseDateTime(String date, String time) {
        try {
            return LocalDate.parse(date).atTime(LocalTime.parse(time));
        } catch (DateTimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date/time format.");
        }
    }

    private User resolveOrganizer(String organizerEmail) {
        String email = isBlank(organizerEmail) ? DEFAULT_ORGANIZER_EMAIL : organizerEmail.trim();

        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setPasswordHash("temporary-password-hash");
                    user.setRole("ORGANIZER");
                    return userRepository.save(user);
                });
    }

    private String blankToNull(String value) {
        if (isBlank(value)) {
            return null;
        }

        return value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
