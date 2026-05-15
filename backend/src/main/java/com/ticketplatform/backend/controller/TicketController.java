package com.ticketplatform.backend.controller;

import com.ticketplatform.backend.dto.ticket.PurchaseTicketRequest;
import com.ticketplatform.backend.dto.ticket.PurchaseTicketResponse;
import com.ticketplatform.backend.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/purchase")
    public ResponseEntity<List<PurchaseTicketResponse>> purchaseTickets(@RequestBody PurchaseTicketRequest request) {
        List<PurchaseTicketResponse> tickets = ticketService.purchaseTickets(request);
        return ResponseEntity.ok(tickets);
    }
}
