package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.config.ApiPaths;
import com.ticketplatform.backend.dto.PurchaseTicketsRequest;
import com.ticketplatform.backend.dto.PurchasedTicketDto;
import com.ticketplatform.backend.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.Tickets.BASE)
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<PurchasedTicketDto>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getMyTickets(authentication));
    }

    @PostMapping("/events/{eventId}")
    public ResponseEntity<List<PurchasedTicketDto>> purchaseTickets(
            @PathVariable UUID eventId,
            @RequestBody PurchaseTicketsRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ticketService.purchaseTickets(eventId, request, authentication));
    }
}
