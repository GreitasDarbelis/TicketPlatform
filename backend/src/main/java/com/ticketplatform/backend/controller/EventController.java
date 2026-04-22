package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.model.Event;
import com.ticketplatform.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // REQUIREMENT: 3-tier presentation layer
    // React will call these REST API endpoints. A transaction is started during the HTTP request.

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event created = eventService.createEvent(event);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @RequestBody Event event) {
        // Throws ObjectOptimisticLockingFailureException in case
        // versions no longer match, and GlobalExceptionHandler would return HTTP 409 (Conflict).
        return ResponseEntity.ok(eventService.updateEvent(event));
    }
}
