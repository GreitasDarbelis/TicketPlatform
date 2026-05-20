package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.dto.ticket.PurchaseTicketRequest;
import com.ticketplatform.backend.dto.ticket.PurchaseTicketResponse;
import com.ticketplatform.backend.dto.ticket.UserTicketDto;
import com.ticketplatform.backend.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<UserTicketDto>> getTicketsByEventAndAttendee(@RequestParam UUID eventId, @RequestParam UUID attendeeId) {
        List<UserTicketDto> tickets = ticketService.getTicketsByEventIdAndAttendeeId(eventId, attendeeId);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/purchase")
    public ResponseEntity<List<PurchaseTicketResponse>> purchaseTickets(@RequestBody PurchaseTicketRequest request) {
        List<PurchaseTicketResponse> tickets = ticketService.purchaseTickets(request);
        return ResponseEntity.ok(tickets);
    }
}
