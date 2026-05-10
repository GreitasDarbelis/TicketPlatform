package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.dto.CreateEventRequest;
import com.ticketplatform.backend.dto.PublicEventDto;
import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // REQUIREMENT: 3-tier presentation layer
    // React will call these REST API endpoints. A transaction is started during the HTTP request.

    @GetMapping
    public ResponseEntity<List<PublicEventDto>> getEvents() {
        return ResponseEntity.ok(eventService.getPublicEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PublicEventDto> getEvent(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getPublicEvent(id));
    }

    @PostMapping
    public ResponseEntity<PublicEventDto> createEvent(@RequestBody CreateEventRequest request) {
        PublicEventDto created = eventService.createEvent(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PublicEventDto> updateEvent(@PathVariable UUID id, @RequestBody CreateEventRequest request) {
        // Update existing event by id using a CreateEventRequest-shaped payload.
        // Throws ObjectOptimisticLockingFailureException in case versions no longer match,
        // and GlobalExceptionHandler would return HTTP 409 (Conflict).
        PublicEventDto updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(updated);
    }
}
